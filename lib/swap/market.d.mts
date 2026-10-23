import type { Address } from "viem";
export interface MarketClient {
  getChainId(): Promise<number>;
  getBytecode(args: {address: Address}): Promise<string | undefined>;
  readContract(args: {address: Address; abi: readonly unknown[]; functionName: string; args?: readonly Address[]}): Promise<unknown>;
}
export interface MarketQuote { path: Address[]; pairs: Address[]; amountOut: bigint; priceImpactBps: number; }
export function candidatePaths(tokenIn: string, tokenOut: string, wrappedVery: string): Address[][];
export function fetchPool(client: MarketClient, factory: string, tokenIn: string, tokenOut: string): Promise<{pair: Address; reserveIn: bigint; reserveOut: bigint} | null>;
export function findBestQuote(client: MarketClient, opts: {
  chainId: number; factory: string; wrappedVery: string; tokenIn: string; tokenOut: string; input: bigint; feeBps: number;
}): Promise<MarketQuote | null>;
