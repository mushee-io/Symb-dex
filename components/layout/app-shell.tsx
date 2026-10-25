"use client";
import {useState,type ReactNode} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import registry from "@/config/verified-tokens.json";
import {WalletConnect} from "@/components/wallet-connect";
const nav=[
 {title:"TRADE",items:[{href:"/app/swap",name:"Swap",icon:"⇄"},{href:"/app/limit",name:"Limit",icon:"≋"}]},
 {title:"LIQUIDITY",items:[{href:"/app/pools",name:"Pools",icon:"◫"},{href:"/app/mining",name:"Mining",icon:"◇"}]},
 {title:"LAUNCHPAD",items:[{href:"/app/launchpad",name:"Overview",icon:"▦"},{href:"/app/launchpad/crowdpooling",name:"Crowdpooling",icon:"◎"},{href:"/app/launchpad/create",name:"Create Token",icon:"⊕"}]},
 {title:"ACCOUNT",items:[{href:"/app/portfolio",name:"Portfolio",icon:"◈"},{href:"/app/orders",name:"Orders",icon:"▤"}]},
];
type RegistryToken={address:string;symbol:string;name:string};
export function AppShell({children}:{children:ReactNode}){
 const path=usePathname();
 const [mobile,setMobile]=useState(false);
 const [collapsed,setCollapsed]=useState(false);
 const [chainMenu,setChainMenu]=useState(false);
 const [search,setSearch]=useState("");
 const [searchOpen,setSearchOpen]=useState(false);
 const known=registry.tokens as RegistryToken[];
 const filtered=search.trim()?known.filter(t=>(t.name+" "+t.symbol+" "+t.address).toLowerCase().includes(search.toLowerCase())).slice(0,6):[];
 return <div className={"dex-app"+(collapsed?" dex-condensed":"")}>
   {mobile&&<button className="dex-backdrop" aria-label="Close menu" type="button" onClick={()=>setMobile(false)}/>}
   <aside className={"dex-sidebar"+(mobile?" dex-sidebar-mobile-open":"")}>
    <div className="dex-logo-row"><Link href="/" aria-label="Symb Dex public homepage" className="dex-logo"><span className="dex-fish-glyph"><img src="/brand/symb-fish.svg" width="48" height="32" alt="" /></span><b>SYMB DEX</b></Link><button type="button" className="dex-collapse" onClick={()=>setCollapsed(v=>!v)} aria-label={collapsed?"Expand sidebar":"Collapse sidebar"}>⇤</button></div>
    <nav aria-label="Exchange navigation" className="dex-sidebar-nav">
     {nav.map(group=><div className="dex-nav-group" key={group.title}>
      <span className="dex-group-label">{group.title}</span>
      {group.items.map(item=><Link key={item.href} title={item.name} className={"dex-nav-item"+((path===item.href||path.startsWith(item.href+"/"))?" dex-active":"")} href={item.href} onClick={()=>setMobile(false)}>
       <span className="dex-nav-icon" aria-hidden="true">{item.icon}</span><span className="dex-nav-name">{item.name}</span>
      </Link>)}
     </div>)}
    </nav>
    <div className="dex-sidebar-bottom">
     <a href="https://github.com/mushee-io/Symb-dex" target="_blank" rel="noopener noreferrer" className="dex-footer-link"><span>⌘</span><span className="dex-nav-name">Developer Portal ↗</span></a>
     <Link href="/testnet/status" className="dex-footer-link"><span>◴</span><span className="dex-nav-name">Testnet Status</span></Link>
     <div className="dex-sidebar-bottom-line"><Link href="/">⌂</Link><a href="https://github.com/mushee-io/Symb-dex" target="_blank" rel="noopener noreferrer">◎</a><span className="dex-sidebar-version">v0.7 · Beta UI</span></div>
    </div>
   </aside>
   <div className="dex-body">
    <div className="dex-toolbar">
     <button className="dex-mobile-menu" type="button" aria-label="Open exchange navigation" onClick={()=>setMobile(true)}>☰</button>
     <div className="dex-search" role="search">
      <span aria-hidden="true">⌕</span>
      <input type="search" value={search} aria-label="Search verified tokens by symbol or address" placeholder="Search by symbol or address" onChange={e=>{setSearch(e.target.value);setSearchOpen(true)}} onFocus={()=>setSearchOpen(true)} onBlur={()=>{window.setTimeout(()=>setSearchOpen(false),170)}}/>
      <button type="button" aria-expanded={chainMenu} onClick={()=>setChainMenu(v=>!v)}><span className="dex-yellow-circle">▦</span> VERY <span>▾</span></button>
      {searchOpen&&search&&<div className="dex-search-results">
       {filtered.length?filtered.map(t=><div key={t.address}><strong>{t.symbol} · {t.name}</strong><small>{t.address.slice(0,10)}…{t.address.slice(-6)} · Reviewed</small></div>):<p>No reviewed VERY tokens match. You can import a token in Explore, but imports are unverified.</p>}
      </div>}
     </div>
     <div className="dex-toolbar-actions">
      <div className="dex-chain-control">
       <button type="button" aria-expanded={chainMenu} aria-controls="dex-chain-list" onClick={()=>setChainMenu(v=>!v)}>VERY Mainnet ▾</button>
       {chainMenu&&<div id="dex-chain-list" className="dex-chain-menu"><strong>Supported networks</strong><button type="button" onClick={()=>setChainMenu(false)}><span className="dex-yellow-circle">▦</span> VERY Mainnet <span>✓</span></button><p>Only VERY is supported. The separate Symb devnet is not publicly configured.</p></div>}
      </div>
      <WalletConnect/>
      <Link href="/app/settings" className="dex-toolbar-icon" aria-label="Exchange settings">☷</Link>
     </div>
    </div>
    <div className="dex-network-note"><span>◉</span> VERY Mainnet · Trading contracts not yet active <Link href="/testnet/status">Network status ↗</Link></div>
    <main className="dex-main">{children}</main>
   </div>
 </div>;
}
