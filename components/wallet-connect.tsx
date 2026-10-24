"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { formatUnits } from "viem";
import { useAccount, useBalance, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { very } from "@/lib/very";
import { isWalletConnectConfigured } from "@/lib/wagmi";

function shortAddress(value: string) {
  return value.slice(0, 6) + "…" + value.slice(-4);
}
function readableError(err: unknown) {
  if (err && typeof err === "object" && "shortMessage" in err)
    return String(err.shortMessage);
  return err instanceof Error ? err.message : "Wallet connection failed.";
}

export function WalletConnect() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { connectors, connectAsync, isPending: connecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: switching } = useSwitchChain();
  const [message, setMessage] = useState("");
  const onVery = isConnected && chainId === very.id;
  const { data: balance, isLoading: loadingBalance } = useBalance({
    address,
    chainId: very.id,
    query: { enabled: onVery, refetchInterval: onVery ? 30_000 : false },
  });

  async function select(id: string) {
    const selected = connectors.find((item) => item.uid === id);
    if (!selected) return;
    setMessage("");
    try {
      await connectAsync({ connector: selected, chainId: very.id });
      setOpen(false);
    } catch (err) {
      setMessage(readableError(err));
    }
  }
  async function switchToVery() {
    setMessage("");
    try {
      await switchChainAsync({ chainId: very.id });
    } catch (err) {
      setMessage(readableError(err));
    }
  }

  const walletList = connectors.filter((item, index, list) =>
    list.findIndex((other) => other.uid === item.uid) === index
  );

  // The /testnet page has its own strictly test-chain-scoped wallet flow.
  // Do not show the mainnet-switching button on that page.
  if (path.startsWith("/testnet")) return null;

  return (
    <div className="wallet-area">
      {onVery && <span className="wallet-balance">
        {loadingBalance ? "…" : balance ? Number(formatUnits(balance.value, balance.decimals)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—"} VERY
      </span>}
      {isConnected && !onVery ? (
        <button type="button" className="wallet-button wrong-network" onClick={switchToVery} disabled={switching}>
          {switching ? "Switching…" : "Switch to VERY"}
        </button>
      ) : (
        <button type="button" className="wallet-button" onClick={() => { setMessage(""); setOpen(true); }}>
          {isConnected && address ? shortAddress(address) : "Connect wallet"}
        </button>
      )}
      {open && (
        <div className="wallet-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="wallet-dialog-title" className="wallet-dialog">
            <div className="wallet-dialog-top">
              <h2 id="wallet-dialog-title">{isConnected ? "Your wallet" : "Connect a wallet"}</h2>
              <button type="button" className="icon-button" aria-label="Close wallet dialog" onClick={() => setOpen(false)}>✕</button>
            </div>
            {isConnected && address && <p className="wallet-current">
              Connected with {connector?.name ?? "wallet"}<br />
              <a href={`https://veryscan.io/address/${address}`} target="_blank" rel="noreferrer">{shortAddress(address)} ↗</a>
            </p>}
            <p className="wallet-caption">Choose an EVM wallet. No private keys or recovery phrases are requested by Lidde.</p>
            <div className="wallet-options">
              {walletList.map((item) => (
                <button key={item.uid} type="button" disabled={connecting} onClick={() => void select(item.uid)}>
                  <span>{item.name}</span><span>↗</span>
                </button>
              ))}
            </div>
            {!isWalletConnectConfigured && <p className="wallet-caption">WalletConnect QR is not enabled until a project ID is configured. Browser wallets remain available.</p>}
            {isConnected && <button className="disconnect-button" type="button" onClick={() => { disconnect(); setOpen(false); }}>Disconnect</button>}
            {message && <p className="wallet-inline-error" role="alert">{message}</p>}
          </section>
        </div>
      )}
      {!open && message && <div className="wallet-error" role="alert">{message}</div>}
    </div>
  );
}
