"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import { getAddress, type Address } from "viem";
import deployments from "@/config/deployments.json";
import { very } from "@/lib/very";
import { getPoolPage, getPoolByTokens } from "@/lib/liquidity/discovery";
import { isPoolReadConfigured } from "@/lib/liquidity/policy.mjs";

const ready=isPoolReadConfigured(deployments);
const factory=ready && deployments.factory ? getAddress(deployments.factory) : null;

export function useLiquidityPools(page:number) {
  const client=usePublicClient({chainId:very.id});
  const {address}=useAccount();
  const query=useQuery({
    queryKey:["lidde","liquidity-pools",factory,page,address],
    enabled: Boolean(client && factory),
    queryFn: ()=>getPoolPage(client!,factory as Address,page,12,address),
    retry:1,staleTime:10_000,refetchInterval:30_000,
  });
  return {...query,configured:ready};
}
export function useLiquidityPair(tokenA:Address|undefined,tokenB:Address|undefined) {
  const client=usePublicClient({chainId:very.id});
  const {address}=useAccount();
  const query=useQuery({
    queryKey:["lidde","liquidity-pair",factory,tokenA,tokenB,address],
    enabled:Boolean(client && factory && tokenA && tokenB && tokenA!==tokenB),
    queryFn:()=>getPoolByTokens(client!,factory as Address,tokenA!,tokenB!,address),
    retry:1,staleTime:8_000,refetchInterval:20_000,
  });
  return {...query,configured:ready};
}
