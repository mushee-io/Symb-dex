import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {assertLiquidityWrite,isPoolReadConfigured,buildAddCall,buildRemoveCall,quoteLimits} from "../lib/liquidity/policy.mjs";
const real=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));
const W="0x1111111111111111111111111111111111111111";
const A="0x2222222222222222222222222222222222222222";
const B="0x3333333333333333333333333333333333333333";
const me="0x4444444444444444444444444444444444444444";
const factory="0x5555555555555555555555555555555555555555";
const router="0x6666666666666666666666666666666666666666";
const approved={...real, status:"production",releaseApproved:true,auditReviewed:true,factory,router,wrappedVery:W};
const ok={deployment:approved,chainId:4613,account:me,tokens:[{address:A,verified:true},{address:B,verified:true}]};
test("Milestone 5 is locked with the actual undeployed configuration",()=>{
  assert.equal(isPoolReadConfigured(real),false);
  assert.throws(()=>assertLiquidityWrite({...ok,deployment:real}),/locked/);
});
test("write gate requires reviewed assets and chain",()=>{
  assert.equal(assertLiquidityWrite(ok),true);
  assert.throws(()=>assertLiquidityWrite({...ok,chainId:1}),/VERY/);
  assert.throws(()=>assertLiquidityWrite({...ok,tokens:[{address:A,verified:false},{address:B,verified:true}]}),/reviewed/);
  assert.throws(()=>assertLiquidityWrite({...ok,tokens:[{address:A,verified:true},{address:A,verified:true}]}),/different/);
});
test("native VERY deposit uses payable ETH-named ABI with correct ordering",()=>{
  const input={tokenA:W,tokenB:A,amountA:100n,amountB:300n,minA:95n,minB:285n,wrappedVery:W,account:me,deadline:100000n};
  assert.deepEqual(buildAddCall(input),{functionName:"addLiquidityETH",args:[A,300n,285n,95n,me,100000n],value:100n});
  assert.deepEqual(buildAddCall({...input,tokenA:A,tokenB:W,amountA:300n,amountB:100n,minA:285n,minB:95n}),{
    functionName:"addLiquidityETH",args:[A,300n,285n,95n,me,100000n],value:100n});
});
test("ERC20/ERC20 deposits and withdrawals preserve token order",()=>{
  assert.equal(buildAddCall({tokenA:A,tokenB:B,amountA:100n,amountB:200n,minA:95n,minB:190n,wrappedVery:W,account:me,deadline:100n}).functionName,"addLiquidity");
  const call=buildRemoveCall({token0:W,token1:A,liquidity:100n,min0:80n,min1:90n,wrappedVery:W,account:me,deadline:100n});
  assert.deepEqual(call,{functionName:"removeLiquidityETH",args:[A,100n,90n,80n,me,100n],value:0n});
});
test("invalid inputs and slippage are blocked",()=>{
  assert.throws(()=>buildAddCall({tokenA:A,tokenB:A,amountA:1n,amountB:2n,minA:1n,minB:1n,wrappedVery:W,account:me,deadline:100n}));
  assert.deepEqual(quoteLimits(10000n,5000n,50),[9950n,4975n]);
});
