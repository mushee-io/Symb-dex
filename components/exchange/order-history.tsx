"use client";
import {useState} from "react";
import Link from "next/link";
export function OrderHistory(){
 const [tab,setTab]=useState<"same"|"cross">("same");
 return <section className="dex-orders-panel" aria-label="Order history">
  <div className="dex-orders-tabs" role="tablist" aria-label="Order categories">
   <button type="button" role="tab" aria-selected={tab==="same"} className={tab==="same"?"active":""} onClick={()=>setTab("same")}>Same Chain Orders</button>
   <button type="button" role="tab" aria-selected={tab==="cross"} className={tab==="cross"?"active":""} onClick={()=>setTab("cross")}>Cross Chain Orders <span className="dex-soon">Not supported</span></button>
  </div>
  <div className="dex-orders-table"><div className="dex-orders-head"><span>Pay</span><span>Receive</span><span>Status</span><span>Rate</span><span>Transaction</span></div>
  <div className="dex-empty"><span className="dex-empty-mark">✳</span><h3>{tab==="same"?"No orders to display":"Cross-chain orders unavailable"}</h3><p>{tab==="same"?"Confirmed orders will appear when the corresponding contract/indexer infrastructure is operational.":"Cross-chain routing has not been implemented or verified on Symb Dex."}</p><Link href="/app/portfolio">View portfolio ↗</Link></div></div>
 </section>;
}
