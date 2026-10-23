// Pure bigint liquidity calculations for an independently reviewed V2-style AMM.
// Never use Number to calculate settlement amounts.
export const BPS = 10_000n;
export const MINIMUM_LIQUIDITY = 1_000n;

export function sqrt(value) {
  if (typeof value !== "bigint" || value < 0n) throw new Error("Invalid sqrt input.");
  if (value < 2n) return value;
  let x = value, y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + value / x) / 2n; }
  return x;
}
function positive(...values) {
  if (values.some(v => typeof v !== "bigint" || v <= 0n))
    throw new Error("Liquidity values must be positive integers.");
}
export function initialLiquidity(amount0, amount1, minimumLocked = MINIMUM_LIQUIDITY) {
  positive(amount0, amount1);
  if (typeof minimumLocked !== "bigint" || minimumLocked < 0n)
    throw new Error("Invalid locked liquidity.");
  const minted = sqrt(amount0 * amount1) - minimumLocked;
  if (minted <= 0n) throw new Error("Initial liquidity is too small for minimum locked LP supply.");
  return { minted, locked: minimumLocked };
}
export function proportionalAmount(amountA, reserveA, reserveB) {
  positive(amountA, reserveA, reserveB);
  const amountB = amountA * reserveB / reserveA;
  if (amountB <= 0n) throw new Error("Counterpart amount rounds to zero.");
  return amountB;
}
export function previewAdd(amountA, amountB, reserveA, reserveB, totalSupply) {
  positive(amountA, amountB);
  if (typeof reserveA !== "bigint" || typeof reserveB !== "bigint" ||
      typeof totalSupply !== "bigint" || reserveA < 0n || reserveB < 0n || totalSupply < 0n)
    throw new Error("Invalid pool state.");
  if (totalSupply === 0n && reserveA === 0n && reserveB === 0n)
    return { ...initialLiquidity(amountA, amountB), usedA: amountA, usedB: amountB, initial: true };
  if (totalSupply === 0n || reserveA === 0n || reserveB === 0n)
    throw new Error("Inconsistent liquidity pool state.");
  const counterpartB = proportionalAmount(amountA, reserveA, reserveB);
  const counterpartA = proportionalAmount(amountB, reserveB, reserveA);
  // Match the ratio while never exceeding specified maximum inputs.
  const usedA = counterpartB <= amountB ? amountA : counterpartA;
  const usedB = counterpartB <= amountB ? counterpartB : amountB;
  positive(usedA, usedB);
  const mintedA = usedA * totalSupply / reserveA;
  const mintedB = usedB * totalSupply / reserveB;
  const minted = mintedA < mintedB ? mintedA : mintedB;
  if (minted <= 0n) throw new Error("Liquidity mint rounds to zero.");
  return { minted, usedA, usedB, locked: 0n, initial: false };
}
export function previewRemove(liquidity, totalSupply, reserve0, reserve1) {
  positive(liquidity, totalSupply);
  if (typeof reserve0 !== "bigint" || typeof reserve1 !== "bigint" || reserve0 < 0n || reserve1 < 0n)
    throw new Error("Invalid reserves.");
  if (liquidity > totalSupply) throw new Error("Cannot burn more LP than total supply.");
  const amount0 = liquidity * reserve0 / totalSupply;
  const amount1 = liquidity * reserve1 / totalSupply;
  if (amount0 <= 0n || amount1 <= 0n) throw new Error("Withdrawal would return dust.");
  return { amount0, amount1 };
}
export function position(bal, supply, reserve0, reserve1) {
  if (typeof bal !== "bigint" || bal < 0n || typeof supply !== "bigint" || supply < 0n)
    throw new Error("Invalid LP balance or supply.");
  if (supply === 0n) return { amount0: 0n, amount1: 0n, shareBps: 0n };
  if (bal > supply) throw new Error("LP balance exceeds supply.");
  if (typeof reserve0 !== "bigint" || typeof reserve1 !== "bigint" || reserve0 < 0n || reserve1 < 0n)
    throw new Error("Invalid reserve amounts.");
  return { amount0: bal * reserve0 / supply, amount1: bal * reserve1 / supply, shareBps: bal * BPS / supply };
}
export function applySlippage(amount, slippageBps) {
  positive(amount);
  if (!Number.isInteger(slippageBps) || slippageBps < 1 || slippageBps > 500)
    throw new Error("Slippage tolerance must be between 0.01% and 5%.");
  const min = amount * (BPS - BigInt(slippageBps)) / BPS;
  if (min <= 0n) throw new Error("Minimum amount rounds to zero.");
  return min;
}
export function percentageOfBalance(balance, percent) {
  if (typeof balance !== "bigint" || balance < 0n ||
      !Number.isInteger(percent) || percent < 1 || percent > 100)
    throw new Error("Choose a withdrawal percentage from 1 to 100.");
  const amount = balance * BigInt(percent) / 100n;
  if (amount <= 0n) throw new Error("Withdrawal LP amount rounds to zero.");
  return amount;
}
