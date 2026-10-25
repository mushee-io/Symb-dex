import Link from "next/link";
import {demoNetwork, testnetReady} from "@/lib/testnet/network";

const features = [
  {
    number: "01", icon: "↗", tag: "EXCHANGE",
    title: "Swap with intention.",
    description: "A straightforward trading terminal for testing token swaps, routing and settlement with synthetic assets.",
    href: "/testnet", cta: "Explore trading",
  },
  {
    number: "02", icon: "◎", tag: "LIQUIDITY",
    title: "Put liquidity to work.",
    description: "Create experimental pools, inspect positions and rehearse adding or withdrawing LP shares.",
    href: "/testnet/pools", cta: "Explore pools",
  },
  {
    number: "03", icon: "+", tag: "TOKEN STUDIO",
    title: "Launch what is next.",
    description: "Create capped, valueless test tokens and explore permissionless market creation in the sandbox.",
    href: "/testnet/launch", cta: "Explore token creator",
  },
  {
    number: "04", icon: "⇄", tag: "ADVANCED ORDERS",
    title: "Trade on your terms.",
    description: "Explore the demo limit-order experience with escrow, partial fills and cancellations.",
    href: "/testnet/orders", cta: "Explore orders",
  },
];

const stages = [
  {number:"01",title:"Connect",copy:"Bring a compatible wallet to an isolated, zero-value development network."},
  {number:"02",title:"Claim",copy:"Request synthetic tokens through the faucet once the public testnet is operational."},
  {number:"03",title:"Explore",copy:"Try swaps, pool creation and LP exits, then inspect the transaction receipts."},
];

