import test from "node:test";
import assert from "node:assert/strict";
import {sqrt,initialLiquidity,proportionalAmount,previewAdd,previewRemove,position,applySlippage,percentageOfBalance} from "../lib/liquidity/math.mjs";
test("integer sqrt rounds down even for huge balances",()=>{
  assert.equal(sqrt(0n),0n);assert.equal(sqrt(15n),3n);assert.equal(sqrt(10n**36n),10n**18n);
});
test("initial liquidity has locked LP and refuses insufficient deposits",()=>{
  assert.deepEqual(initialLiquidity(1_000_000n,1_000_000n),{minted:999_000n,locked:1_000n});
  assert.throws(()=>initialLiquidity(100n,100n),/too small/);
});
test("reserves ratio and minted LP never overstate available amounts",()=>{
  assert.equal(proportionalAmount(100n,200n,600n),300n);
  assert.deepEqual(previewAdd(100n,400n,200n,600n,1000n),{
    minted:500n,usedA:100n,usedB:300n,locked:0n,initial:false
  });
  assert.deepEqual(previewAdd(200n,300n,200n,600n,1000n),{
    minted:500n,usedA:100n,usedB:300n,locked:0n,initial:false
  });
  assert.throws(()=>previewAdd(100n,100n,0n,500n,1000n),/Inconsistent/);
});
test("LP positions and withdrawal shares use integer floor",()=>{
  assert.deepEqual(position(25n,100n,4000n,2000n),{amount0:1000n,amount1:500n,shareBps:2500n});
  assert.deepEqual(previewRemove(25n,100n,4000n,2000n),{amount0:1000n,amount1:500n});
  assert.throws(()=>previewRemove(101n,100n,4000n,2000n),/Cannot burn/);
  assert.deepEqual(position(0n,0n,0n,0n),{amount0:0n,amount1:0n,shareBps:0n});
});
test("slippage, dust and withdrawal percentage restrictions",()=>{
  assert.equal(applySlippage(10000n,50),9950n);
  assert.throws(()=>applySlippage(1n,500),/zero/);
  assert.equal(percentageOfBalance(100n,25),25n);
  assert.equal(percentageOfBalance(13n,100),13n);
  assert.throws(()=>percentageOfBalance(1n,1),/zero/);
  assert.throws(()=>percentageOfBalance(1n,0));
});
