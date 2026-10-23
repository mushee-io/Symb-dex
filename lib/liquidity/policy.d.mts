export interface LiquidityDeployment {chainId:number;status:string;releaseApproved:boolean;auditReviewed:boolean;factory:string|null;router:string|null;wrappedVery:string|null;}
export interface ReviewedAsset {address:string;verified:boolean;}
export function isPoolReadConfigured(deployment:LiquidityDeployment):boolean;
export function assertLiquidityWrite(args:{deployment:LiquidityDeployment;chainId:number;account?:string;tokens:ReviewedAsset[]}):true;
export type LiquidityCall = {functionName:"addLiquidityETH"|"addLiquidity"|"removeLiquidityETH"|"removeLiquidity";args:unknown[];value:bigint};
export function buildAddCall(args:{tokenA:string;tokenB:string;amountA:bigint;amountB:bigint;minA:bigint;minB:bigint;wrappedVery:string;account:string;deadline:bigint}):LiquidityCall;
export function buildRemoveCall(args:{token0:string;token1:string;liquidity:bigint;min0:bigint;min1:bigint;wrappedVery:string;account:string;deadline:bigint}):LiquidityCall;
export function quoteLimits(a:bigint,b:bigint,slippageBps:number):[bigint,bigint];
export function deadlineFrom(minutes:number):bigint;
