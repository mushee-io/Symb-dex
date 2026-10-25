// Read-only, opt-in VERY Chain indexer. Never signs or sends transactions.
// Apply db/liquidity-schema.sql first. Run only after M02 verifies its factory.
import { createPublicClient,http,decodeEventLog,getAddress,isAddress,parseAbi,zeroAddress } from "viem";
import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";

const deployment=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));
const net=JSON.parse(await readFile(new URL("../config/very-mainnet.json",import.meta.url),"utf8"));
const factory=deployment.factory;
const start=process.env.SYMB_INDEXER_START_BLOCK;
if (!isAddress(factory??"") || getAddress(factory)===zeroAddress ||
    deployment.chainId!==4613 || !process.env.DATABASE_URL ||
    !start || !/^\d+$/.test(start)) {
  console.error("Set DATABASE_URL, SYMB_INDEXER_START_BLOCK and a verified factory in deployments.json.");
  process.exit(1);
}
const sql=neon(process.env.DATABASE_URL);
const client=createPublicClient({transport:http(net.rpcUrl,{timeout:15000,retryCount:2})});
if(await client.getChainId()!==4613) throw new Error("Indexer RPC chain ID mismatch.");
const code=await client.getBytecode({address:getAddress(factory)});
if(!code || code==="0x") throw new Error("Configured factory lacks deployed code.");
const head=await client.getBlockNumber();
const confirmed=head>=12n?head-12n:0n;
const origin=BigInt(start);
if(confirmed<origin){console.log("No sufficiently confirmed blocks.");process.exit(0);}
const previous=await sql.query("SELECT block_number,block_hash FROM liquidity_indexer_checkpoints WHERE chain_id=$1 AND factory_address=$2",[4613,factory.toLowerCase()]);
let from=origin;
if(previous.length){
  const last=BigInt(previous[0].block_number);
  const existing=await client.getBlock({blockNumber:last});
  if(existing.hash.toLowerCase()!==previous[0].block_hash.toLowerCase())
    throw new Error("Checkpoint block hash mismatch: deep reorganization. Halt for operator reconciliation.");
  from=last+1n;
}
if(from>confirmed){console.log("Up to date.");process.exit(0);}
const to=from+249n<confirmed?from+249n:confirmed;
const factoryAbi=parseAbi(["function allPairsLength() view returns (uint256)","function allPairs(uint256) view returns (address)"]);
const pairAbi=parseAbi(["function token0() view returns (address)","function token1() view returns (address)"]);
const events=parseAbi([
  "event Mint(address indexed sender,uint256 amount0,uint256 amount1)",
  "event Burn(address indexed sender,uint256 amount0,uint256 amount1,address indexed to)",
  "event Swap(address indexed sender,uint256 amount0In,uint256 amount1In,uint256 amount0Out,uint256 amount1Out,address indexed to)",
  "event Sync(uint112 reserve0,uint112 reserve1)",
  "event Transfer(address indexed from,address indexed to,uint256 value)"
]);
const count=await client.readContract({address:getAddress(factory),abi:factoryAbi,functionName:"allPairsLength",blockNumber:to});
if(count>300n) throw new Error("Pair count exceeds this bounded scanner. Scale ingestion before proceeding.");
const pairs=[];
for(let i=0n;i<count;i++){
  const pair=await client.readContract({address:getAddress(factory),abi:factoryAbi,functionName:"allPairs",args:[i],blockNumber:to});
  if(!await client.getBytecode({address:pair,blockNumber:to})) throw new Error("Factory returned pool without bytecode.");
  const [token0,token1]=await Promise.all([
    client.readContract({address:pair,abi:pairAbi,functionName:"token0",blockNumber:to}),
    client.readContract({address:pair,abi:pairAbi,functionName:"token1",blockNumber:to})
  ]);
  pairs.push({address:pair.toLowerCase(),token0:token0.toLowerCase(),token1:token1.toLowerCase()});
}
const logs=pairs.length?await client.getLogs({address:pairs.map(p=>getAddress(p.address)),fromBlock:from,toBlock:to}):[];
const batch=[];
for(const pair of pairs){
  batch.push(sql.query(
    "INSERT INTO liquidity_pools(chain_id,pair_address,factory_address,token0,token1,first_seen_block) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(chain_id,pair_address) DO NOTHING",
    [4613,pair.address,factory.toLowerCase(),pair.token0,pair.token1,from.toString()]
  ));
}
let recognized=0;
for(const log of logs){
  let decoded;
  try {decoded=decodeEventLog({abi:events,data:log.data,topics:log.topics});}
  catch {continue;}
  const args=JSON.stringify(decoded.args,(_key,value)=>typeof value==="bigint"?value.toString():value);
  batch.push(sql.query(
    "INSERT INTO liquidity_events(chain_id,pair_address,block_number,block_hash,transaction_hash,log_index,event_name,args) VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb) ON CONFLICT(chain_id,transaction_hash,log_index) DO NOTHING",
    [4613,log.address.toLowerCase(),log.blockNumber.toString(),log.blockHash,log.transactionHash,log.logIndex,decoded.eventName,args]
  ));
  recognized++;
}
const checkpoint=await client.getBlock({blockNumber:to});
batch.push(sql.query(
  "INSERT INTO liquidity_indexer_checkpoints(chain_id,factory_address,block_number,block_hash) VALUES($1,$2,$3,$4) ON CONFLICT(chain_id,factory_address) DO UPDATE SET block_number=excluded.block_number,block_hash=excluded.block_hash,updated_at=now()",
  [4613,factory.toLowerCase(),to.toString(),checkpoint.hash]
));
await sql.transaction(batch);
console.log("Indexed",from.toString(),"-",to.toString(),"pools",pairs.length,"events",recognized);
