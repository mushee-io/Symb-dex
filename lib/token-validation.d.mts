import type { Address } from "viem";
export interface SymbImportedToken {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  verified: false;
}
export const TOKEN_LIMIT: number;
export const STORAGE_KEY: string;
export function normalizeTokenMetadata(address: string, name: unknown, symbol: unknown, decimals: unknown): SymbImportedToken;
export function sanitizeImportedTokens(value: unknown): SymbImportedToken[];
export function isExplicitlyVerified(address: string, verifiedTokens: readonly {address: string; reviewed: boolean}[]): boolean;
