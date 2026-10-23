import Link from "next/link";

export const metadata = { title: "Liquidity Pools" };

export default function PoolsPage() {
  return <main className="shell subpage">
    <div className="page-heading"><span className="eyebrow">MARKET LIQUIDITY</span><h1>Pools</h1><p>Provide liquidity and manage LP positions when reviewed contracts launch.</p></div>
    <div className="empty-panel"><span className="panel-symbol">◈</span><h2>Liquidity is coming.</h2><p>Lidde has not configured a verified pool factory or router. Pool creation, deposits and withdrawals are disabled to protect users.</p><Link href="/swap" className="secondary-link">Return to Swap ↗</Link></div>
  </main>;
}
