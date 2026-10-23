export const BPS: bigint;
export function validateFee(feeBps: number): bigint;
export function parseAmount(value: string, decimals: number): bigint;
export function amountOut(amountIn: bigint, reserveIn: bigint, reserveOut: bigint, feeBps: number): bigint;
export interface Hop { reserveIn: bigint; reserveOut: bigint; }
export function quoteRoute(input: bigint, hops: Hop[], feeBps: number): {amountOut: bigint; priceImpactBps: number};
export function minimumReceived(output: bigint, slippageBps: number): bigint;
export function parseSlippage(value: string): number;
export function transactionDeadline(nowSeconds: number, minutes: number): bigint;
