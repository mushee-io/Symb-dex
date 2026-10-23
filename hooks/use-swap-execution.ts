"use client";

import { useState } from "react";
import { erc20Abi, getAddress, type Address, type Hash } from "viem";
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import deployments from "@/config/deployments.json";
import { very } from "@/lib/very";
import { routerAbi } from "@/lib/swap/abi.mjs";
import { findBestQuote, type MarketClient } from "@/lib/swap/market.mjs";
import { executionGate, buildSwapCall, type SwapDeployment, type SwapDirection } from "@/lib/swap/execution-policy.mjs";
import type { LiddeToken } from "@/hooks/use-token-registry";
import type { DisplayQuote } from "@/hooks/use-swap-quote";

const deployment = deployments as SwapDeployment;
type TransactionPhase = "idle" | "validating" | "awaiting-signature" | "pending" | "confirmed" | "failed";
const samePath = (a: string[], b: string[]) =>
  a.length === b.length && a.every((item, i) => item.toLowerCase() === b[i].toLowerCase());

export function useSwapExecution() {
  const publicClient = usePublicClient({ chainId: very.id });
  const { data: walletClient } = useWalletClient({ chainId: very.id });
  const { address } = useAccount();
  const chainId = useChainId();
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<TransactionPhase>("idle");
  const [hash, setHash] = useState<Hash | null>(null);
  const [error, setError] = useState("");
  const [estimatedGasFee, setEstimatedGasFee] = useState<bigint | null>(null);

  async function execute({
    token, direction, quote, slippageBps, deadlineMinutes,
  }: {
    token: LiddeToken; direction: SwapDirection; quote: DisplayQuote;
    slippageBps: number; deadlineMinutes: number;
  }) {
    if (phase === "validating" || phase === "awaiting-signature" || phase === "pending") return;
    setError(""); setHash(null); setEstimatedGasFee(null); setPhase("validating");
    try {
      const minOut = executionGate({
        deployment, chainId, wallet: address, token, quote, direction, slippageBps,
      });
      if (!publicClient || !walletClient || !address || !deployment.router ||
          !deployment.factory || !deployment.wrappedVery || deployment.feeBps === null) {
        throw new Error("Verified trading contracts and an active VERY wallet are required.");
      }
      if (await publicClient.getChainId() !== very.id || await walletClient.getChainId() !== very.id)
        throw new Error("Wallet and RPC must both be on VERY Mainnet.");

      // Ensure deployed code is present before asking for an approval or signature.
      const router = getAddress(deployment.router);
      const [routerCode, wrappedCode] = await Promise.all([
        publicClient.getBytecode({ address: router }),
        publicClient.getBytecode({ address: getAddress(deployment.wrappedVery) }),
      ]);
      if (!routerCode || routerCode === "0x" || !wrappedCode || wrappedCode === "0x")
        throw new Error("The router or wrapped VERY contract has no deployed bytecode.");

      // Requote immediately before signing; do not silently lower the user's min-received threshold.
      const fresh = await findBestQuote(publicClient as unknown as MarketClient, {
        chainId: very.id, factory: deployment.factory,
        wrappedVery: deployment.wrappedVery,
        tokenIn: quote.path[0], tokenOut: quote.path[quote.path.length - 1],
        input: quote.amountIn, feeBps: deployment.feeBps,
      });
      if (!fresh || !samePath(fresh.path, quote.path) || !samePath(fresh.pairs, quote.pairs) ||
          fresh.amountOut < minOut) {
        throw new Error("The market route or price changed beyond your slippage tolerance. Refresh the quote.");
      }

      // Reject token sales unless wallet balance and exact router allowance are sufficient.
      if (direction === "token-to-very") {
        const tokenAddress = getAddress(token.address);
        const [balance, allowance] = await Promise.all([
          publicClient.readContract({ address: tokenAddress, abi: erc20Abi,
            functionName: "balanceOf", args: [address] }),
          publicClient.readContract({ address: tokenAddress, abi: erc20Abi,
            functionName: "allowance", args: [address, router] }),
        ]);
        if (balance < quote.amountIn) throw new Error("Insufficient token balance.");
        if (allowance < quote.amountIn) throw new Error("Insufficient router allowance. Approve the exact amount in Approvals.");
      }

      const call = buildSwapCall({
        direction, router, account: address, amountIn: quote.amountIn,
        minOut, path: quote.path, nowSeconds: Math.floor(Date.now() / 1000), deadlineMinutes,
      });
      // ABI is imported from a runtime JS package; boundary validation is enforced
      // by the execution gate + pure transaction-shape tests before this cast.
      const request = {
        address: router,
        abi: routerAbi,
        functionName: call.functionName,
        args: call.args,
        value: call.value,
        account: address as Address,
        chain: very,
      };
      // Simulation is mandatory. Estimation failures are blocking, not ignored.
      const simulation = await publicClient.simulateContract(request as any);
      const [estimatedGas, gasPrice, nativeBalance] = await Promise.all([
        publicClient.estimateContractGas(request as any),
        publicClient.getGasPrice(),
        publicClient.getBalance({ address }),
      ]);
      const bufferedFee = estimatedGas * gasPrice * 12n / 10n;
      setEstimatedGasFee(bufferedFee);
      if (nativeBalance < bufferedFee + call.value)
        throw new Error("Insufficient VERY for the swap amount plus estimated network fee.");
      setPhase("awaiting-signature");
      const submittedHash = await walletClient.writeContract(simulation.request as any);
      setHash(submittedHash);
      setPhase("pending");

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: submittedHash, confirmations: 1, timeout: 120_000,
      });
      if (receipt.status !== "success") throw new Error("Swap reverted. Review the receipt on VeryScan.");
      setPhase("confirmed");
      await queryClient.invalidateQueries();
      return submittedHash;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Swap could not be completed.");
      setPhase("failed");
      return null;
    }
  }

  return { phase, hash, error, estimatedGasFee, execute };
}
