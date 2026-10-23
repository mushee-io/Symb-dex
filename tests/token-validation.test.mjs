import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  normalizeTokenMetadata, sanitizeImportedTokens, isExplicitlyVerified, STORAGE_KEY, TOKEN_LIMIT
} from "../lib/token-validation.mjs";

const address = "0x1111111111111111111111111111111111111111";
const other = "0x2222222222222222222222222222222222222222";

test("token imports normalize expected metadata and never grant trust", () => {
  const result = normalizeTokenMetadata(address, "  Test  ", "  TST ", 6);
  assert.equal(result.name, "Test");
  assert.equal(result.symbol, "TST");
  assert.equal(result.verified, false);
});

test("invalid addresses and token metadata are rejected", () => {
  assert.throws(() => normalizeTokenMetadata("0x123", "Test", "T", 18));
  assert.throws(() => normalizeTokenMetadata(address, "Test", "T", 255));
  assert.throws(() => normalizeTokenMetadata(address, "", "T", 18));
  assert.throws(() => normalizeTokenMetadata(address, "Test", "", 18));
});

test("poisoned stored verified flag cannot become trusted", () => {
  const items = sanitizeImportedTokens([
    { address, name: "Misleading", symbol: "FAKE", decimals: 18, verified: true },
    { address, name: "Duplicate", symbol: "DUP", decimals: 18 },
    { address: "bad", name: "Bad", symbol: "BAD", decimals: 18 },
  ]);
  assert.equal(items.length, 1);
  assert.equal(items[0].verified, false);
});

test("verified registry must include an explicit review flag and matching address", () => {
  assert.equal(isExplicitlyVerified(address, [{address, reviewed: true}]), true);
  assert.equal(isExplicitlyVerified(address, [{address, reviewed: false}]), false);
  assert.equal(isExplicitlyVerified(address, [{address: other, reviewed: true}]), false);
});

test("actual launch list is empty until addresses have been reviewed", async () => {
  const list = JSON.parse(await readFile(new URL("../config/verified-tokens.json", import.meta.url), "utf8"));
  assert.equal(list.chainId, 4613);
  assert.deepEqual(list.tokens, []);
  assert.ok(TOKEN_LIMIT <= 30);
  assert.match(STORAGE_KEY, /very/);
});
