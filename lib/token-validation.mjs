import { getAddress, isAddress } from "viem";

export const TOKEN_LIMIT = 30;
export const STORAGE_KEY = "lidde:very:imported-tokens:v1";

export function normalizeTokenMetadata(address, name, symbol, decimals) {
  if (!isAddress(address)) throw new Error("Enter a valid checksummed or lowercase ERC-20 address.");
  if (typeof name !== "string" || !name.trim() || name.length > 80)
    throw new Error("The token returned an invalid name.");
  if (typeof symbol !== "string" || !symbol.trim() || symbol.length > 24)
    throw new Error("The token returned an invalid symbol.");
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36)
    throw new Error("Token decimals must be between 0 and 36.");
  return {
    address: getAddress(address),
    name: name.trim(),
    symbol: symbol.trim(),
    decimals,
    // Imported metadata and localStorage NEVER grant verification.
    verified: false,
  };
}

export function sanitizeImportedTokens(value) {
  if (!Array.isArray(value)) return [];
  const used = new Set();
  const tokens = [];
  for (const item of value) {
    if (tokens.length >= TOKEN_LIMIT) break;
    try {
      if (!item || typeof item !== "object") continue;
      const token = normalizeTokenMetadata(item.address, item.name, item.symbol, item.decimals);
      const id = token.address.toLowerCase();
      if (used.has(id)) continue;
      used.add(id);
      tokens.push(token);
    } catch {
      // Ignore malformed, stale or poisoned browser storage.
    }
  }
  return tokens;
}

export function isExplicitlyVerified(address, verifiedTokens) {
  if (!isAddress(address) || !Array.isArray(verifiedTokens)) return false;
  return verifiedTokens.some((token) => token && isAddress(token.address) &&
    getAddress(token.address) === getAddress(address) && token.reviewed === true);
}
