import {getAddress,isAddress,zeroAddress} from "viem";
import {factoryAbi,pairAbi} from "../swap/abi.mjs";
import {quoteRoute} from "../swap/math.mjs";
const same=(a,b)=>a.toLowerCase()===b.toLowerCase();
const valid=x=>isAddress(x??"")&&!same(x,zeroAddress);
export function demoPaths(a,b) {
 if(!valid(a)||!valid(b)||same(a,b))throw new Error("Invalid testnet tokens.");
 return [[getAddress(a),getAddress(b)]];
}
export async function getDemoQuote(client,{chainId,factory,inputAddress,outputAddress,amountIn,feeBps=30}) {
 if(!Number.isSafeInteger(chainId)||[1,4613].includes(chainId)||chainId<=1000)throw new Error("Testnet chain ID required.");
 if(await client.getChainId()!==chainId)throw new Error("RPC chain mismatch: abort test swap.");
 if(!valid(factory)||typeof amountIn!=="bigint"||amountIn<=0n||feeBps!==30)
  throw new Error("Invalid testnet quote configuration.");
 const code=await client.getBytecode({address:getAddress(factory)});
 if(!code||code==="0x")throw new Error("Missing deployed test Factory.");
 const pair=await client.readContract({address:getAddress(factory),abi:factoryAbi,
  functionName:"getPair",args:[getAddress(inputAddress),getAddress(outputAddress)]});
 if(!valid(pair))return null;
 const pairCode=await client.getBytecode({address:getAddress(pair)});
 if(!pairCode||pairCode==="0x")throw new Error("Pool has no deployed bytecode.");
 const [a,b,reserves]=await Promise.all([
  client.readContract({address:pair,abi:pairAbi,functionName:"token0"}),
  client.readContract({address:pair,abi:pairAbi,functionName:"token1"}),
  client.readContract({address:pair,abi:pairAbi,functionName:"getReserves"})
 ]);
 if(!Array.isArray(reserves)||reserves.length<2||!((same(a,inputAddress)&&same(b,outputAddress))||(same(a,outputAddress)&&same(b,inputAddress))))
  throw new Error("Testnet pool contract does not match selected tokens.");
 const inIs0=same(a,inputAddress);
 const rIn=BigInt(reserves[inIs0?0:1]),rOut=BigInt(reserves[inIs0?1:0]);
 if(rIn===0n||rOut===0n)return null;
 const q=quoteRoute(amountIn,[{pair,reserveIn:rIn,reserveOut:rOut}],30);
 return {amountIn,amountOut:q.amountOut,priceImpactBps:q.priceImpactBps,
  path:[getAddress(inputAddress),getAddress(outputAddress)],pair:getAddress(pair)};
}
