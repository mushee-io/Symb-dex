export const BPS: bigint;
export const MINIMUM_LIQUIDITY: bigint;
export function sqrt(value: bigint): bigint;
export function initialLiquidity(a: bigint,b: bigint,minimumLocked?:bigint): {minted:bigint;locked:bigint};
export function proportionalAmount(a:bigint,reserveA:bigint,reserveB:bigint):bigint;
export function previewAdd(a:bigint,b:bigint,reserveA:bigint,reserveB:bigint,totalSupply:bigint):
{minted:bigint;usedA:bigint;usedB:bigint;locked:bigint;initial:boolean};
export function previewRemove(lp:bigint,supply:bigint,reserve0:bigint,reserve1:bigint): {amount0:bigint;amount1:bigint};
export function position(bal:bigint,supply:bigint,r0:bigint,r1:bigint):{amount0:bigint;amount1:bigint;shareBps:bigint};
export function applySlippage(amount:bigint, slippageBps:number):bigint;
export function percentageOfBalance(balance:bigint,percent:number):bigint;
