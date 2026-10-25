"use client";

import { useQuery } from "@tanstack/react-query";
import { type Address } from "viem";
import { usePublicClient } from "wagmi";
import deployments from "@/config/deployments.json";
import { very } from "@/lib/very";
import { parseAmount } from "@/lib/swap/math.mjs";
import { findBestQuote, type MarketClient, type MarketQuote } from "@/lib/swap/market.mjs";
import type { SymbToken } from "@/hooks/use-token-registry";

type Deployment = {
  chainId: number; factory: string | null; wrappedVery: string | null;
  feeBps: number | null;
};
const deployment: Deployment = deployments;

export type DisplayQuote = MarketQuote & { amountIn: bigint; inputDecimals: number; outputDecimals: number; checkedAt: number; };

export function useSwapQuote(token: SymbToken | null, direction: "very-to-token" | "token-to-very", amount: string) {
  const client = usePublicClient({ chainId: very.id });
  const inputDecimals = direction === "very-to-token" ? 18 : token?.decimals ?? 18;
  const configured = Boolean(
    client && token?.verified && deployment.chainId === very.id &&
    deployment.factory && deployment.wrappedVery && Number.isInteger(deployment.feeBps)
  );
  const result = useQuery<DisplayQuote | null>({
    queryKey: ["symb", "quote", very.id, deployment.factory, deployment.wrappedVery,
      deployment.feeBps, token?.address, token?.verified, direction, amount],
    enabled: configured && Boolean(amount),
    queryFn: async () => {
      if (!client || !token || !token.verified || !deployment.factory ||
          !deployment.wrappedVery || deployment.feeBps === null) return null;
      const input = parseAmount(amount, inputDecimals);
      const quoted = await findBestQuote(client as unknown as MarketClient, {
        chainId: very.id,
        factory: deployment.factory,
        wrappedVery: deployment.wrappedVery,
        tokenIn: direction === "very-to-token" ? deployment.wrappedVery : token.address,
        tokenOut: direction === "very-to-token" ? token.address : deployment.wrappedVery,
        input,
        feeBps: deployment.feeBps,
      });
      return quoted ? {
        ...quoted, amountIn: input, inputDecimals,
        outputDecimals: direction === "very-to-token" ? token.decimals : 18,
        checkedAt: Date.now(),
      } : null;
    },
    staleTime: 7_000,
    refetchInterval: configured ? 12_000 : false,
    retry: 1,
  });
  return { ...result, configured };
}
