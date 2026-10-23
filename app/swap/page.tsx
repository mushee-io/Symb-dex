import { SwapTerminal } from "@/components/swap/swap-terminal";

export const metadata = { title: "Swap" };

export default function SwapPage() {
  return <main className="shell subpage">
    <div className="page-heading">
      <span className="eyebrow">TRADE ON VERY</span>
      <h1>Swap</h1>
      <p>Read real pool reserves, compare supported swap routes and prepare transactions protected by minimum output, deadline and mandatory wallet simulation.</p>
    </div>
    <SwapTerminal />
    <p className="subpage-footnote">Trading requires independently verified AMM contracts and liquidity. Until those exist, no transaction can be submitted.</p>
  </main>;
}
