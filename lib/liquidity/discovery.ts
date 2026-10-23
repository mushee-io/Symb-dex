import { getAddress, isAddress, zeroAddress, type Address, type PublicClient } from "viem";
import { liquidityFactoryAbi, liquidityPairAbi } from "@/lib/liquidity/abi";
import { position } from "@/lib/liquidity/math.mjs";

export interface PoolSnapshot {
  address: Address;
  token0: Address;
  token1: Address;
  reserve0: bigint;
  reserve1: bigint;
  totalSupply: bigint;
  walletLpBalance: bigint;
  walletAmount0: bigint;
  walletAmount1: bigint;
  walletShareBps: bigint;
  atBlock: bigint;
}
const eq = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const valid = (value: string): value is Address => isAddress(value) && !eq(value,zeroAddress);

// All core reads use the same block to avoid internally inconsistent LP snapshots.
export async function getPoolSnapshot(client: PublicClient, factory: Address, pair: Address,
  wallet?: Address, blockNumber?: bigint): Promise<PoolSnapshot> {
  if (await client.getChainId() !== 4613) throw new Error("VERY network mismatch.");
  if (!valid(factory) || !valid(pair)) throw new Error("Invalid factory or pool address.");
  const atBlock = blockNumber ?? await client.getBlockNumber();
  const code = await client.getBytecode({ address: pair, blockNumber: atBlock });
  if (!code || code === "0x") throw new Error("Pool contract bytecode not found.");
  const [token0, token1, reserves, totalSupply, lp] = await Promise.all([
    client.readContract({address:pair,abi:liquidityPairAbi,functionName:"token0",blockNumber:atBlock}),
    client.readContract({address:pair,abi:liquidityPairAbi,functionName:"token1",blockNumber:atBlock}),
    client.readContract({address:pair,abi:liquidityPairAbi,functionName:"getReserves",blockNumber:atBlock}),
    client.readContract({address:pair,abi:liquidityPairAbi,functionName:"totalSupply",blockNumber:atBlock}),
    wallet ? client.readContract({address:pair,abi:liquidityPairAbi,functionName:"balanceOf",args:[wallet],blockNumber:atBlock}) : Promise.resolve(0n),
  ]);
  if (!valid(token0) || !valid(token1) || eq(token0,token1)) throw new Error("Pair contains invalid token addresses.");
  const expected = await client.readContract({
    address:factory,abi:liquidityFactoryAbi,functionName:"getPair",
    args:[token0,token1],blockNumber:atBlock,
  });
  if (!eq(expected,pair)) throw new Error("Pair is not registered in the configured factory.");
  const amounts = position(lp,totalSupply,reserves[0],reserves[1]);
  return {
    address:getAddress(pair),token0:getAddress(token0),token1:getAddress(token1),
    reserve0:reserves[0],reserve1:reserves[1],totalSupply,
    walletLpBalance:lp,walletAmount0:amounts.amount0,walletAmount1:amounts.amount1,
    walletShareBps:amounts.shareBps,atBlock,
  };
}
export async function getPoolByTokens(client: PublicClient,factory: Address,
  tokenA:Address,tokenB:Address,wallet?:Address) {
  if (!valid(tokenA) || !valid(tokenB) || eq(tokenA,tokenB)) throw new Error("Select two distinct tokens.");
  if (await client.getChainId()!==4613) throw new Error("VERY network mismatch.");
  const blockNumber = await client.getBlockNumber();
  const pair = await client.readContract({address:factory,abi:liquidityFactoryAbi,
    functionName:"getPair",args:[tokenA,tokenB],blockNumber});
  if (!valid(pair)) return null;
  return getPoolSnapshot(client,factory,pair,wallet,blockNumber);
}

export async function getPoolPage(client: PublicClient,factory:Address,page:number,
  pageSize=12,wallet?:Address) {
  if (!valid(factory)) throw new Error("Factory address is not configured.");
  if (!Number.isInteger(page) || page<0 || !Number.isInteger(pageSize) || pageSize<1 || pageSize>25)
    throw new Error("Invalid liquidity page.");
  if (await client.getChainId()!==4613) throw new Error("VERY network mismatch.");
  const blockNumber=await client.getBlockNumber();
  const code=await client.getBytecode({address:factory,blockNumber});
  if (!code || code==="0x") throw new Error("Factory is not deployed.");
  const count=await client.readContract({address:factory,abi:liquidityFactoryAbi,functionName:"allPairsLength",blockNumber});
  // Newest-first, bounded page; no unbounded allPairs() loops or fake liquidity.
  const start=BigInt(page)*BigInt(pageSize);
  if (start>=count) return {count,pools:[] as PoolSnapshot[],blockNumber};
  const remaining=count-start;
  const size=Number(remaining<BigInt(pageSize)?remaining:BigInt(pageSize));
  const pools:PoolSnapshot[]=[];
  for (let i=0;i<size;i++) {
    const index=count-1n-start-BigInt(i);
    const pair=await client.readContract({address:factory,abi:liquidityFactoryAbi,functionName:"allPairs",args:[index],blockNumber});
    const snapshot=await getPoolSnapshot(client,factory,pair,wallet,blockNumber);
    pools.push(snapshot);
  }
  return {count,pools,blockNumber};
}
