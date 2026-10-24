import test from "node:test";
import assert from "node:assert/strict";
import {reconcilePool} from "../services/indexer/reconcile.mjs";
const hash=n=>"0x"+BigInt(n).toString(16).padStart(64,"0");
const pool="0x1111111111111111111111111111111111111111";
function context(r0,r1,indexed) {
  const checks=[];
  const client={
    getChainId:async()=>4613,
    getBlock:async()=>({hash:hash(42)}),
    readContract:async()=>[r0,r1,0],
  };
  const store={
    latestIndexedReserves:async()=>indexed,
    storeReconciliation:async(...values)=>checks.push(values),
  };
  return {client,store,checks,pair:pool,checkpoint:{blockNumber:42n,blockHash:hash(42)}};
}
test("reconcile writes match only for reserves at same indexed block",async()=>{
 const ctx=context(100n,200n,{reserve0:100n,reserve1:200n});
 const outcome=await reconcilePool(ctx);
 assert.equal(outcome.status,"match");
 assert.equal(ctx.checks.length,1);
 assert.equal(ctx.checks[0][1],42n);
});
test("reconcile records mismatch when reserves diverge",async()=>{
 const ctx=context(100n,300n,{reserve0:100n,reserve1:200n});
 assert.equal((await reconcilePool(ctx)).status,"mismatch");
});
test("zero reserves without Sync marked uninitialized and unknown fork refused",async()=>{
 const ctx=context(0n,0n,null);
 assert.equal((await reconcilePool(ctx)).status,"uninitialized");
 ctx.client.getBlock=async()=>({hash:hash(21)});
 await assert.rejects(reconcilePool(ctx),/Chain moved/);
});
