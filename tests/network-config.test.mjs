import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const config = JSON.parse(await readFile(new URL("../config/very-mainnet.json", import.meta.url), "utf8"));

test("VERY network is the documented mainnet", () => {
  assert.equal(config.chainId, 4613);
  assert.equal(config.chainIdHex, "0x1205");
  assert.equal(config.currency.symbol, "VERY");
  assert.equal(config.currency.decimals, 18);
  assert.equal(config.rpcUrl, "https://rpc.verylabs.io");
  assert.equal(config.blockExplorer, "https://veryscan.io");
});

test("RPC and explorer use HTTPS", () => {
  assert.equal(new URL(config.rpcUrl).protocol, "https:");
  assert.equal(new URL(config.blockExplorer).protocol, "https:");
});
