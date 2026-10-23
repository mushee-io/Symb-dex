import type { Address } from "viem";
export interface LiddeImportedToken {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  verified: false;
}
export const TOKEN_LIMIT: number;
export const STORAGE_KEY: string;
export function normalizeTokenMetadata(address: string, name: unknown, symbol: unknown, decimals: unknown): LiddeImportedToken;
export function sanitizeImportedTokens(value: unknown): LiddeImportedToken[];
export function isExplicitlyVerified(address: string, verifiedTokens: readonly {address: string; reviewed: boolean}[]): boolean;
