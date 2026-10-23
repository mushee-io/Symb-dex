"use client";

import { useCallback, useEffect, useState } from "react";
import { formatEther } from "viem";
import { VERY_NETWORK, walletChainParameters } from "@/lib/very";

type Provider = {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
  on?(event: string, handler: (...args: unknown[]) => void): void;
  removeListener?(event: string, handler: (...args: unknown[]) => void): void;
};

declare global {
  interface Window {
    ethereum?: Provider;
  }
}

function provider(): Provider | undefined {
  return typeof window === "undefined" ? undefined : window.ethereum;
}

function abbreviated(address: string) {
  return address.slice(0, 6) + "…" + address.slice(-4);
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Wallet request failed.";
}

export function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [correctChain, setCorrectChain] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async (wallet: Provider) => {
    try {
      const accounts = await wallet.request({ method: "eth_accounts" }) as string[];
      const chainId = await wallet.request({ method: "eth_chainId" }) as string;
      const address = Array.isArray(accounts) && accounts.length ? accounts[0] : null;
      const matches = BigInt(chainId) === BigInt(VERY_NETWORK.chainId);
      setAccount(address);
      setCorrectChain(matches);
      setBalance(null);
      if (address && matches) {
        const raw = await wallet.request({ method: "eth_getBalance", params: [address, "latest"] }) as string;
        setBalance(Number(formatEther(BigInt(raw))).toLocaleString(undefined, { maximumFractionDigits: 4 }));
      }
    } catch (cause) {
      setError(errorMessage(cause));
    }
  }, []);

  useEffect(() => {
    const wallet = provider();
    if (!wallet) return;
    const listener = () => { void refresh(wallet); };
    listener();
    wallet.on?.("accountsChanged", listener);
    wallet.on?.("chainChanged", listener);
    return () => {
      wallet.removeListener?.("accountsChanged", listener);
      wallet.removeListener?.("chainChanged", listener);
    };
  }, [refresh]);

  async function connect() {
    const wallet = provider();
    if (!wallet) {
      setError("Install an EVM wallet extension such as MetaMask to connect.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await wallet.request({ method: "eth_requestAccounts" });
      await refresh(wallet);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  async function switchChain() {
    const wallet = provider();
    if (!wallet) return;
    setBusy(true);
    setError("");
    try {
      try {
        await wallet.request({ method: "wallet_switchEthereumChain", params: [{ chainId: VERY_NETWORK.chainIdHex }] });
      } catch (cause) {
        const code = cause && typeof cause === "object" && "code" in cause ? Number(cause.code) : 0;
        if (code !== 4902) throw cause;
        await wallet.request({ method: "wallet_addEthereumChain", params: [walletChainParameters] });
      }
      await refresh(wallet);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wallet-area">
      {account && correctChain && <span className="wallet-balance">{balance ?? "—"} VERY</span>}
      {account && !correctChain ? (
        <button className="wallet-button wrong-network" onClick={switchChain} disabled={busy}>
          {busy ? "Switching…" : "Switch to VERY"}
        </button>
      ) : (
        <button className="wallet-button" onClick={connect} disabled={busy}>
          {busy ? "Connecting…" : account ? abbreviated(account) : "Connect wallet"}
        </button>
      )}
      {error && <div className="wallet-error" role="alert">{error}</div>}
    </div>
  );
}
