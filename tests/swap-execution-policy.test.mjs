import test from "node:test";
import assert from "node:assert/strict";
import { executionGate, buildSwapCall } from "../lib/swap/execution-policy.mjs";
import { readFile } from "node:fs/promises";
const deployment = JSON.parse(await readFile(new URL("../config/deployments.json", import.meta.url), "utf8"));
const W="0x3333333333333333333333333333333333333333";
const T="0x1111111111111111111111111111111111111111";
const P="0x5555555555555555555555555555555555555555";
const me="0x2222222222222222222222222222222222222222";
const ready={chainId:4613,status:"production",releaseApproved:true,auditReviewed:true,
 factory:"0x4444444444444444444444444444444444444444",
 router:"0x6666666666666666666666666666666666666666",wrappedVery:W,feeBps:30};
const quote={amountIn:1000n,amountOut:850n,path:[W,T],pairs:[P],priceImpactBps:120};
const params={deployment:ready,chainId:4613,wallet:me,token:{address:T,verified:true},quote,direction:"very-to-token",slippageBps:50};

test("current undeployed config cannot sign a swap",()=>{
  assert.throws(()=>executionGate({...params,deployment}),/locked/i);
});
test("reviewed deployment requires reviewed token, proper route and fee",()=>{
  assert.equal(executionGate(params),845n);
  assert.throws(()=>executionGate({...params,token:{address:T,verified:false}}),/reviewed tokens/);
  assert.throws(()=>executionGate({...params,chainId:1}),/4613/);
  assert.throws(()=>executionGate({...params,deployment:{...ready,feeBps:null}}),/fee/);
  assert.throws(()=>executionGate({...params,quote:{...quote,path:[T,W]}}),/route/);
  assert.throws(()=>executionGate({...params,quote:{...quote,path:[W,T,W]}}),/route/);
});
test("native input routes to payable router method and correct value",()=>{
  const call=buildSwapCall({direction:"very-to-token",router:ready.router,account:me,
     amountIn:1000n,minOut:845n,path:[W,T],nowSeconds:1_000_000,deadlineMinutes:20});
  assert.equal(call.functionName,"swapExactETHForTokens");
  assert.equal(call.value,1000n);
  assert.deepEqual(call.args,[845n,[W,T],me,1_001_200n]);
});
test("selling token routes to exact amount and no native value",()=>{
  const call=buildSwapCall({direction:"token-to-very",router:ready.router,account:me,
     amountIn:1000n,minOut:845n,path:[T,W],nowSeconds:1_000_000,deadlineMinutes:20});
  assert.equal(call.functionName,"swapExactTokensForETH");
  assert.equal(call.value,0n);
  assert.deepEqual(call.args,[1000n,845n,[T,W],me,1_001_200n]);
});
