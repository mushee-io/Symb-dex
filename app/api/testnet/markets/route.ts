import {NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";
import {demoNetwork,demoDeployment,testnetReady} from "@/lib/testnet/network";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
const unavailable=(status:string)=>NextResponse.json({status,markets:[],recentSwaps:[],chainId:demoNetwork?.chainId??null},
 {status:503,headers});
export async function GET(){
 if(!testnetReady||!demoNetwork||!demoDeployment||demoNetwork.chainId===4613)return unavailable("no-public-testnet");
 if(!process.env.TESTNET_DATABASE_URL)return unavailable("indexer-not-provisioned");
 try{
  const sql=neon(process.env.TESTNET_DATABASE_URL);
  const chain=demoNetwork.chainId,factory=demoDeployment.factory.toLowerCase();
  const cursor=await sql`SELECT block_number,block_hash,updated_at FROM m06_cursors
   WHERE chain_id=${chain} AND factory_address=${factory} LIMIT 1`;
  if(!cursor.length)return unavailable("waiting-for-canonical-indexer");
  // Factory and block filters prevent mixing this test deployment with other chains.
  const markets=await sql`
   SELECT p.pair_address,p.token0,p.token1,p.created_block,
     (SELECT COUNT(*)::INT FROM m06_events e
       WHERE e.chain_id=p.chain_id AND e.pair_address=p.pair_address AND e.event_name='Swap'
         AND e.block_number<=${cursor[0].block_number}) AS swap_count,
     (SELECT s.reserve0::TEXT FROM m06_events e JOIN m06_syncs s
       ON s.chain_id=e.chain_id AND s.transaction_hash=e.transaction_hash AND s.log_index=e.log_index
       WHERE e.chain_id=p.chain_id AND e.pair_address=p.pair_address
         AND e.block_number<=${cursor[0].block_number}
       ORDER BY e.block_number DESC,e.log_index DESC LIMIT 1) AS reserve0,
     (SELECT s.reserve1::TEXT FROM m06_events e JOIN m06_syncs s
       ON s.chain_id=e.chain_id AND s.transaction_hash=e.transaction_hash AND s.log_index=e.log_index
       WHERE e.chain_id=p.chain_id AND e.pair_address=p.pair_address
         AND e.block_number<=${cursor[0].block_number}
       ORDER BY e.block_number DESC,e.log_index DESC LIMIT 1) AS reserve1
    FROM m06_pairs p WHERE p.chain_id=${chain} AND p.factory_address=${factory}
      AND p.created_block<=${cursor[0].block_number}
    ORDER BY swap_count DESC,p.created_block DESC LIMIT 50
  `;
  const recent=await sql`
   SELECT e.transaction_hash,e.block_number,e.log_index,p.token0,p.token1,
     s.amount0_in::TEXT,s.amount1_in::TEXT,s.amount0_out::TEXT,s.amount1_out::TEXT
    FROM m06_events e JOIN m06_swaps s
      ON s.chain_id=e.chain_id AND s.transaction_hash=e.transaction_hash AND s.log_index=e.log_index
    JOIN m06_pairs p ON p.chain_id=e.chain_id AND p.pair_address=e.pair_address
    WHERE e.chain_id=${chain} AND p.factory_address=${factory}
      AND e.block_number<=${cursor[0].block_number}
    ORDER BY e.block_number DESC,e.log_index DESC LIMIT 30
  `;
  const counters=await sql`
    SELECT
     (SELECT COUNT(*)::INT FROM m06_pairs WHERE chain_id=${chain} AND factory_address=${factory}
       AND created_block<=${cursor[0].block_number}) AS pools,
     (SELECT COUNT(*)::INT FROM m06_events e JOIN m06_pairs p
       ON p.chain_id=e.chain_id AND p.pair_address=e.pair_address
       WHERE e.chain_id=${chain} AND p.factory_address=${factory}
         AND e.event_name='Swap' AND e.block_number<=${cursor[0].block_number}) AS swap_events,
     (SELECT COUNT(*)::INT FROM m06_liquidity_actions l
       JOIN m06_events e ON e.chain_id=l.chain_id AND e.transaction_hash=l.transaction_hash AND e.log_index=l.log_index
       JOIN m06_pairs p ON p.chain_id=e.chain_id AND p.pair_address=e.pair_address
       WHERE l.chain_id=${chain} AND p.factory_address=${factory} AND l.action='mint'
         AND e.block_number<=${cursor[0].block_number}) AS deposits,
     (SELECT COUNT(*)::INT FROM m06_liquidity_actions l
       JOIN m06_events e ON e.chain_id=l.chain_id AND e.transaction_hash=l.transaction_hash AND e.log_index=l.log_index
       JOIN m06_pairs p ON p.chain_id=e.chain_id AND p.pair_address=e.pair_address
       WHERE l.chain_id=${chain} AND p.factory_address=${factory} AND l.action='burn'
         AND e.block_number<=${cursor[0].block_number}) AS withdrawals
  `;
  return NextResponse.json({
   status:"indexed",chainId:chain,factory,canonicalBlock:cursor[0].block_number?.toString(),
   canonicalBlockHash:cursor[0].block_hash,
   indexedAt:cursor[0].updated_at,source:"confirmed valueless EVM sandbox events",
   includesTestBots:true,usdVolume:null,usdTvl:null,
   counters:counters[0],markets,recentSwaps:recent
  },{headers});
 }catch(error){
  console.error("Testnet markets read failed:",error instanceof Error?error.message:"unknown");
  return unavailable("indexer-error");
 }
}
