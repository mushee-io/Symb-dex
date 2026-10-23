import { getAddress, isAddress, zeroAddress } from "viem";
import { isTradingEnabled } from "../release-gate.mjs";
import { applySlippage } from "./math.mjs";
import { transactionDeadline } from "../swap/math.mjs";

const valid = (x) => isAddress(x) && getAddress(x) !== zeroAddress;
const same = (a,b) => getAddress(a) === getAddress(b);

export function isPoolReadConfigured(deployment) {
  return Boolean(deployment && deployment.chainId === 4613 && valid(deployment.factory ?? ""));
}
export function assertLiquidityWrite({deployment, chainId, account, tokens}) {
  if (!isTradingEnabled(deployment)) throw new Error("Liquidity writes are locked until audited contracts are released.");
  if (chainId !== 4613 || !valid(account ?? "")) throw new Error("Connect a wallet to VERY Mainnet.");
  if (!Array.isArray(tokens) || tokens.length !== 2 || tokens.some(t=>!t || !valid(t.address) || !t.verified))
    throw new Error("Both liquidity assets must be independently reviewed.");
  if (same(tokens[0].address,tokens[1].address)) throw new Error("Liquidity pair tokens must be different.");
  return true;
}
export function buildAddCall({tokenA,tokenB,amountA,amountB,minA,minB,wrappedVery,account,deadline}) {
  if (![tokenA,tokenB,wrappedVery,account].every(valid) || same(tokenA,tokenB))
    throw new Error("Invalid liquidity tokens or recipient.");
  if ([amountA,amountB,minA,minB].some(v=>typeof v!=="bigint" || v<=0n) ||
      minA>amountA || minB>amountB || typeof deadline!=="bigint" || deadline<=0n)
    throw new Error("Invalid liquidity amounts or minimums.");
  if (same(tokenA,wrappedVery))
    return {functionName:"addLiquidityETH",args:[getAddress(tokenB),amountB,minB,minA,getAddress(account),deadline],value:amountA};
  if (same(tokenB,wrappedVery))
    return {functionName:"addLiquidityETH",args:[getAddress(tokenA),amountA,minA,minB,getAddress(account),deadline],value:amountB};
  return {functionName:"addLiquidity",args:[getAddress(tokenA),getAddress(tokenB),amountA,amountB,minA,minB,getAddress(account),deadline],value:0n};
}
export function buildRemoveCall({token0,token1,liquidity,min0,min1,wrappedVery,account,deadline}) {
  if (![token0,token1,wrappedVery,account].every(valid) || same(token0,token1) ||
      [liquidity,min0,min1].some(v=>typeof v!=="bigint" || v<=0n) ||
      typeof deadline!=="bigint" || deadline<=0n)
    throw new Error("Invalid LP withdrawal.");
  if (same(token0,wrappedVery))
    return {functionName:"removeLiquidityETH",args:[getAddress(token1),liquidity,min1,min0,getAddress(account),deadline],value:0n};
  if (same(token1,wrappedVery))
    return {functionName:"removeLiquidityETH",args:[getAddress(token0),liquidity,min0,min1,getAddress(account),deadline],value:0n};
  return {functionName:"removeLiquidity",args:[getAddress(token0),getAddress(token1),liquidity,min0,min1,getAddress(account),deadline],value:0n};
}
export function quoteLimits(a,b,slippageBps) {
  return [applySlippage(a,slippageBps),applySlippage(b,slippageBps)];
}
export function deadlineFrom(minutes) {
  return transactionDeadline(Math.floor(Date.now()/1000),minutes);
}
