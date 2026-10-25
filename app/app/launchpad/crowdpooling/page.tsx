"use client";
import {useState} from "react";
import Link from "next/link";
export default function Crowdpooling(){
 const [query,setQuery]=useState("");
 const [tab,setTab]=useState<"favorites"|"participating"|"history">("favorites");
 return <div className="dex-content-page">
  <div className="dex-crowd-hero"><span className="dex-eyebrow">CROWDPOOLING · CONCEPT PREVIEW</span><h1>New ideas deserve<br/>an open market.</h1><p>Discover launches and transparent fundraising on VERY, when reviewed crowdfunding contracts become available.</p><div className="dex-crowd-illustration" aria-hidden="true"><span>✦</span><span>◈</span><span>✦</span></div></div>
  <form className="dex-crowd-search" onSubmit={e=>e.preventDefault()}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by token or crowdpooling contract address" aria-label="Search verified crowdpooling contracts"/><button type="submit" aria-label="Search crowdpooling" disabled>⌕</button></form>
  <p className="dex-warning">Always verify contract addresses and understand the risks before participating in token launches. Crowdpooling contracts are not deployed.</p>
  <div className="dex-crowd-tabs">{(["favorites","participating","history"] as const).map(x=><button className={tab===x?"active":""} type="button" onClick={()=>setTab(x)} key={x}>{x[0].toUpperCase()+x.slice(1)}</button>)}<Link href="/app/launchpad/create" className="dex-outline-yellow">＋ Create Crowdpooling</Link></div>
  <div className="dex-empty"><span className="dex-empty-mark">✳</span><h2>No verified crowdpooling campaigns</h2><p>{query?"Search results are unavailable until real campaign indexing is configured.":"No fabricated fundraising figures, projects or participant counts are displayed."}</p></div>
 </div>;
}
