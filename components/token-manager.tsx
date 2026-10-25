"use client";

import { useState, type FormEvent } from "react";
import { useAccount, useChainId } from "wagmi";
import { very } from "@/lib/very";
import { useTokenRegistry } from "@/hooks/use-token-registry";
import { TokenBalanceRow } from "@/components/token-balances";

function toMessage(value: unknown) {
  if (value && typeof value === "object" && "shortMessage" in value) return String(value.shortMessage);
  return value instanceof Error ? value.message : "Unable to import token.";
}

export function TokenManager() {
  const { tokens, importing, importToken, removeToken } = useTokenRegistry();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [contract, setContract] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!acknowledged) {
      setError("Please acknowledge the risks before importing an unverified token.");
      return;
    }
    try {
      const imported = await importToken(contract.trim());
      setContract("");
      setAcknowledged(false);
      setSuccess(`Imported ${imported.symbol} for balance display. This token remains unverified.`);
    } catch (err) {
      setError(toMessage(err));
    }
  }

  return (
    <section className="registry-section">
      <div className="section-title-row"><div><span className="eyebrow">TOKEN REGISTRY</span><h2>Your ERC-20 tokens</h2></div><span className="token-count">{tokens.length} listed</span></div>
      <div className="import-panel">
        <h3>Import a token</h3>
        <p>Enter a contract address deployed on VERY Mainnet. Symb reads its contract code and ERC-20 metadata directly from the chain. The token is <strong>not verified, audited or endorsed</strong> merely because it appears here.</p>
        <form onSubmit={(event) => void submit(event)}>
          <label htmlFor="erc20-address" className="field-label">VERY ERC-20 CONTRACT ADDRESS</label>
          <div className="import-actions">
            <input id="erc20-address" type="text" spellCheck={false} autoComplete="off" placeholder="0x..." value={contract} onChange={(event) => setContract(event.target.value)} maxLength={42} required/>
            <button type="submit" disabled={importing || !contract.trim() || !acknowledged}>{importing ? "Reading…" : "Import token"}</button>
          </div>
          <label className="acknowledge-row">
            <input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)}/>
            <span>I understand this is an <strong>unverified asset</strong> that may be malicious, unsellable or misleading. Importing does not approve funds.</span>
          </label>
        </form>
        {error && <p className="form-error" role="alert">{error}</p>}
        {success && <p className="form-success" role="status">{success}</p>}
        <p className="muted-small">Network: VERY Mainnet (4613). No tokens or balances are fabricated. Imported tokens are stored locally in this browser.</p>
      </div>
      {!isConnected && <p className="inline-notice">Connect your wallet to view balances.</p>}
      {isConnected && chainId !== very.id && <p className="inline-notice">Switch your wallet to VERY Mainnet to view on-chain balances. Imports still use VERY Mainnet RPC.</p>}
      <div className="asset-table">
        {tokens.length ? tokens.map((token) => <TokenBalanceRow key={token.address} token={token} onRemove={removeToken}/>)
          : <div className="no-assets">No independently verified tokens have been added to Symb yet. Import a contract address to monitor an unverified ERC-20 balance.</div>}
      </div>
    </section>
  );
}
