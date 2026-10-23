import test from "node:test";
import assert from "node:assert/strict";
import { amountOut, parseAmount, quoteRoute, minimumReceived, parseSlippage, transactionDeadline } from "../lib/swap/math.mjs";

test("constant product quote matches integer V2 math", () => {
  assert.equal(amountOut(100n, 1_000n, 1_000n, 30), 90n);
  assert.ok(amountOut(100n, 1_000n, 1_000n, 0) > 90n);
});
test("rejects empty pools, zero input, invalid fee and dust", () => {
  assert.throws(()=>amountOut(0n,100n,100n,30));
  assert.throws(()=>amountOut(1n,0n,100n,30));
  assert.throws(()=>amountOut(1n,100n,100n,10000));
  assert.throws(()=>amountOut(1n,1000000000n,1n,30));
});
test("parseAmount retains precision for ERC-20 units and refuses bad input", () => {
  assert.equal(parseAmount("1.25",6),1_250_000n);
  assert.equal(parseAmount("0.000001",6),1n);
  assert.equal(parseAmount("123",0),123n);
  assert.throws(()=>parseAmount("1.0000001",6));
  assert.throws(()=>parseAmount("-1",18));
  assert.throws(()=>parseAmount("1e6",18));
  assert.throws(()=>parseAmount("0",18));
});
test("slippage is rounded down on output and bounded", () => {
  assert.equal(parseSlippage("0.5"),50);
  assert.equal(parseSlippage("0.01"),1);
  assert.equal(parseSlippage("5"),500);
  assert.throws(()=>parseSlippage("0"));
  assert.throws(()=>parseSlippage("5.01"));
  assert.equal(minimumReceived(10000n,50),9950n);
  assert.throws(()=>minimumReceived(1n,50));
});
test("two hop route produces finite price impact", () => {
  const result=quoteRoute(1000n,[{reserveIn:10000n,reserveOut:20000n},{reserveIn:10000n,reserveOut:5000n}],30);
  assert.ok(result.amountOut>0n);
  assert.ok(result.priceImpactBps>=0 && result.priceImpactBps<=10000);
  assert.throws(()=>quoteRoute(1n,[],30));
});
test("deadline has strict bounds",()=>{
  assert.equal(transactionDeadline(100000,20),101200n);
  assert.throws(()=>transactionDeadline(100000,0));
  assert.throws(()=>transactionDeadline(100000,61));
});
