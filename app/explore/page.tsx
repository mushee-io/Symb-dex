import { TokenManager } from "@/components/token-manager";

export const metadata = { title: "Explore" };

export default function ExplorePage() {
  return <main className="shell subpage">
    <div className="page-heading">
      <span className="eyebrow">ON-CHAIN DISCOVERY</span>
      <h1>Explore assets</h1>
      <p>Import VERY Mainnet ERC-20 tokens by contract address and view real balances. A discovered token is not necessarily safe or tradable.</p>
    </div>
    <div className="metric-grid">
      <div className="metric-box"><span className="field-label">TOTAL VALUE LOCKED</span><strong>—</strong><small>Not indexed</small></div>
      <div className="metric-box"><span className="field-label">24H VOLUME</span><strong>—</strong><small>Not indexed</small></div>
      <div className="metric-box"><span className="field-label">ACTIVE POOLS</span><strong>—</strong><small>Not deployed</small></div>
    </div>
    <TokenManager />
  </main>;
}
