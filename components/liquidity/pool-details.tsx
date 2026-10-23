"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAccount,usePublicClient } from "wagmi";
import { getAddress,isAddress,type Address } from "viem";
import { useTokenRegistry } from "@/hooks/use-token-registry";
import { getPoolSnapshot } from "@/lib/liquidity/discovery";
import { LiquidityForm } from "@/components/liquidity/liquidity-form";
import deployments from "@/config/deployments.json";
import { isPoolReadConfigured } from "@/lib/liquidity/policy.mjs";
import { very } from "@/lib/very";

export function PoolDetails({pair}:{pair:string}){
  const client=usePublicClient({chainId:very.id});
  const {address}=useAccount();
  const factory=deployments.factory;
  const configured=isPoolReadConfigured(deployments);
  const valid=isAddress(pair);
  const query=useQuery({
    queryKey:["lidde","lp-detail",pair,address,factory],
    enabled:Boolean(client && configured && factory && valid),
    queryFn:()=>getPoolSnapshot(client!,getAddress(factory!),getAddress(pair),address),
    staleTime:10_000,refetchInterval:25_000,retry:1,
  });
  const {trusted}=useTokenRegistry();
  const native=deployments.wrappedVery ? {address:deployments.wrappedVery as Address,name:"Wrapped VERY",symbol:"VERY",decimals:18,verified:true} : null;
  const assets=[...trusted,...(native?[native]:[])];
  const token0=query.data && assets.find(t=>t.address.toLowerCase()===query.data!.token0.toLowerCase());
  const token1=query.data && assets.find(t=>t.address.toLowerCase()===query.data!.token1.toLowerCase());
  return <section className="lp-details">
    {!valid && <p className="form-error">Invalid pair address.</p>}
    {!configured && <p className="inline-notice">Lidde factory is not configured; no pair details or liquidity writes are available.</p>}
    {configured && query.isPending && <p>Reading pool from VERY Mainnet…</p>}
    {query.error && <p className="form-error" role="alert">{query.error instanceof Error?query.error.message:"Unable to validate pair."}</p>}
    {query.data && <div className="lp-preview">
      <div><span>Factory registered pool</span><strong>{query.data.address}</strong></div>
      <div><span>Token 0 reserves</span><strong>{query.data.reserve0.toString()} base units</strong></div>
      <div><span>Token 1 reserves</span><strong>{query.data.reserve1.toString()} base units</strong></div>
      <div><span>LP supply</span><strong>{query.data.totalSupply.toString()}</strong></div>
      <div><span>Your LP balance</span><strong>{query.data.walletLpBalance.toString()}</strong></div>
      <div><span>Snapshot block</span><strong>{query.data.atBlock.toString()}</strong></div>
    </div>}
    {query.data && (!token0 || !token1) && <div className="inline-notice">
      This pool includes an asset that is not on Lidde's independently reviewed token list. Deposits and withdrawals via this interface are disabled. <a href={`https://veryscan.io/address/${pair}`} target="_blank" rel="noreferrer">Inspect the pair on VeryScan ↗</a>
    </div>}
    {query.data && token0 && token1 && <LiquidityForm fixedPair={{token0:query.data.token0,token1:query.data.token1}}/>}
    <p><Link href="/pools" className="secondary-link">← Browse pools</Link></p>
  </section>;
}
