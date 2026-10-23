"use client";

import Link from "next/link";
import { formatUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";
import { very } from "@/lib/very";
import { useTokenRegistry } from "@/hooks/use-token-registry";
import { TokenBalanceRow } from "@/components/token-balances";

export function PortfolioAssets() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const onVery = isConnected && chainId === very.id;
  const { data: native, isPending } = useBalance({
    address, chainId: very.id, query: { enabled: onVery, refetchInterval: onVery ? 30_000 : false },
  });
  const { tokens, removeToken } = useTokenRegistry();

  return (
    <section className="portfolio-section">
      {!isConnected ? <div className="inline-notice">Connect a wallet with the button above to read your VERY and token balances.</div> :
        !onVery ? <div className="inline-notice">Wallet connected to the wrong network. Use “Switch to VERY” to load balances.</div> : null}
      <div className="native-asset">
        <span className="field-label">YOUR NATIVE VERY BALANCE</span>
        <strong>{!onVery ? "—" : isPending ? "Loading…" : native ? formatUnits(native.value, native.decimals) : "Unavailable"} <span>VERY</span></strong>
        <p>Read directly from chain ID 4613; not a synthetic portfolio estimate.</p>
      </div>
      <div className="section-title-row"><div><span className="eyebrow">ERC-20 BALANCES</span><h2>Watched assets</h2></div><Link href="/explore" className="secondary-link">Import token ↗</Link></div>
      <div className="asset-table">
        {tokens.length ? tokens.map((token) => <TokenBalanceRow key={token.address} token={token} onRemove={removeToken}/>) :
          <div className="no-assets">No ERC-20 tokens in your local watchlist. Add a token by contract address to display its actual balance.</div>}
      </div>
      <div className="portfolio-footer-links">
        <Link className="secondary-link" href="/approvals">Manage token approvals ↗</Link>
        <a className="secondary-link" href="https://veryscan.io" target="_blank" rel="noreferrer">Explore VERY Mainnet ↗</a>
      </div>
      <div className="empty-panel lp-coming">
        <h2>Liquidity positions are not live.</h2>
        <p>No LP contracts are configured. Lidde does not hold your private keys or custody funds.</p>
      </div>
    </section>
  );
}
