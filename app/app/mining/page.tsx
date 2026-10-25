"use client";
import {useState} from "react";
import Link from "next/link";
export default function Mining(){
 const [tab,setTab]=useState<"active"|"ended">("active");
 const [search,setSearch]=useState("");
 return <div className="dex-content-page">
  <div className="dex-split-page">
   <section className="dex-mining-primary">
    <div className="dex-mining-title"><h1>Mining</h1><Link href="/app/mining/create" className="dex-outline-yellow">＋ Create Liquidity Mining</Link></div>
    <div className="dex-filter-group"><span className="dex-network-chip">◈ VERY Mainnet</span><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by pool address" aria-label="Find mining programmes by address"/></div>
    <div className="dex-segment" role="tablist" aria-label="Mining programmes"><button role="tab" aria-selected={tab==="active"} className={tab==="active"?"active":""} onClick={()=>setTab("active")}>Active</button><button role="tab" aria-selected={tab==="ended"} className={tab==="ended"?"active":""} onClick={()=>setTab("ended")}>Ended</button></div>
    <div className="dex-empty dex-mining-empty"><span className="dex-empty-mark">◇</span><h2>No {tab} mining programmes yet.</h2><p>{search?"No verified mining programmes match this address.":"Mining will appear once a real rewards contract and indexer are configured. No APR figures are simulated."}</p></div>
   </section>
   <aside className="dex-panel dex-help-panel"><h2><span className="dex-help-icon">?</span> SEE HOW IT WORKS</h2><div className="dex-help-art">◇</div><h3>Mining</h3><p>Stake LP positions in an audited rewards contract, then track and claim real incentives. This service is not yet deployed.</p></aside>
  </div>
 </div>;
}
