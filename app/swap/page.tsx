import deployments from "@/config/deployments.json";
import { isTradingEnabled } from "@/lib/release-gate.mjs";

export const metadata = { title: "Swap" };

export default function SwapPage() {
  const live = isTradingEnabled(deployments);
  return (
    <main className="shell subpage">
      <div className="page-heading"><span className="eyebrow">TRADE ON VERY</span><h1>Swap</h1><p>Real asset execution will be available only after audited contracts and verified pools are deployed.</p></div>
      <div className="swap-container">
        <div className="swap-heading"><strong>Swap assets</strong><span className="status-pill">● {live ? "Configured" : "Not live"}</span></div>
        <div className="token-box"><span className="field-label">YOU PAY</span><div className="token-row"><input inputMode="decimal" aria-label="Amount to pay" placeholder="0.00"/><span className="token-chip">◈ VERY</span></div><span className="muted-small">Connected wallet balance is displayed in the navigation.</span></div>
        <div className="swap-direction">↓</div>
        <div className="token-box"><span className="field-label">YOU RECEIVE</span><div className="token-row"><input readOnly aria-label="Estimated output" placeholder="—"/><span className="token-chip">Select token</span></div><span className="muted-small">Quotes unavailable: no verified router or pools.</span></div>
        <div className="notice">No verified liquidity contracts or canonical WVERY address are configured. This interface cannot approve tokens or send swaps.</div>
        <button type="button" disabled className="swap-submit">{live ? "Execution requires wallet integration" : "Trading not yet enabled"}</button>
      </div>
      <p className="subpage-footnote">Never transfer funds to token or pool addresses unless you independently verify them on VeryScan.</p>
    </main>
  );
}
