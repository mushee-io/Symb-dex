"use client";
import {useCallback,useEffect,useState} from "react";
import Link from "next/link";
import {formatUnits} from "viem";
import {demoNetwork,demoDeployment} from "@/lib/testnet/network";
type PoolRow={pair_address:string;token0:string;token1:string;created_block:string;swap_count:number;reserve0:string|null;reserve1:string|null};
type TradeRow={transaction_hash:string;block_number:string;log_index:number;token0:string;token1:string;amount0_in:string;amount1_in:string;amount0_out:string;amount1_out:string};
type Data={status:string;chainId?:number;canonicalBlock?:string;indexedAt?:string;
 includesTestBots?:boolean;usdVolume?:null;usdTvl?:null;
 counters?:{pools:number;swap_events:number;deposits:number;withdrawals:number};
 markets?:PoolRow[];recentSwaps?:TradeRow[]};
const short=(x:string)=>x.slice(0,6)+"…"+x.slice(-4);
export function DemoMarkets(){
 const [data,setData]=useState<Data|null>(null),[working,setWorking]=useState(false);
 const read=useCallback(async()=>{
  setWorking(true);
  try{const response=await fetch("/api/testnet/markets",{cache:"no-store"});
   const result=await response.json() as Data;setData(result);
  }catch{setData({status:"network-error"});}finally{setWorking(false);}
 },[]);
 useEffect(()=>{void read();},[read]);
 const asset=(addr:string)=>{
  const d=demoDeployment;
  if(d?.wrappedTestNative?.toLowerCase()===addr.toLowerCase())return {symbol:"tVERY",decimals:18};
  const t=d?.tokens.find(x=>x.address.toLowerCase()===addr.toLowerCase());
  return t?{symbol:t.symbol,decimals:t.decimals}:{symbol:short(addr),decimals:null};
 };
 const quantity=(v:string|null,a:{decimals:number|null})=>{
  if(v===null)return "—";
  try{return a.decimals===null? v+" raw":formatUnits(BigInt(v),a.decimals);}
  catch{return "—";}
 };
 return <div className="testnet-board">
  <div className="testnet-banner"><strong>VERIFIED DEMO-CHAIN ACTIVITY</strong>
   <span>{demoNetwork?demoNetwork.name:"No public network configured"}</span></div>
  <section className="testnet-panel">
   <div className="testnet-row"><div><h2>Testnet markets</h2>
    <p>Derived from canonical recorded on-chain events only. No real USD prices or value.</p></div>
    <button type="button" disabled={working} onClick={()=>void read()}>{working?"Loading…":"↻ Refresh chain data"}</button></div>
   {data?.status!=="indexed"?<p role="status">Markets unavailable: {data?.status??"Waiting for network"}. No transactions or trading volume are being invented.</p>:
    <>
     <div className="testnet-balance-grid">
      {([["Pools",data.counters?.pools],["Swap events",data.counters?.swap_events],
       ["LP deposits",data.counters?.deposits],["LP withdrawals",data.counters?.withdrawals]] as const).map(([label,value])=><div key={label}>
       <small>{label}</small><strong>{value??"—"}</strong></div>)}
     </div>
     <p className="muted-small">Confirmed indexed block: {data.canonicalBlock??"—"} · Last data update: {data.indexedAt??"—"}.
      Swap event counts may include automated bots and multihop transaction legs. USD volume and TVL are not available.</p>
     <h2>Indexed liquidity pools</h2>
     {data.markets?.length===0&&<p>There are no recorded pools yet.</p>}
     {data.markets?.map(p=><div className="testnet-order" key={p.pair_address}>
      <div className="testnet-quote"><span>Pair</span><strong>{asset(p.token0).symbol} / {asset(p.token1).symbol}</strong></div>
      <div className="testnet-quote"><span>Swap events</span><strong>{p.swap_count}</strong></div>
      <div className="testnet-quote"><span>Indexed reserve 0</span><strong>{quantity(p.reserve0,asset(p.token0))}</strong></div>
      <div className="testnet-quote"><span>Indexed reserve 1</span><strong>{quantity(p.reserve1,asset(p.token1))}</strong></div>
      <div className="testnet-quote"><span>Contract</span><strong>{short(p.pair_address)}</strong></div>
     </div>)}
     <h2>Recent confirmed swap events</h2>
     {data.recentSwaps?.length===0&&<p>No swaps have been indexed yet.</p>}
     {data.recentSwaps?.map(t=><div className="testnet-order" key={t.transaction_hash+":"+t.log_index}>
      <div className="testnet-quote"><span>Block</span><strong>{t.block_number}</strong></div>
      <div className="testnet-quote"><span>Pool</span><strong>{asset(t.token0).symbol} / {asset(t.token1).symbol}</strong></div>
      <div className="testnet-quote"><span>Token 0 in/out</span><strong>{quantity(t.amount0_in,asset(t.token0))} / {quantity(t.amount0_out,asset(t.token0))}</strong></div>
      <div className="testnet-quote"><span>Token 1 in/out</span><strong>{quantity(t.amount1_in,asset(t.token1))} / {quantity(t.amount1_out,asset(t.token1))}</strong></div>
      <Link href={"/testnet/explorer/tx/"+t.transaction_hash}>View actual receipt ↗</Link>
     </div>)}
    </>
   }
  </section>
 </div>;
}
