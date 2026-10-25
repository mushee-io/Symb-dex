"use client";

import { useEffect, useMemo, useState } from "react";
import { erc20Abi, formatUnits, parseUnits, type Address, type Hash } from "viem";
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { very } from "@/lib/very";
import deployments from "@/config/deployments.json";
import { allowedRouter, canApprove } from "@/lib/approval-policy.mjs";
import { useTokenRegistry, type SymbToken } from "@/hooks/use-token-registry";

const deployment = deployments as {
  chainId: number; status: string; releaseApproved: boolean; auditReviewed: boolean;
  factory: string | null; router: string | null; wrappedVery: string | null;
};
const router = allowedRouter(deployment);

function AllowanceRow({ token }: { token: SymbToken }) {
  const { address } = useAccount();
  const chainId = useChainId();
  const enabled = canApprove({
    deployment, connectedAddress: address, connectedChainId: chainId, tokenAddress: token.address,
  });
  const [amount, setAmount] = useState("");
  const [hash, setHash] = useState<Hash | undefined>();
  const [notice, setNotice] = useState("");
  const { data: allowance, isPending: reading, refetch } = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address ?? "0x0000000000000000000000000000000000000000", router ?? "0x0000000000000000000000000000000000000000"],
    chainId: very.id,
    query: { enabled, retry: 1 },
  });
  const { writeContractAsync, isPending: submitting } = useWriteContract();
  const { data: receipt, isLoading: confirming, isError: receiptError } =
    useWaitForTransactionReceipt({ hash, chainId: very.id, confirmations: 1 });

  useEffect(() => {
    if (receipt?.status === "success") { void refetch(); setNotice("Transaction confirmed on VERY Mainnet."); }
    if (receipt?.status === "reverted") setNotice("The approval transaction reverted.");
  }, [receipt, refetch]);

  const parsedAmount = useMemo(() => {
    try {
      if (!/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(amount)) return null;
      const parsed = parseUnits(amount, token.decimals);
      return parsed > 0n ? parsed : null;
    } catch { return null; }
  }, [amount, token.decimals]);

  async function submit(value: bigint) {
    if (!enabled || !router || !address) return;
    setNotice("");
    setHash(undefined);
    try {
      const txHash = await writeContractAsync({
        address: token.address, abi: erc20Abi, functionName: "approve",
        args: [router as Address, value], chainId: very.id,
      });
      setHash(txHash);
      setNotice("Submitted to your wallet. Confirm on-chain before continuing.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Token approval rejected.");
    }
  }

  return <div className="approval-row">
    <div><strong>{token.symbol}</strong><small>{token.verified ? "Reviewed token" : "Unverified token — confirm the contract yourself"}</small></div>
    <div className="approval-data">
      <span>Router allowance: {enabled ? reading ? "Loading…" : allowance !== undefined ? formatUnits(allowance, token.decimals) : "Unavailable" : "Locked"}</span>
      <input aria-label={`Exact ${token.symbol} approval amount`} inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Exact amount"/>
      <button type="button" disabled={!enabled || submitting || confirming || allowance === undefined || allowance !== 0n || parsedAmount === null} onClick={() => { if (parsedAmount !== null) void submit(parsedAmount); }}>Approve exact</button>
      <button type="button" disabled={!enabled || submitting || confirming || allowance === undefined || allowance === 0n} onClick={() => void submit(0n)}>Revoke</button>
    </div>
    {hash && <a className="approval-hash" href={`https://veryscan.io/tx/${hash}`} target="_blank" rel="noreferrer">View transaction on VeryScan ↗</a>}
    {receiptError && <p className="form-error">Could not confirm transaction receipt. Verify status in VeryScan.</p>}
    {notice && <p className="muted-small" role="status">{notice}</p>}
    {allowance !== undefined && allowance > 0n && <p className="muted-small">For safer ERC-20 compatibility, revoke the existing allowance before approving a new amount.</p>}
  </div>;
}

export function AllowanceManager() {
  const { tokens } = useTokenRegistry();
  const { isConnected } = useAccount();
  return <section className="registry-section">
    {!router && <div className="inline-notice"><strong>Approvals disabled.</strong> Symb has no independently reviewed production router configured. No approval transaction can be signed from this screen.</div>}
    {!isConnected && <p className="inline-notice">Connect a wallet to inspect token allowances after router verification.</p>}
    <div className="asset-table">
      {tokens.length ? tokens.map((token) => <AllowanceRow key={token.address} token={token} />)
        : <div className="no-assets">No ERC-20 tokens imported. Add assets in Explore to prepare the allowance interface.</div>}
    </div>
    <p className="approval-warning">Token approvals permit a spender contract to move a specified quantity of your tokens. Only approve a reviewed router and an amount you intend to use. No unlimited approvals are provided.</p>
  </section>;
}
