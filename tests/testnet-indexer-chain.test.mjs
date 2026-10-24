import test from "node:test";
import assert from "node:assert/strict";
import {indexConfirmedWindow} from "../services/indexer/worker.mjs";
import {createStore} from "../services/indexer/store.mjs";
const factory="0x1111111111111111111111111111111111111111";
test("worker never indexes wrong chain ID, before any database writes",async()=>{
 let wrote=false;
 const client={getChainId:async()=>4613};
 const store={loadCursor:async()=>{wrote=true;return null;}};
 await assert.rejects(indexConfirmedWindow({client,store,factory,deploymentStart:0n,chainId:31337}),/chain ID mismatch/);
 assert.equal(wrote,false);
});
test("store rejects invalid chain ID before database instantiation",()=>{
 assert.throws(()=>createStore("fake",factory,1),/Invalid indexed chain/);
});
