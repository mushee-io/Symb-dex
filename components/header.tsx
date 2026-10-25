"use client";
import {useState} from "react";
import Link from "next/link";
import {WalletConnect} from "@/components/wallet-connect";
export function Header(){
 const [open,setOpen]=useState(false);
 return <header className="marketing-header">
  <div className="marketing-header-inner">
   <Link href="/" className="marketing-wordmark" aria-label="Symb Dex homepage"><span className="marketing-glyph"><img src="/brand/symb-fish.svg" width="44" height="29" alt="" /></span> SYMB <b>DEX</b></Link>
   <button className="marketing-menu-button" type="button" aria-expanded={open} aria-controls="marketing-navigation" onClick={()=>setOpen(v=>!v)}>{open?"Close":"Menu"} <span aria-hidden="true">{open?"×":"☰"}</span></button>
   <nav id="marketing-navigation" className={"marketing-links"+(open?" is-open":"")} aria-label="Public navigation">
    <Link href="/app/swap" onClick={()=>setOpen(false)}>Trade</Link>
    <Link href="/app/pools" onClick={()=>setOpen(false)}>Liquidity</Link>
    <Link href="/app/mining" onClick={()=>setOpen(false)}>Earn</Link>
    <Link href="/app/launchpad" onClick={()=>setOpen(false)}>Explore</Link>
    <a href="https://github.com/mushee-io/Symb-dex" target="_blank" rel="noopener noreferrer">Developers ↗</a>
   </nav>
   <div className="marketing-header-actions"><WalletConnect/><Link href="/app/swap" className="marketing-launch">Launch App <span>↗</span></Link></div>
  </div>
 </header>;
}
