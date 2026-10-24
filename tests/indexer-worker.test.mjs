import test from "node:test";
import assert from "node:assert/strict";
import {indexConfirmedWindow} from "../services/indexer/worker.mjs";
const h=n=>"0x"+BigInt(n).toString(16).padStart(64,"0");
const factory="0x1111111111111111111111111111111111111111";
function createFake(height=25n, hashes={}){
 const client={
  getChainId:async()=>4613,
  getBytecode:async()=> "0x60006000",
  getBlockNumber:async()=>height,
  getBlock:async({blockNumber})=>({number:blockNumber,hash:hashes[String(blockNumber)]??h(blockNumber+1n),parentHash:h(blockNumber),timestamp:1700000000n+blockNumber}),
  getLogs:async()=>[],
 };
 const cursor={value:null};
 const commits=[];
 const store={
  loadCursor:async()=>cursor.value,
  recentBlocks:async(n)=>commits.flatMap(x=>x.headers).filter(x=>x.number<=n).reverse().map(x=>({blockNumber:x.number,blockHash:x.hash})),
  listPairs:async()=>[],
  commit:async(batch)=>{commits.push(batch);const end=batch.headers.at(-1);cursor.value={blockNumber:end.number,blockHash:end.hash};return {lastBlock:end.number,pools:batch.createdPairs.length,events:batch.events.length};}
 };
 return {client,store,commits,cursor};
}
test("worker indexes bounded confirmed headers and resumes without duplicate blocks",async()=>{
 const f=createFake();
 const args={...f,factory,deploymentStart:5n,confirmations:5,batchSize:7};
 const one=await indexConfirmedWindow(args);
 assert.deepEqual([one.from,one.to],[5n,11n]);
 assert.deepEqual(f.commits[0].headers.map(x=>x.number),[4n,5n,6n,7n,8n,9n,10n,11n]);
 const two=await indexConfirmedWindow(args);
 assert.deepEqual([two.from,two.to],[12n,18n]);
 const three=await indexConfirmedWindow(args);
 assert.deepEqual([three.from,three.to],[19n,20n]);
 assert.equal((await indexConfirmedWindow(args)).status,"caught-up");
});
test("worker fails closed on wrong chain and missing contract",async()=>{
 const f=createFake();f.client.getChainId=async()=>1;
 await assert.rejects(indexConfirmedWindow({...f,factory,deploymentStart:0n}),/non-VERY/);
 f.client.getChainId=async()=>4613;f.client.getBytecode=async()=>undefined;
 await assert.rejects(indexConfirmedWindow({...f,factory,deploymentStart:0n}),/not deployed/);
});
test("stale RPC parent is detected before checkpoint commit",async()=>{
 const f=createFake(20n,{"7":h(899)});
 await assert.rejects(indexConfirmedWindow({...f,factory,deploymentStart:6n,confirmations:5,batchSize:4}),/discontinuous|canonical/);
 assert.equal(f.commits.length,0);
});

test("shallow reorg replays from the last matching canonical ancestor",async()=>{
  const f=createFake(25n);
  const args={...f,factory,deploymentStart:5n,confirmations:5,batchSize:7};
  await indexConfirmedWindow(args); // initial chain: indexed through block 11
  const original=f.client.getBlock;
  f.client.getBlock=async({blockNumber})=>{
    if(blockNumber<10n) return original({blockNumber});
    return {
      number:blockNumber,
      hash:h(900n+blockNumber),
      parentHash:blockNumber===10n?h(10):h(899n+blockNumber),
      timestamp:1700000000n+blockNumber,
    };
  };
  const next=await indexConfirmedWindow(args);
  assert.equal(next.status,"indexed");
  assert.deepEqual([next.from,next.to],[10n,16n]);
  const commit=f.commits.at(-1);
  assert.equal(commit.expected.blockNumber,11n);
  assert.equal(commit.ancestor,9n);
  assert.deepEqual(commit.headers.map(x=>x.number),[10n,11n,12n,13n,14n,15n,16n]);
});
