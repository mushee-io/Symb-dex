import { getAddress } from "viem";
import {confirmedHead,nextWindow,findCanonicalAncestor,assertHeaderContinuity,MAX_REORG_DEPTH} from "./chain.mjs";
import {factoryEvents,pairEvents,factoryReadAbi,pairReadAbi,parsePairCreation,normalizePairLog,validAddress} from "./decoder.mjs";
import { toEventSelector } from "viem";

const same=(a,b)=>a.toLowerCase()===b.toLowerCase();
const pairTopics=new Set(pairEvents.map(event=>toEventSelector(event).toLowerCase()));
const WINDOW_LIMIT=100;
const POOL_LIMIT=400;
const EVENT_LIMIT=2500;
const LOG_POOL_BATCH=20;

export async function indexConfirmedWindow({
  client,store,factory,deploymentStart,confirmations=12,batchSize=50,
  maxReorgDepth=MAX_REORG_DEPTH,
}) {
  if(!client || !store || !validAddress(factory) || typeof deploymentStart!=="bigint" ||
      deploymentStart<0n || !Number.isInteger(batchSize) || batchSize<1 || batchSize>WINDOW_LIMIT)
    throw new Error("Invalid indexer configuration.");
  factory=getAddress(factory);
  if(await client.getChainId()!==4613) throw new Error("Refusing to index a non-VERY RPC.");
  const factoryCode=await client.getBytecode({address:factory});
  if(!factoryCode || factoryCode==="0x") throw new Error("Configured factory is not deployed.");
  const head=await client.getBlockNumber();
  const confirmed=confirmedHead(head,confirmations);
  if(confirmed===null || confirmed<deploymentStart) return {status:"awaiting-confirmations"};
  const checkpoint=await store.loadCursor();
  let ancestor=null;
  if(checkpoint) {
    const older=await store.recentBlocks(checkpoint.blockNumber,maxReorgDepth+1);
    ancestor=await findCanonicalAncestor(checkpoint,older,
      (number)=>client.getBlock({blockNumber:number}),maxReorgDepth);
    if(ancestor<checkpoint.blockNumber && ancestor<deploymentStart-1n)
      throw new Error("Reorg predates deployment start: human reconciliation required.");
  }
  const window=nextWindow({checkpoint,ancestor,deploymentStart,confirmed,batchSize});
  if(!window) return {status:"caught-up",checkpoint:checkpoint?.blockNumber??null};
  const anchorNumber=window.from>0n?window.from-1n:null;
  const anchor=anchorNumber===null?null:await client.getBlock({blockNumber:anchorNumber});
  if(checkpoint && ancestor===checkpoint.blockNumber &&
     anchor && !same(anchor.hash,checkpoint.blockHash))
    throw new Error("RPC changed canonical anchor during indexing.");

  const headers=[];
  // Bootstrap an anchor header so the initial checkpoint has a local reorg ancestor.
  if(!checkpoint && anchor) headers.push(anchor);
  for(let h=window.from;h<=window.to;h++) headers.push(await client.getBlock({blockNumber:h}));
  assertHeaderContinuity(headers,checkpoint?anchor?.hash??null:null);
  const scanned=headers.filter(h=>h.number>=window.from);
  if(anchor && !same(scanned[0].parentHash,anchor.hash))
    throw new Error("Read block window changed during RPC scan.");
  const headerByNumber=new Map(scanned.map(h=>[h.number.toString(),h]));

  const previousPairs=await store.listPairs(ancestor);
  if(previousPairs.length>POOL_LIMIT) throw new Error("Factory pool count exceeds configured worker limit.");
  const discovered=await client.getLogs({
    address:factory,event:factoryEvents[0],fromBlock:window.from,toBlock:window.to,
  });
  if(discovered.length>POOL_LIMIT) throw new Error("Too many newly created pools in one batch.");
  const freshPairs=[];
  const allPairs=new Map(previousPairs.map(p=>[p.address.toLowerCase(),p]));
  for(const log of discovered) {
    const header=headerByNumber.get(BigInt(log.blockNumber).toString());
    if(!header || !same(header.hash,log.blockHash)) throw new Error("Factory log block hash mismatch.");
    const record=parsePairCreation(log,factory);
    const id=record.address.toLowerCase();
    if(allPairs.has(id)) throw new Error("Duplicate PairCreated address.");
    allPairs.set(id,record);
    freshPairs.push(record);
  }
  if(allPairs.size>POOL_LIMIT) throw new Error("More than 400 registered pools; scale worker before indexing.");
  // Validate factory provenance and pair token identities at the same target block.
  for(const pair of freshPairs) {
    const code=await client.getBytecode({address:pair.address,blockNumber:window.to});
    if(!code || code==="0x") throw new Error("Created pair has no bytecode.");
    const [token0,token1,registered]=await Promise.all([
      client.readContract({address:pair.address,abi:pairReadAbi,functionName:"token0",blockNumber:window.to}),
      client.readContract({address:pair.address,abi:pairReadAbi,functionName:"token1",blockNumber:window.to}),
      client.readContract({address:factory,abi:factoryReadAbi,functionName:"getPair",args:[pair.token0,pair.token1],blockNumber:window.to}),
    ]);
    if(!same(pair.token0,token0) || !same(pair.token1,token1) || !same(pair.address,registered))
      throw new Error("Factory created pool with invalid provenance or token ordering.");
  }

  const addrs=[...allPairs.keys()].map(a=>getAddress(a));
  const logs=[];
  for(let i=0;i<addrs.length;i+=LOG_POOL_BATCH) {
    const part=await client.getLogs({
      address:addrs.slice(i,i+LOG_POOL_BATCH),fromBlock:window.from,toBlock:window.to
    });
    logs.push(...part);
    if(logs.length>EVENT_LIMIT) throw new Error("Event count exceeds bounded window limit; reduce block batch.");
  }
  const events=[];
  for(const log of logs) {
    // Unknown event signatures (including approvals) are not pair activity;
    // recognized signatures that are malformed are fatal, never silently skipped.
    if(!pairTopics.has(log.topics?.[0]?.toLowerCase())) continue;
    events.push(normalizePairLog(log,allPairs,headerByNumber));
  }
  events.sort((a,b)=>a.blockNumber===b.blockNumber?
    a.logIndex-b.logIndex:a.blockNumber<b.blockNumber?-1:1);
  const revisited=await client.getBlock({blockNumber:window.to});
  if(!same(revisited.hash,scanned[scanned.length-1].hash))
    throw new Error("Canonical tip moved during indexing. Aborting batch.");
  const result=await store.commit({
    expected:checkpoint,ancestor,headers,createdPairs:freshPairs,events
  });
  return {...result,status:"indexed",from:window.from,to:window.to};
}
