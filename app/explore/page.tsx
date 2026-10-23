export const metadata = { title: "Explore" };

export default function ExplorePage() {
  return <main className="shell subpage">
    <div className="page-heading"><span className="eyebrow">ON-CHAIN DISCOVERY</span><h1>Explore markets</h1><p>Transparent markets start with verified on-chain contracts and reliable indexing.</p></div>
    <div className="metric-grid">
      <div className="metric-box"><span className="field-label">TOTAL VALUE LOCKED</span><strong>—</strong><small>Not indexed</small></div>
      <div className="metric-box"><span className="field-label">24H VOLUME</span><strong>—</strong><small>Not indexed</small></div>
      <div className="metric-box"><span className="field-label">ACTIVE POOLS</span><strong>—</strong><small>Not deployed</small></div>
    </div>
    <div className="empty-panel"><h2>No verified markets listed yet.</h2><p>We will not fabricate token prices, trading volume, TVL or pool statistics. Data will be indexed from actual chain events after deployment.</p></div>
  </main>;
}
