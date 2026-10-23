import type { Address } from "viem";
export interface SwapQuote {
  amountIn: bigint; amountOut: bigint; path: Address[]; pairs: Address[]; priceImpactBps: number;
}
export interface SwapDeployment {
  chainId: number;
  status: string; releaseApproved: boolean; auditReviewed: boolean;
  factory: string | null; router: string | null; wrappedVery: string | null;
  feeBps: number | null;
}
export type SwapDirection = "very-to-token" | "token-to-very";
export function executionGate(args: {
  deployment: SwapDeployment; chainId: number; wallet?: string; token?: {address: Address; verified: boolean};
  quote?: SwapQuote | null; direction: SwapDirection; slippageBps: number;
}): bigint;
export function buildSwapCall(args: {
  direction: SwapDirection | "token-to-token"; router: string; account: string;
  amountIn: bigint; minOut: bigint; path: Address[]; nowSeconds: number; deadlineMinutes: number;
}): {functionName: "swapExactETHForTokens" | "swapExactTokensForETH" | "swapExactTokensForTokens"; args: readonly unknown[]; value: bigint};
