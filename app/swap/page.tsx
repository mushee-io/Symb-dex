"use client";

import Link from "next/link";
import { useState } from "react";
import { useTokenRegistry } from "@/hooks/use-token-registry";

export default function SwapPage() {
  const { tokens } = useTokenRegistry();
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  return (
    <main className="shell subpage">
      <div className="page-heading"><span className="eyebrow">TRADE ON VERY</span><h1>Swap</h1><p>Plan a swap using locally imported assets. No quotes or transactions are generated until verified AMM contracts launch.</p></div>
      <div className="swap-container">
        <div className="swap-heading"><strong>Swap assets</strong><span className="status-pill">● Not live</span></div>
        <div className="token-box">
          <label className="field-label" htmlFor="swap-amount">YOU PAY</label>
          <div className="token-row"><input id="swap-amount" inputMode="decimal" type="text" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00"/><span className="token-chip">◈ VERY</span></div>
          <span className="muted-small">No liquidity or output quote is currently available.</span>
        </div>
        <div className="swap-direction">↓</div>
        <div className="token-box">
          <label className="field-label" htmlFor="swap-token">YOU RECEIVE</label>
          <div className="token-row"><input readOnly aria-label="Estimated output" placeholder="—" /><select id="swap-token" className="token-dropdown" value={selectedToken} onChange={(event) => setSelectedToken(event.target.value)}><option value="">Select token</option>{tokens.map((token) => <option key={token.address} value={token.address}>{token.symbol} · {token.address.slice(0, 6)}…{token.address.slice(-4)}</option>)}</select></div>
          <span className="muted-small">All imported tokens are unverified until independently reviewed.</span>
        </div>
        <div className="notice">Swap execution is disabled. Verified router, WVERY address and liquidity pools are not configured. Importing a token never makes it tradable.</div>
        <button type="button" disabled className="swap-submit">Trading not yet enabled</button>
        <p className="muted-small" style={{ marginTop: 16 }}>Don’t see a token? <Link href="/explore" className="link-accent">Import contract address ↗</Link></p>
      </div>
      <p className="subpage-footnote">Never transfer funds to unverified contracts. No approvals or swaps are initiated here.</p>
    </main>
  );
}
