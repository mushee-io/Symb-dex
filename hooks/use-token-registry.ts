"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { erc20Abi, getAddress, isAddress, type Address } from "viem";
import { usePublicClient } from "wagmi";
import { very } from "@/lib/very";
import verifiedList from "@/config/verified-tokens.json";
import {
  TOKEN_LIMIT, STORAGE_KEY, normalizeTokenMetadata, sanitizeImportedTokens, isExplicitlyVerified,
} from "@/lib/token-validation.mjs";

export type LiddeToken = {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  verified: boolean;
};

function readSaved(): LiddeToken[] {
  if (typeof window === "undefined") return [];
  try {
    return sanitizeImportedTokens(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")) as LiddeToken[];
  } catch {
    return [];
  }
}

function writeSaved(tokens: LiddeToken[]) {
  // Fail safely if storage is disabled/quota exhausted: never claim persistence.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  window.dispatchEvent(new Event("lidde:tokens-changed"));
}

export function useTokenRegistry() {
  const [imported, setImported] = useState<LiddeToken[]>([]);
  const client = usePublicClient({ chainId: very.id });
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    const refresh = () => setImported(readSaved());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("lidde:tokens-changed", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("lidde:tokens-changed", refresh);
    };
  }, []);

  const trusted = useMemo<LiddeToken[]>(() => {
    if (verifiedList.chainId !== very.id) return [];
    // Importing a token never adds it to this independently reviewed registry.
    return verifiedList.tokens.filter((t) => isExplicitlyVerified(t.address, verifiedList.tokens))
      .map((t) => ({ address: getAddress(t.address), name: t.name, symbol: t.symbol, decimals: t.decimals, verified: true }));
  }, []);
  const tokens = useMemo(() => [...trusted, ...imported.filter((token) =>
    !trusted.some((verified) => verified.address.toLowerCase() === token.address.toLowerCase()))],
    [trusted, imported]);

  const importToken = useCallback(async (rawAddress: string) => {
    if (!client) throw new Error("VERY RPC is unavailable.");
    if (!isAddress(rawAddress)) throw new Error("Enter a valid ERC-20 contract address.");
    const address = getAddress(rawAddress);
    if (tokens.some((token) => token.address === address))
      throw new Error("That token is already in your list.");
    if (imported.length >= TOKEN_LIMIT) throw new Error("Token import limit reached (30).");
    setImporting(true);
    try {
      const code = await client.getBytecode({ address });
      if (!code || code === "0x") throw new Error("No smart contract exists at this address on VERY Mainnet.");
      const [name, symbol, decimals] = await Promise.all([
        client.readContract({ address, abi: erc20Abi, functionName: "name" }),
        client.readContract({ address, abi: erc20Abi, functionName: "symbol" }),
        client.readContract({ address, abi: erc20Abi, functionName: "decimals" }),
      ]);
      const token = normalizeTokenMetadata(address, name, symbol, decimals) as LiddeToken;
      const latest = readSaved();
      if (latest.some((saved) => saved.address === token.address)) throw new Error("Already imported in another tab.");
      if (latest.length >= TOKEN_LIMIT) throw new Error("Token list is full.");
      writeSaved([...latest, token]);
      return token;
    } finally {
      setImporting(false);
    }
  }, [client, tokens, imported.length]);

  const removeToken = useCallback((address: Address) => {
    if (trusted.some((token) => token.address === address)) return;
    writeSaved(readSaved().filter((token) => token.address !== address));
  }, [trusted]);

  return { tokens, imported, trusted, importing, importToken, removeToken };
}
