import { neon } from "@neondatabase/serverless";
import { normalizedAmounts } from "./decoder.mjs";

const FACTORY_KEY=4613; // Single VERY-chain writer advisory lock, held for entire commit transaction.
const lower=x=>x.toLowerCase();
export function createStore(databaseUrl, factory) {
  if(!databaseUrl || !factory) throw new Error("Indexer requires DATABASE_URL and factory address.");
  const sql=neon(databaseUrl);
  return {
    async loadCursor() {
      const rows=await sql.query(
        "SELECT block_number,block_hash FROM m06_cursors WHERE chain_id=$1 AND factory_address=$2",
        [4613,lower(factory)]);
      return rows.length?{blockNumber:BigInt(rows[0].block_number),blockHash:rows[0].block_hash}:null;
    },
    async recentBlocks(maxHeight,limit) {
      const rows=await sql.query(
        "SELECT block_number,block_hash FROM m06_blocks WHERE chain_id=$1 AND block_number<=$2 ORDER BY block_number DESC LIMIT $3",
        [4613,maxHeight.toString(),limit]);
      return rows.map(r=>({blockNumber:BigInt(r.block_number),blockHash:r.block_hash}));
    },
    async listPairs(maxHeight) {
      if(maxHeight===null) return [];
      const rows=await sql.query(
        "SELECT pair_address,token0,token1,created_block FROM m06_pairs WHERE chain_id=$1 AND factory_address=$2 AND created_block<=$3 ORDER BY created_block,pair_address",
        [4613,lower(factory),maxHeight.toString()]);
      return rows.map(x=>({address:x.pair_address,token0:x.token0,token1:x.token1,creationBlock:BigInt(x.created_block)}));
    },
    async commit({expected,ancestor,headers,createdPairs,events}) {
      if(!headers.length) throw new Error("Refusing empty checkpoint commit.");
      const ops=[];
      // Explicit serialization plus optimistic cursor assertion. No partial commit on conflicts.
      ops.push(sql.query("SELECT pg_advisory_xact_lock($1)",[FACTORY_KEY]));
      ops.push(sql.query("SELECT m06_assert_cursor($1,$2,$3,$4)",
        [4613,lower(factory),expected?.blockNumber.toString()??null,expected?.blockHash??null]));
      if(expected && ancestor!==null && ancestor<expected.blockNumber) {
        // Delete orphaned blocks; ON DELETE CASCADE removes pairs, logs, normalizations & checks.
        // Delete cursor first because its FK references a potentially orphaned block.
        ops.push(sql.query("DELETE FROM m06_cursors WHERE chain_id=$1 AND factory_address=$2",
          [4613,lower(factory)]));
        ops.push(sql.query("DELETE FROM m06_blocks WHERE chain_id=$1 AND block_number>$2",
          [4613,ancestor.toString()]));
      }
      for(const h of headers) {
        ops.push(sql.query(
          "INSERT INTO m06_blocks(chain_id,block_number,block_hash,parent_hash,timestamp_seconds) VALUES($1,$2,$3,$4,$5) ON CONFLICT(chain_id,block_number) DO NOTHING",
          [4613,h.number.toString(),lower(h.hash),lower(h.parentHash),h.timestamp.toString()]));
      }
      for(const p of createdPairs) {
        ops.push(sql.query(
          "INSERT INTO m06_pairs(chain_id,factory_address,pair_address,token0,token1,created_block,created_tx,created_log_index) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(chain_id,pair_address) DO NOTHING",
          [4613,lower(factory),lower(p.address),lower(p.token0),lower(p.token1),p.creationBlock.toString(),lower(p.transactionHash),p.logIndex]));
      }
      for(const ev of events) {
        const base=[4613,ev.transactionHash,ev.logIndex];
        ops.push(sql.query(
          "INSERT INTO m06_events(chain_id,pair_address,block_number,block_hash,transaction_hash,log_index,event_name,args) VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb) ON CONFLICT(chain_id,transaction_hash,log_index) DO NOTHING",
          [4613,ev.pair,ev.blockNumber.toString(),ev.blockHash,...base.slice(1),ev.eventName,JSON.stringify(ev.args)]));
        const d=normalizedAmounts(ev);
        if(d.kind==="swap") ops.push(sql.query(
          "INSERT INTO m06_swaps(chain_id,transaction_hash,log_index,amount0_in,amount1_in,amount0_out,amount1_out,sender,recipient) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING",
          [...base,d.amount0In,d.amount1In,d.amount0Out,d.amount1Out,lower(d.sender),lower(d.to)]));
        if(d.kind==="mint" || d.kind==="burn") ops.push(sql.query(
          "INSERT INTO m06_liquidity_actions(chain_id,transaction_hash,log_index,action,amount0,amount1,sender,recipient) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING",
          [...base,d.kind,d.amount0,d.amount1,lower(d.sender),d.to?lower(d.to):null]));
        if(d.kind==="sync") ops.push(sql.query(
          "INSERT INTO m06_syncs(chain_id,transaction_hash,log_index,reserve0,reserve1) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
          [...base,d.reserve0,d.reserve1]));
        if(d.kind==="transfer") ops.push(sql.query(
          "INSERT INTO m06_lp_transfers(chain_id,transaction_hash,log_index,sender,recipient,amount) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",
          [...base,lower(d.from),lower(d.to),d.value]));
      }
      const last=headers[headers.length-1];
      ops.push(sql.query(
        "INSERT INTO m06_cursors(chain_id,factory_address,block_number,block_hash) VALUES($1,$2,$3,$4) ON CONFLICT(chain_id,factory_address) DO UPDATE SET block_number=EXCLUDED.block_number,block_hash=EXCLUDED.block_hash,updated_at=now()",
        [4613,lower(factory),last.number.toString(),lower(last.hash)]));
      await sql.transaction(ops);
      return {lastBlock:last.number,pools:createdPairs.length,events:events.length,rewound:expected && ancestor<expected.blockNumber};
    },
    async latestIndexedReserves(pair,atBlock) {
      const rows=await sql.query(
        "SELECT s.reserve0,s.reserve1 FROM m06_syncs s JOIN m06_events e ON e.chain_id=s.chain_id AND e.transaction_hash=s.transaction_hash AND e.log_index=s.log_index WHERE e.chain_id=$1 AND e.pair_address=$2 AND e.block_number<=$3 ORDER BY e.block_number DESC,e.log_index DESC LIMIT 1",
        [4613,lower(pair),atBlock.toString()]);
      return rows.length?{reserve0:BigInt(rows[0].reserve0),reserve1:BigInt(rows[0].reserve1)}:null;
    },
    async storeReconciliation(pair,height,status,indexed,actual) {
      await sql.query(
        "INSERT INTO m06_reconciliation_checks(chain_id,pair_address,at_block,status,indexed_reserve0,indexed_reserve1,chain_reserve0,chain_reserve1) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(chain_id,pair_address,at_block) DO UPDATE SET status=EXCLUDED.status,indexed_reserve0=EXCLUDED.indexed_reserve0,indexed_reserve1=EXCLUDED.indexed_reserve1,chain_reserve0=EXCLUDED.chain_reserve0,chain_reserve1=EXCLUDED.chain_reserve1,checked_at=now()",
        [4613,lower(pair),height.toString(),status,indexed?.reserve0.toString()??null,indexed?.reserve1.toString()??null,actual?.reserve0.toString()??null,actual?.reserve1.toString()??null]);
    },
  };
}
