// Pure integer arithmetic for V2-style constant-product swaps.
// The fee is configured in basis points by a VERIFIED deployment (10_000 = 100%).
export const BPS = 10_000n;

export function validateFee(feeBps) {
  if (!Number.isInteger(feeBps) || feeBps < 0 || feeBps >= Number(BPS)) {
    throw new Error("Invalid AMM fee. Supply an audited pool fee in basis points.");
  }
  return BigInt(feeBps);
}

export function parseAmount(value, decimals) {
  if (typeof value !== "string" || !/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(value) ||
      !Number.isInteger(decimals) || decimals < 0 || decimals > 36)
    throw new Error("Enter a valid positive token amount.");
  const [whole, fraction = ""] = value.split(".");
  if (fraction.length > decimals) throw new Error("Too many decimal places for this token.");
  const amount = BigInt(whole) * 10n ** BigInt(decimals) +
    BigInt((fraction.padEnd(decimals, "0") || "0"));
  if (amount <= 0n) throw new Error("Enter an amount greater than zero.");
  return amount;
}

export function amountOut(amountIn, reserveIn, reserveOut, feeBps) {
  const fee = validateFee(feeBps);
  if (typeof amountIn !== "bigint" || typeof reserveIn !== "bigint" ||
      typeof reserveOut !== "bigint" || amountIn <= 0n || reserveIn <= 0n || reserveOut <= 0n) {
    throw new Error("Missing input or liquidity reserves.");
  }
  const withFee = amountIn * (BPS - fee);
  const out = withFee * reserveOut / (reserveIn * BPS + withFee);
  if (out <= 0n || out >= reserveOut) throw new Error("Insufficient output liquidity.");
  return out;
}

export function quoteRoute(input, hops, feeBps) {
  if (typeof input !== "bigint" || input <= 0n || !Array.isArray(hops) || hops.length < 1 || hops.length > 2) {
    throw new Error("Unsupported swap route.");
  }
  let output = input;
  let noImpact = input;
  for (const hop of hops) {
    if (typeof hop.reserveIn !== "bigint" || typeof hop.reserveOut !== "bigint" ||
        hop.reserveIn <= 0n || hop.reserveOut <= 0n) throw new Error("Invalid pool reserves.");
    // For analytics only; execution always uses the actual amountOut from each pool.
    noImpact = noImpact * hop.reserveOut / hop.reserveIn;
    output = amountOut(output, hop.reserveIn, hop.reserveOut, feeBps);
  }
  const impact = noImpact > output && noImpact > 0n
    ? Number((noImpact - output) * BPS / noImpact)
    : 0;
  return { amountOut: output, priceImpactBps: Math.min(10_000, impact) };
}

export function minimumReceived(output, slippageBps) {
  if (typeof output !== "bigint" || output <= 0n ||
      !Number.isInteger(slippageBps) || slippageBps < 1 || slippageBps > 500) {
    throw new Error("Invalid quote or slippage (supported 0.01%–5%).");
  }
  const minimum = output * (BPS - BigInt(slippageBps)) / BPS;
  if (minimum <= 0n) throw new Error("Minimum output rounds to zero.");
  return minimum;
}

export function parseSlippage(value) {
  if (typeof value !== "string" || !/^(0|[1-9][0-9]?)(\.[0-9]{1,2})?$/.test(value))
    throw new Error("Slippage must be between 0.01% and 5%.");
  const [whole, decimals = ""] = value.split(".");
  const bps = Number(BigInt(whole) * 100n + BigInt(decimals.padEnd(2, "0") || "0"));
  if (bps < 1 || bps > 500) throw new Error("Slippage must be between 0.01% and 5%.");
  return bps;
}

export function transactionDeadline(nowSeconds, minutes) {
  if (!Number.isSafeInteger(nowSeconds) || nowSeconds <= 0 ||
      !Number.isInteger(minutes) || minutes < 1 || minutes > 60) {
    throw new Error("Transaction deadline must be 1–60 minutes.");
  }
  return BigInt(nowSeconds + minutes * 60);
}
