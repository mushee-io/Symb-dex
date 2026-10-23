"use client";

import { formatUnits, erc20Abi, type Address } from "viem";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { very } from "@/lib/very";
import type { LiddeToken } from "@/hooks/use-token-registry";

export function TokenBalanceRow({ token, onRemove }: { token: LiddeToken; onRemove?: (address: Address) => void }) {
  const { address } = useAccount();
  const chainId = useChainId();
  const enabled = Boolean(address && chainId === very.id);
  const { data: balance, isPending, isError, refetch } = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    chainId: very.id,
    query: { enabled, refetchInterval: enabled ? 30_000 : false, retry: 1 },
  });

  return (
    <div className="asset-row">
      <div className="asset-details">
        <div className="asset-symbol">{token.symbol.slice(0, 2).toUpperCase()}</div>
        <div className="asset-name"><strong>{token.symbol}</strong><small>{token.name}</small></div>
      </div>
      <div className="asset-values">
        <div className="asset-amount">
          {!enabled ? "Connect on VERY" : isPending ? "Loading…" : isError ? "Unavailable" : balance !== undefined ? formatUnits(balance, token.decimals) : "—"}
        </div>
        <div className="asset-controls">
          <a href={`https://veryscan.io/address/${token.address}`} target="_blank" rel="noreferrer">Contract ↗</a>
          {enabled && <button type="button" onClick={() => void refetch()}>Refresh</button>}
          {onRemove && !token.verified && <button type="button" onClick={() => onRemove(token.address)}>Remove</button>}
        </div>
        <span className={token.verified ? "token-reviewed" : "token-unverified"}>
          {token.verified ? "Reviewed address" : "Unverified import"}
        </span>
      </div>
    </div>
  );
}
