import Link from "next/link";
import {CurvedCarousel} from "@/components/marketing/curved-carousel";
import {demoNetwork,testnetReady} from "@/lib/testnet/network";
export default function HomePage(){
 return <main className="sy-home">
  <section className="sy-home-hero">
   <div className="sy-announce"><span className="sy-announce-dot"><img src="/brand/symb-fish.svg" width="25" height="17" alt="" /></span> Built for the VERY ecosystem</div>
   <div className="sy-hero-type">
    <h1><span>Trade Without Limits.</span><span>Built for VERY.</span></h1>
    <p>Swap tokens, create liquidity and discover opportunities on VERY. One connected trading experience, built for the next generation of on-chain markets.</p>
   </div>
   <span className="sy-handnote sy-handnote-slashes" aria-hidden="true">//</span>
   <div className="sy-handnote sy-handnote-right" aria-hidden="true">On-chain, made easy<svg viewBox="0 0 170 126"><path d="M9 8 Q117 -3 132 96 M112 74 L133 98 L150 74" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
   <CurvedCarousel/>
   <div className="sy-home-actions">
    <span className="sy-handnote sy-handnote-start" aria-hidden="true">Start trading <svg viewBox="0 0 80 54"><path d="M5 5 Q27 45 69 27 M56 18 L70 28 L60 39" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
    <div className="sy-cta-outline"><Link className="sy-cta" href="/app/swap">Launch Symb Dex <span>↗</span></Link></div>
    <Link href="/app/pools" className="sy-secondary-cta">Explore Liquidity <span>→</span></Link>
   </div>
   <div className="sy-home-proof"><span><b>VERY Mainnet</b> Chain 4613</span><span><b>Self-custody</b> Wallet controlled</span><span><b>Public testnet</b> {testnetReady?`Configured · ${demoNetwork?.chainId}`:"Coming soon"}</span></div>
  </section>
  <section className="sy-home-after">
   <div><span>THE EXCHANGE</span><h2>All your markets.<br/><em>One seamless experience.</em></h2></div>
   <div className="sy-home-after-cards">
    <Link href="/app/swap"><span>01 / TRADE</span><strong>Swap and limit orders</strong><small>Discover the trading workspace →</small></Link>
    <Link href="/app/pools"><span>02 / LIQUIDITY</span><strong>Create and manage pools</strong><small>Explore liquidity →</small></Link>
    <Link href="/app/launchpad"><span>03 / DISCOVER</span><strong>Launch and discover</strong><small>Explore projects →</small></Link>
   </div>
  </section>
  <p className="sy-home-risk">Symb Dex is in development. These product previews are illustrations, not live markets. Onchain execution on VERY Mainnet remains disabled until verified contracts and security checks are complete. No public testnet is claimed until deployed.</p>
 </main>;
}
