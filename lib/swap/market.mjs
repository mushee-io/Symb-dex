import { getAddress, isAddress, zeroAddress } from "viem";
import { factoryAbi, pairAbi } from "./abi.mjs";
import { quoteRoute, validateFee } from "./math.mjs";

const same = (a, b) => a.toLowerCase() === b.toLowerCase();
const nonzero = (address) => isAddress(address) && !same(address, zeroAddress);

export function candidatePaths(tokenIn, tokenOut, wrappedVery) {
  if (![tokenIn, tokenOut, wrappedVery].every(nonzero) || same(tokenIn, tokenOut))
    throw new Error("Swap token addresses are missing or identical.");
  const direct = [getAddress(tokenIn), getAddress(tokenOut)];
  if (same(tokenIn, wrappedVery) || same(tokenOut, wrappedVery)) return [direct];
  return [direct, [getAddress(tokenIn), getAddress(wrappedVery), getAddress(tokenOut)]];
}

export async function fetchPool(client, factory, tokenIn, tokenOut) {
  const pair = await client.readContract({
    address: getAddress(factory), abi: factoryAbi, functionName: "getPair",
    args: [getAddress(tokenIn), getAddress(tokenOut)],
  });
  if (!nonzero(pair)) return null;
  const pairAddress = getAddress(pair);
  const code = await client.getBytecode({ address: pairAddress });
  if (!code || code === "0x") throw new Error("Factory returned a pair without contract code.");
  const [token0, token1, reserves] = await Promise.all([
    client.readContract({ address: pairAddress, abi: pairAbi, functionName: "token0" }),
    client.readContract({ address: pairAddress, abi: pairAbi, functionName: "token1" }),
    client.readContract({ address: pairAddress, abi: pairAbi, functionName: "getReserves" }),
  ]);
  if (!nonzero(token0) || !nonzero(token1) || !Array.isArray(reserves) || reserves.length < 2) {
    throw new Error("Liquidity pool returned invalid data.");
  }
  if (!(same(token0, tokenIn) && same(token1, tokenOut)) &&
      !(same(token0, tokenOut) && same(token1, tokenIn)))
    throw new Error("Factory pair returned mismatched tokens.");
  const reversed = same(token0, tokenOut);
  const reserveIn = BigInt(reversed ? reserves[1] : reserves[0]);
  const reserveOut = BigInt(reversed ? reserves[0] : reserves[1]);
  if (reserveIn <= 0n || reserveOut <= 0n) return null;
  return { pair: pairAddress, reserveIn, reserveOut };
}

export async function findBestQuote(client, opts) {
  const { chainId, factory, wrappedVery, tokenIn, tokenOut, input, feeBps } = opts;
  if (chainId !== 4613 || !client || !nonzero(factory) || !nonzero(wrappedVery))
    throw new Error("Verified factory and wrapped VERY must be configured for VERY Mainnet.");
  validateFee(feeBps);
  if (typeof input !== "bigint" || input <= 0n) throw new Error("Invalid trade amount.");
  if (await client.getChainId() !== 4613) throw new Error("Connected RPC returned the wrong chain.");
  const factoryCode = await client.getBytecode({ address: getAddress(factory) });
  if (!factoryCode || factoryCode === "0x") throw new Error("Factory bytecode missing on VERY Mainnet.");
  const paths = candidatePaths(tokenIn, tokenOut, wrappedVery);
  const found = [];
  for (const path of paths) {
    const hops = [];
    let viable = true;
    for (let index = 0; index < path.length - 1; index++) {
      const pool = await fetchPool(client, factory, path[index], path[index + 1]);
      if (!pool) { viable = false; break; }
      hops.push(pool);
    }
    if (!viable) continue;
    try {
      const quoted = quoteRoute(input, hops, feeBps);
      found.push({ path, pairs: hops.map((h) => h.pair),
        amountOut: quoted.amountOut, priceImpactBps: quoted.priceImpactBps });
    } catch (err) {
      // Skip a route whose reserves cannot support the requested amount.
      if (err instanceof Error && /liquidity|output/i.test(err.message)) continue;
      throw err;
    }
  }
  found.sort((a, b) => a.amountOut === b.amountOut ? a.path.length - b.path.length : a.amountOut > b.amountOut ? -1 : 1);
  return found[0] ?? null;
}
