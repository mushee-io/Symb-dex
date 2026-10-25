"use client";
import {useState} from "react";
import Link from "next/link";
export default function Limit(){
 const [amount,setAmount]=useState("");
 const [price,setPrice]=useState("");
 const [days,setDays]=useState("7 days");
 const [reversed,setReversed]=useState(false);
 return <div className="dex-swap-page">
  <div className="dex-exchange-tabs"><Link href="/app/swap">Swap</Link><Link className="active" href="/app/limit">Limit</Link><span className="dex-tabs-spacer"/><Link className="dex-tabs-utility" href="/app/orders">◴</Link></div>
  <div className="dex-limit-terminal">
   <div className="dex-limit-card">
    <div className="dex-limit-row"><span>You Pay</span><span>Balance: —</span></div>
    <div className="dex-limit-amount"><input aria-label="Limit order pay amount" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"/><span className="dex-limit-token">◈ {reversed?"TOKEN":"VERY"} ▾</span></div>
    <div className="dex-limit-quarters">{["25%","50%","75%","100%"].map(x=><button disabled key={x} title="Requires a connected wallet balance">{x}</button>)}</div>
   </div>
   <button className="dex-limit-switch" type="button" aria-label="Reverse displayed order pair" onClick={()=>setReversed(v=>!v)}>↓</button>
   <div className="dex-limit-card">
    <div className="dex-limit-row"><span>You Receive</span><span>Balance: —</span></div>
    <div className="dex-limit-amount"><output aria-label="Limit order receive amount">—</output><span className="dex-limit-token">◈ {reversed?"VERY":"TOKEN"} ▾</span></div>
    <small>Market token selection and verified limit orders are not deployed.</small>
   </div>
   <div className="dex-limit-card dex-price-card">
    <div className="dex-limit-row"><span>Limit Price</span><span>Current market price: —</span></div>
    <label htmlFor="dex-target-price">Price per {reversed?"TOKEN":"VERY"}</label>
    <div className="dex-limit-amount"><input id="dex-target-price" aria-label="Limit price" inputMode="decimal" value={price} onChange={e=>setPrice(e.target.value)} placeholder="0.00"/><span>Quote token</span></div>
    <label htmlFor="dex-expiry">Expires in</label>
    <select id="dex-expiry" value={days} onChange={e=>setDays(e.target.value)}>{["1 hour","24 hours","7 days","30 days"].map(x=><option key={x}>{x}</option>)}</select>
   </div>
   <button disabled className="dex-primary-action" title="Verified mainnet limit-order contracts are not deployed">Limit orders not live</button>
   <p className="dex-form-disclosure">Order entry is an interface preview. No order is being signed, escrowed or submitted. Try locally-tested demo order logic on the separate testnet once deployed.</p>
   <Link className="dex-text-action" href="/testnet/orders">Explore isolated testnet orders ↗</Link>
  </div>
  <OrderHistory/>
 </div>;
}
