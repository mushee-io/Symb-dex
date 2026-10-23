import { readFile } from "node:fs/promises";

const config = JSON.parse(await readFile(new URL("../config/very-mainnet.json", import.meta.url), "utf8"));

async function call(method) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(config.rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: [] }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("RPC HTTP " + response.status);
    const data = await response.json();
    if (data.error || typeof data.result !== "string") {
      throw new Error("Invalid RPC response: " + JSON.stringify(data.error ?? data));
    }
    return data.result;
  } finally {
    clearTimeout(timeout);
  }
}

try {
  const chainId = await call("eth_chainId");
  if (BigInt(chainId) !== BigInt(config.chainId)) {
    throw new Error("Chain ID mismatch: expected " + config.chainIdHex + ", received " + chainId);
  }
  const blockHex = await call("eth_blockNumber");
  console.log("VERY RPC validated | chain " + chainId + " | latest block " + BigInt(blockHex));
  console.log("Read-only verification complete. No transaction was sent.");
} catch (error) {
  console.error("VERY RPC check failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
