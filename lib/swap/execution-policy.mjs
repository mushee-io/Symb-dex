import { isAddress, getAddress } from "viem";
import { isTradingEnabled } from "../release-gate.mjs";
import { minimumReceived, transactionDeadline } from "./math.mjs";

const match = (a, b) => a.toLowerCase() === b.toLowerCase();

export function executionGate({deployment, chainId, wallet, token, quote, direction, slippageBps}) {
  if (!isTradingEnabled(deployment))
    throw new Error("Trading is locked until contracts are deployed, reviewed and released.");
  if (chainId !== 4613 || !isAddress(wallet || ""))
    throw new Error("Connect a wallet to VERY Mainnet (4613).");
  if (!token || !token.verified || !isAddress(token.address))
    throw new Error("Only independently reviewed tokens are eligible for swaps.");
  if (!Number.isInteger(deployment.feeBps) || deployment.feeBps < 0 || deployment.feeBps >= 10000)
    throw new Error("Trading fee is not confirmed for the deployed AMM.");
  if (!quote || typeof quote.amountOut !== "bigint" || quote.amountOut <= 0n ||
      typeof quote.amountIn !== "bigint" || quote.amountIn <= 0n ||
      !Array.isArray(quote.path) || quote.path.length < 2 || quote.path.length > 3)
    throw new Error("No usable on-chain quotation exists.");
  const w = getAddress(deployment.wrappedVery), asset = getAddress(token.address);
  if (match(w, asset)) throw new Error("Select a non-native token.");
  if (!["very-to-token", "token-to-very"].includes(direction)) throw new Error("Unsupported direction.");
  const expectedStart = direction === "very-to-token" ? w : asset;
  const expectedEnd = direction === "very-to-token" ? asset : w;
  if (!quote.path.every((item) => isAddress(item)) || !match(quote.path[0], expectedStart) ||
      !match(quote.path[quote.path.length - 1], expectedEnd) ||
      new Set(quote.path.map(p=>p.toLowerCase())).size !== quote.path.length)
    throw new Error("Quoted route does not match the selected assets.");
  if (!Array.isArray(quote.pairs) || quote.pairs.length !== quote.path.length - 1)
    throw new Error("Quoted pairs are incomplete.");
  return minimumReceived(quote.amountOut, slippageBps);
}

export function buildSwapCall({direction, router, account, amountIn, minOut, path, nowSeconds, deadlineMinutes}) {
  if (!isAddress(router) || !isAddress(account) || !Array.isArray(path) ||
      path.length < 2 || path.length > 3 || !path.every(isAddress) ||
      amountIn <= 0n || minOut <= 0n) throw new Error("Invalid swap transaction.");
  const deadline = transactionDeadline(nowSeconds, deadlineMinutes);
  if (direction === "very-to-token") return {
    functionName: "swapExactETHForTokens",
    args: [minOut, path, account, deadline],
    value: amountIn,
  };
  if (direction === "token-to-very") return {
    functionName: "swapExactTokensForETH",
    args: [amountIn, minOut, path, account, deadline],
    value: 0n,
  };
  if (direction === "token-to-token") return {
    functionName: "swapExactTokensForTokens",
    args: [amountIn, minOut, path, account, deadline],
    value: 0n,
  };
  throw new Error("Unsupported swap direction.");
}
