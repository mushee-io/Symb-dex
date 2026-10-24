export function demoPaths(a:string,b:string):`0x${string}`[][];
export function getDemoQuote(client:unknown,options:{chainId:number;factory:string;inputAddress:string;outputAddress:string;amountIn:bigint;feeBps?:number}):Promise<null|{
 amountIn:bigint;amountOut:bigint;priceImpactBps:number;path:`0x${string}`[];pair:`0x${string}`;
}>;