function Arrow({diagonal=false}:{diagonal?:boolean}) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export default function HomePage() {
  return <main className="hm">
    <section className="hm-hero" aria-labelledby="hm-hero-title">
      <div className="hm-glow" aria-hidden="true" />
      <div className="shell hm-hero-layout">
        <div className="hm-hero-content">
          <div className="hm-kicker"><span className="hm-kicker-symbol">✳</span> THE NEXT GENERATION OF ONCHAIN MARKETS</div>
          <h1 id="hm-hero-title">The market.<br /><span>Your move.</span></h1>
          <p className="hm-hero-lede">One place to explore decentralized trading, liquidity and new markets. Built to make every move more intuitive.</p>
          <div className="hm-hero-actions">
            <Link href="/testnet" className="hm-button hm-button-primary">Enter Symb Dex <Arrow diagonal /></Link>
            <Link href="/testnet/status" className="hm-button hm-button-outline">Network status <Arrow /></Link>
          </div>
          <div className="hm-trust-line">
            <span className="hm-tiny-spark" aria-hidden="true">✳</span>
            <span>Non-custodial by design</span>
            <span className="hm-trust-divider" aria-hidden="true" />
            <span>Testnet-first development</span>
          </div>
        </div>

        <div className="hm-visual" aria-label="Illustrative preview of the Symb trading interface">
          <div className="hm-orbit hm-orbit-one" aria-hidden="true" />
          <div className="hm-orbit hm-orbit-two" aria-hidden="true" />
          <div className="hm-terminal">
            <div className="hm-terminal-header">
              <span className="hm-terminal-brand"><span className="hm-terminal-brand-icon">↗</span> SYMB <span className="hm-term-accent">/</span> TERMINAL</span>
              <span className="hm-demo-label">INTERFACE CONCEPT</span>
            </div>
            <div className="hm-terminal-pair">
              <div>
                <small>SANDBOX PAIR</small>
                <strong>tBTC <span>/</span> tUSD</strong>
              </div>
              <div className="hm-terminal-pair-side"><small>MARKET DATA</small><strong>— <span>Not live</span></strong></div>
            </div>
            <div className="hm-chart-shell">
              <div className="hm-chart-lines" aria-hidden="true" />
              <svg className="hm-chart" viewBox="0 0 520 218" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="hm-chart-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c5fa80" stopOpacity=".26"/>
                    <stop offset="100%" stopColor="#c5fa80" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 169 C24 164 32 175 51 156 S84 151 103 158 S131 139 152 143 S186 168 205 145 S231 116 252 129 S287 119 310 91 S341 104 363 81 S393 75 412 56 S446 77 463 38 S499 48 520 20 L520 218 L0 218 Z" fill="url(#hm-chart-fill)" />
                <path d="M0 169 C24 164 32 175 51 156 S84 151 103 158 S131 139 152 143 S186 168 205 145 S231 116 252 129 S287 119 310 91 S341 104 363 81 S393 75 412 56 S446 77 463 38 S499 48 520 20" stroke="#c5fa80" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="520" cy="20" r="5" fill="#c5fa80" />
              </svg>
              <div className="hm-chart-watermark">SYMB<span>↗</span></div>
            </div>
            <div className="hm-terminal-footer">
              <div><span>MARKET ROUTING</span><strong>AMM / TESTNET</strong></div>
              <div><span>ORDER EXECUTION</span><strong>IN DEVELOPMENT</strong></div>
              <div className="hm-terminal-bar-icon" aria-hidden="true"><i/><i/><i/><i/></div>
            </div>
          </div>
          <div className="hm-float-card" aria-hidden="true"><span className="hm-float-icon">✳</span><span><strong>Freedom to explore</strong><small>No real-value assets</small></span></div>
          <span className="hm-visual-footnote">Design illustration · not live prices or trading activity</span>
        </div>
      </div>
    </section>

    <section className="hm-ticker" aria-label="Symb development status">
      <div className="shell hm-ticker-inner">
        <div className="hm-ticker-item"><span className="hm-ticker-dot" /> <span>DEVELOPMENT STATUS</span><strong>{testnetReady ? "Demo chain configured" : "Public testnet pending"}</strong></div>
        <div className="hm-ticker-item"><span>NETWORK</span><strong>{testnetReady ? `Test chain ${demoNetwork?.chainId}` : "Isolated EVM testnet"}</strong></div>
        <div className="hm-ticker-item"><span>ASSETS</span><strong>Zero real value</strong></div>
      </div>
    </section>

    <section className="shell hm-features" id="features">
      <div className="hm-section-heading">
        <div><span className="hm-overline"><span className="hm-square" /> THE SYMB ECOSYSTEM</span><h2>Everything you need.<br/><span>Nothing in the way.</span></h2></div>
        <p>One thoughtfully designed experience for discovering how markets can work onchain. Start with the core tools, explore the possibilities.</p>
      </div>
      <div className="hm-feature-grid">
        {features.map((feature) => <Link href={feature.href} key={feature.number} className="hm-feature-card">
          <div className="hm-feature-card-top"><span>{feature.number} / {feature.tag}</span><span className="hm-feature-icon">{feature.icon}</span></div>
          <div><h3>{feature.title}</h3><p>{feature.description}</p></div>
          <span className="hm-feature-cta">{feature.cta} <Arrow /></span>
        </Link>)}
      </div>
    </section>

    <section className="hm-journey">
      <div className="shell hm-journey-layout">
        <div className="hm-journey-intro">
          <span className="hm-overline"><span className="hm-square"/> GET STARTED</span>
          <h2>Built to explore.<br/><span>Made to evolve.</span></h2>
          <p>Symb is preparing an isolated development network so early testers can experience the exchange without depositing real assets.</p>
          <Link href="/testnet/status" className="hm-text-link">Check deployment progress <Arrow diagonal /></Link>
        </div>
        <div className="hm-journey-list">
          {stages.map(stage=><div className="hm-step" key={stage.number}>
            <span className="hm-step-number">{stage.number}</span>
            <div><h3>{stage.title}</h3><p>{stage.copy}</p></div>
            <span className="hm-step-chevron" aria-hidden="true">↗</span>
          </div>)}
        </div>
      </div>
    </section>

    <section className="shell hm-final">
      <div className="hm-final-card">
        <div className="hm-final-orb" aria-hidden="true">✳</div>
        <div className="hm-final-content">
          <span className="hm-overline">BE PART OF WHAT IS NEXT</span>
          <h2>There is more<br/>to the market.</h2>
          <p>Discover the Symb interface and follow the path to the first public testnet.</p>
          <div className="hm-final-actions">
            <Link href="/testnet" className="hm-button hm-button-dark">Explore Symb Dex <Arrow diagonal /></Link>
            <a href="https://github.com/mushee-io/Symb-dex" target="_blank" rel="noopener noreferrer" className="hm-final-source">Explore the code <Arrow diagonal /></a>
          </div>
        </div>
      </div>
      <p className="hm-legal">Symb Dex is under development. {testnetReady ? "Verify any configured demo network before signing transactions." : "Public testnet contracts and the faucet are not yet live."} This website does not offer live trading. VERY Mainnet (chain ID 4613) is separate and remains restricted; do not send real assets to demo addresses.</p>
    </section>
  </main>;
}
