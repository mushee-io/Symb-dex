import {getAddress,isAddress,zeroAddress,type Address,type PublicClient} from "viem";
import {liquidityFactoryAbi,liquidityPairAbi} from "@/lib/liquidity/abi";
import {position} from "@/lib/liquidity/math.mjs";

const valid=(x:string):x is Address=>isAddress(x)&&x.toLowerCase()!==zeroAddress;
const eq=(a:string,b:string)=>a.toLowerCase()===b.toLowerCase();

export type DemoPool={
 address:Address;token0:Address;token1:Address;
 reserve0:bigint;reserve1:bigint;totalSupply:bigint;walletLp:bigint;
 walletShareBps:bigint;walletAmount0:bigint;walletAmount1:bigint;atBlock:bigint;
};
export async function demoPoolByTokens(client:PublicClient,chainId:number,factory:Address,
 a:Address,b:Address,wallet?:Address):Promise<DemoPool|null>{
 if(chainId===4613||chainId<=1000||await client.getChainId()!==chainId)throw new Error("Wrong testnet chain.");
 if(!valid(a)||!valid(b)||eq(a,b)||!valid(factory))throw new Error("Invalid pool configuration.");
 const atBlock=await client.getBlockNumber();
 const fc=await client.getBytecode({address:factory,blockNumber:atBlock});
 if(!fc||fc==="0x")throw new Error("Factory is not deployed at this test block.");
 const pair=await client.readContract({address:factory,abi:liquidityFactoryAbi,
  functionName:"getPair",args:[a,b],blockNumber:atBlock});
 if(!valid(pair))return null;
 return demoPoolAt(client,chainId,factory,pair,wallet,atBlock);
}
export async function demoPoolAt(client:PublicClient,chainId:number,factory:Address,
 pair:Address,wallet?:Address,atBlock?:bigint):Promise<DemoPool>{
 if(chainId===4613||chainId<=1000||await client.getChainId()!==chainId)
  throw new Error("Wrong testnet chain.");
 if(!valid(pair)||!valid(factory))throw new Error("Invalid pool address.");
 const blockNumber=atBlock??await client.getBlockNumber();
 const code=await client.getBytecode({address:pair,blockNumber});
 if(!code||code==="0x")throw new Error("Pool contract has no bytecode.");
 const [token0,token1,reserves,totalSupply,lp]=await Promise.all([
  client.readContract({address:pair,abi:liquidityPairAbi,functionName:"token0",blockNumber}),
  client.readContract({address:pair,abi:liquidityPairAbi,functionName:"token1",blockNumber}),
  client.readContract({address:pair,abi:liquidityPairAbi,functionName:"getReserves",blockNumber}),
  client.readContract({address:pair,abi:liquidityPairAbi,functionName:"totalSupply",blockNumber}),
  wallet?client.readContract({address:pair,abi:liquidityPairAbi,functionName:"balanceOf",args:[wallet],blockNumber})
    :Promise.resolve(0n)
 ]);
 if(!valid(token0)||!valid(token1)||eq(token0,token1))throw new Error("Invalid pair tokens.");
 const official=await client.readContract({address:factory,abi:liquidityFactoryAbi,
  functionName:"getPair",args:[token0,token1],blockNumber});
 if(!eq(official,pair))throw new Error("Pair does not belong to test Factory.");
 const amounts=position(lp,totalSupply,reserves[0],reserves[1]);
 return {address:getAddress(pair),token0:getAddress(token0),token1:getAddress(token1),
  reserve0:reserves[0],reserve1:reserves[1],totalSupply,walletLp:lp,
  walletShareBps:amounts.shareBps,walletAmount0:amounts.amount0,
  walletAmount1:amounts.amount1,atBlock:blockNumber};
}
export async function demoPoolList(client:PublicClient,chainId:number,factory:Address,page=0,pageSize=10){
 if(chainId===4613||chainId<=1000||await client.getChainId()!==chainId)
  throw new Error("Wrong testnet chain.");
 if(!Number.isInteger(page)||page<0||!Number.isInteger(pageSize)||pageSize<1||pageSize>25)
  throw new Error("Invalid page.");
 const atBlock=await client.getBlockNumber();
 const count=await client.readContract({address:factory,abi:liquidityFactoryAbi,
  functionName:"allPairsLength",blockNumber:atBlock});
 const offset=BigInt(page)*BigInt(pageSize);
 const pools:DemoPool[]=[];
 for(let i=offset;i<count && i<offset+BigInt(pageSize);i++){
  const pair=await client.readContract({address:factory,abi:liquidityFactoryAbi,
   functionName:"allPairs",args:[count-1n-i],blockNumber:atBlock});
  pools.push(await demoPoolAt(client,chainId,factory,pair,undefined,atBlock));
 }
 return {pools,count,atBlock};
}
