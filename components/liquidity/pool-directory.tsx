"use client";

import { useState } from "react";
import Link from "next/link";
import { formatUnits } from "viem";
import { useLiquidityPools } from "@/hooks/use-liquidity-pools";
import { useTokenRegistry } from "@/hooks/use-token-registry";
import deployments from "@/config/deployments.json";
import { isPoolReadConfigured } from "@/lib/liquidity/policy.mjs";

const short=(value:string)=>value.slice(0,7)+"…"+value.slice(-5);
export function PoolDirectory({portfolio=false}:{portfolio?:boolean}) {
  const [page,setPage]=useState(0);
  const [filter,setFilter]=useState("");
  const {data,isPending,error,isFetching,configured}=useLiquidityPools(page);
  const {trusted}=useTokenRegistry();
  const known=[...trusted];
  if (isPoolReadConfigured(deployments) && deployments.wrappedVery) {
    known.push({address:deployments.wrappedVery as `0x${string}`,symbol:"WVERY",name:"Wrapped VERY",decimals:18,verified:true});
  }
  const find=(address:string)=>known.find(t=>t.address.toLowerCase()===address.toLowerCase());
  const reviewed=(data?.pools??[]).filter(p=>find(p.token0) && find(p.token1));
  const shown=reviewed.filter(p=>{
    if (portfolio && p.walletLpBalance===0n) return false;
    const a=find(p.token0)!,b=find(p.token1)!;
    return (a.symbol+" "+b.symbol+" "+p.address).toLowerCase().includes(filter.toLowerCase());
  });
  const more=Boolean(data && (BigInt(page+1)*12n)<data.count);
  return <section className="lp-explorer">
    <div className="lp-row-between">
      <div>
        <span className="eyebrow">{portfolio?"MY LP POSITIONS":"ON-CHAIN POOLS"}</span>
        <h2>{portfolio?"Liquidity holdings":"Explore liquidity"}</h2>
      </div>
      {!portfolio && <Link className="primary-link" href="/pools/create">Create a pool ↗</Link>}
    </div>
    {!configured && <div className="inline-notice">
      No verified Lidde factory address is configured. Pool discovery remains unavailable until Milestone 2 deployment.
    </div>}
    {configured && <div className="lp-filter-row">
      <input type="search" aria-label="Filter listed pools" placeholder="Filter displayed pools or pair address"
        value={filter} onChange={e=>setFilter(e.target.value)}/>
      <button type="button" onClick={()=>setPage(0)} disabled={page===0}>First page</button>
    </div>}
    {configured && isPending && <p className="muted-small">Reading pool snapshots from VERY Mainnet…</p>}
    {configured && error && <p className="form-error" role="alert">Pool read failed: {error instanceof Error?error.message:"Check RPC"}</p>}
    <div className="lp-list">
      {shown.map(p=>{
        const a=find(p.token0)!,b=find(p.token1)!;
        return <Link className="lp-pool-card" key={p.address} href={`/pools/${p.address}`}>
          <div><strong>{a.symbol} / {b.symbol}</strong><small>Pool {short(p.address)} · VERY block {p.atBlock.toString()}</small></div>
          <div className="lp-card-right">
            <strong>{portfolio?formatUnits(p.walletLpBalance,18)+" LP":formatUnits(p.reserve0,a.decimals)+" "+a.symbol}</strong>
            <small>{portfolio?`Share ${(Number(p.walletShareBps)/100).toFixed(2)}%`:formatUnits(p.reserve1,b.decimals)+" "+b.symbol}</small>
          </div>
          <span className="lp-chevron">↗</span>
        </Link>;
      })}
      {configured && !isPending && shown.length===0 && <div className="no-assets">
        {portfolio?"No LP positions found among the indexed page of reviewed pools. Use the pagination to inspect more pools.":
          "No reviewed token pools on this page. Unreviewed token pools are deliberately hidden."}
      </div>}
    </div>
    {configured && <div className="lp-pagination">
      <button type="button" disabled={page===0 || isFetching} onClick={()=>setPage(v=>Math.max(0,v-1))}>← Previous</button>
      <span>Page {page+1} · {data?.count.toString()??"—"} total factory pairs</span>
      <button type="button" disabled={!more || isFetching} onClick={()=>setPage(v=>v+1)}>Next →</button>
    </div>}
    <p className="muted-small">Pools are discovered from the configured factory, not fabricated. Only reviewed token pairs are shown; this explorer scans 12 factory pairs per page. Balances and positions are read from the blockchain, not from a database.</p>
  </section>;
}
