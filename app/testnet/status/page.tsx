"use client";
import {useCallback,useEffect,useState} from "react";
import Link from "next/link";
type Check={status:string;detail:string};
type Status={status:string;chainId:number|null;block:string|null;checkedAt:string;rpc:Check;contracts:Check;indexer:Check;faucet:Check};
export default function StatusPage(){
 const [state,setState]=useState<Status|null>(null),[busy,setBusy]=useState(false);
 const read=useCallback(async()=>{
  setBusy(true);
  try{const r=await fetch("/api/testnet/health",{cache:"no-store"});setState(await r.json() as Status);}
  catch{setState(null);}finally{setBusy(false);}
 },[]);
 useEffect(()=>{void read();},[read]);
 const checks=[["Network RPC",state?.rpc],["Deployed contracts",state?.contracts],
  ["Canonical Neon indexer",state?.indexer],["Gasless test faucet",state?.faucet]] as const;
 return <main className="shell subpage"><div className="page-heading"><span className="eyebrow">VERIFIED TEST ENVIRONMENT · NO REAL FUNDS</span>
  <h1>Network & service health.</h1><p>Actual read-only checks against the isolated EVM chain and Neon. No green labels are shown merely because source code exists.</p>
  <Link href="/testnet" className="secondary-link">← Testnet</Link></div>
  <div className="testnet-board">
   <div className="testnet-banner"><strong>NETWORK STATE: {state?.status??"CHECKING"}</strong>
    <span>Chain: {state?.chainId??"Unavailable"} · Last observed block: {state?.block??"None"}</span></div>
   <section className="testnet-panel">
    <div className="testnet-row"><h2>Readiness checks</h2>
     <button type="button" disabled={busy} onClick={()=>void read()}>{busy?"Checking…":"↻ Recheck"}</button></div>
    {checks.map(([name,c])=><div className="testnet-quote" key={name}>
      <div><strong>{name}</strong><p className="muted-small">{c?.detail??"Awaiting check"}</p></div>
      <strong>{c?.status??"unknown"}</strong>
    </div>)}
    <p className="muted-small">Checked: {state?.checkedAt??"not checked"}. A responding RPC does not prove transactions are publicly accessible, and a configured faucet does not prove a first-claim operation. External-wallet acceptance is a separate gate.</p>
   </section>
  </div>
 </main>;
}
