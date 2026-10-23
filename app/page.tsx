import Link from "next/link";

const features = [
  { n: "01", title: "Trade", description: "Swap digital assets with on-chain settlement once verified markets launch.", href: "/swap" },
  { n: "02", title: "Provide liquidity", description: "Earn pool fees by supplying assets to audited, deployed pools.", href: "/pools" },
  { n: "03", title: "Explore", description: "Discover pools and verified tokens with transparent on-chain data.", href: "/explore" }
];

export default function HomePage() {
  return (
    <main>
      <section className="hero shell">
        <div className="eyebrow"><span className="online-dot" /> BUILT FOR VERY MAINNET · IN DEVELOPMENT</div>
        <h1>Trading belongs<br /><em>to everyone.</em></h1>
        <p className="hero-copy">Meet Lidde. A simple, non-custodial exchange being built for the VERY Chain ecosystem. Connect your wallet, explore the roadmap and follow our build.</p>
        <div className="hero-actions">
          <Link className="primary-link" href="/swap">Explore exchange <span>↗</span></Link>
          <a className="secondary-link" href="https://github.com/mushee-io/lidde-dex" target="_blank" rel="noreferrer">View source ↗</a>
        </div>
        <p className="disclosure">Development preview. No AMM or swaps are deployed by this repository; do not transfer funds to unverified contracts.</p>
      </section>
      <section className="shell chain-panel" aria-label="Network configuration">
        <div><span className="field-label">NETWORK</span><strong>VERY Mainnet</strong></div>
        <div><span className="field-label">CHAIN ID</span><strong>4613</strong></div>
        <div><span className="field-label">SETTLEMENT</span><strong>On-chain · planned</strong></div>
        <div><span className="field-label">RELEASE STATUS</span><strong>Not live</strong></div>
      </section>
      <section className="shell section-spaced">
        <div className="section-top"><span className="eyebrow">THE EXCHANGE</span><h2>Built for what<br />comes next.</h2></div>
        <div className="feature-grid">
          {features.map((feature) => (
            <Link className="feature-card" href={feature.href} key={feature.n}>
              <span className="feature-number">{feature.n}</span>
              <h3>{feature.title} <span>↗</span></h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="shell progress-banner">
        <div><span className="eyebrow">MILESTONE 01</span><h2>Foundation first.<br />Real liquidity later.</h2></div>
        <p>We are validating the network, establishing wallet connectivity and implementing security gates before handling real assets.</p>
      </section>
    </main>
  );
}
