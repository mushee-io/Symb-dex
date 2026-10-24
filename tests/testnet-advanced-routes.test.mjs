import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("demo token creator and test order routes never silently enable real funds",async()=>{
 const launch=await readFile(new URL("../components/testnet/demo-launch.tsx",import.meta.url),"utf8");
 const orders=await readFile(new URL("../components/testnet/demo-orders.tsx",import.meta.url),"utf8");
 const config=JSON.parse(await readFile(new URL("../config/deployments.testnet.json",import.meta.url),"utf8"));
 assert.equal(config.tokenCreator,null);
 assert.equal(config.limitBook,null);
 assert.equal(config.realFundsAllowed,false);
 for(const page of [launch,orders]){
  assert.match(page,/waitForTransactionReceipt/);
  assert.match(page,/demoNetwork|demoDeployment/);
  assert.match(page,/4613/);
 }
 assert.match(orders,/exactApproval/);
 assert.match(orders,/cancel/);
});
