import Link from "next/link";
import {PoolDirectory} from "@/components/liquidity/pool-directory";
export const metadata={title:"Liquidity Pools"};
export default function Pools(){return <div className="dex-content-page">
 <div className="dex-split-page">
  <section className="dex-panel dex-pool-panel">
   <div className="dex-section-toolbar"><h1>Add Liquidity</h1><Link href="/app/pools/create" className="dex-outline-yellow"><span>＋</span> Create Pool</Link></div>
   <div className="dex-section-subheading"><span className="dex-network-chip">◈ VERY Mainnet</span><span>Only factory-verified liquidity pools appear here.</span></div>
   <PoolDirectory/>
  </section>
  <aside className="dex-panel dex-help-panel">
   <h2><span className="dex-help-icon">?</span> SEE HOW IT WORKS</h2>
   <div className="dex-help-art"><span>◈</span><span>↔</span><span>◈</span></div>
   <h3>Liquidity</h3><p>Provide tokens to a verified liquidity pool and receive LP shares representing your position.</p>
   <p>Pool creation and withdrawals require deployed, reviewed contracts. No pools are fabricated.</p>
   <Link href="/app/pools/create">Explore liquidity management ↗</Link>
  </aside>
 </div>
 </div>;}
