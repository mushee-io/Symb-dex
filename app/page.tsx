import Link from "next/link";
import {demoNetwork,testnetReady} from "@/lib/testnet/network";
const features=[
 {n:"01",title:"Public testnet",description:"Claim synthetic assets, connect a test wallet and execute actual demo-network swaps after deployment.",href:"/testnet"},
 {n:"02",title:"Liquidity development",description:"Our Solidity pools support deposits, LP shares, swaps and redemptions in isolated Foundry tests.",href:"/pools"},
 {n:"03",title:"Open development",description:"Follow Milestone 10 and help test real transactions without risking mainnet assets.",href:"https://github.com/mushee-io/lidde-dex/blob/main/MILESTONE-10.md"},
];
export default function HomePage(){
 return <main>
  <section className="hero shell">
   <div className="eyebrow"><span className="online-dot"/> TESTNET-FIRST DEVELOPMENT · NO REAL FUNDS</div>
   <h1>Trading belongs<br/><em>to everyone.</em></h1>
   <p className="hero-copy">Meet Lidde: an experimental decentralized exchange being built toward VERY.
    Our immediate focus is a separate demo network where users can learn, test swaps and explore liquidity using valueless tokens.</p>
   <div className="hero-actions">
    <Link className="primary-link" href="/testnet">Explore testnet <span>↗</span></Link>
    <a className="secondary-link" href="https://github.com/mushee-io/lidde-dex" target="_blank" rel="noreferrer">View source ↗</a>
   </div>
   <p className="disclosure">{testnetReady?"A separate demo chain is configured. Verify its identity before signing.":"Testnet configuration and public contracts are not yet deployed. No swaps are live."} VERY Mainnet chain 4613 remains locked; never transfer real assets to demo contracts.</p>
  </section>
  <section className="shell chain-panel" aria-label="Current development network">
   <div><span className="field-label">CURRENT TRACK</span><strong>User testnet</strong></div>
   <div><span className="field-label">TEST CHAIN</span><strong>{testnetReady?demoNetwork?.chainId:"Not configured"}</strong></div>
   <div><span className="field-label">SETTLEMENT</span><strong>On-chain test transactions</strong></div>
   <div><span className="field-label">PUBLIC TESTNET</span><strong>{testnetReady?"Configured":"Awaiting deployment"}</strong></div>
  </section>
  <section className="shell section-spaced">
   <div className="section-top"><span className="eyebrow">THE TEST EXCHANGE</span><h2>Real testing.<br/>Zero-value assets.</h2></div>
   <div className="feature-grid">
    {features.map(f=><Link className="feature-card" href={f.href} key={f.n}>
     <span className="feature-number">{f.n}</span><h3>{f.title}<span>↗</span></h3><p>{f.description}</p>
    </Link>)}
   </div>
  </section>
  <section className="shell progress-banner">
   <div><span className="eyebrow">MILESTONE 10</span><h2>Network. Faucet.<br/>Actual test swaps.</h2></div>
   <p>The next proof is an external wallet getting free demo tokens, trading on an isolated blockchain,
    and withdrawing a demo LP position with inspectable receipts.</p>
  </section>
 </main>;
}
