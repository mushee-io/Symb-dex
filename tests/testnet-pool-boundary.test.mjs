import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("M11 liquidity routes are isolated from mainnet release gate and never use legacy mainnet forms",async()=>{
 const route=await readFile(new URL("../app/testnet/pools/page.tsx",import.meta.url),"utf8");
 const ui=await readFile(new URL("../components/testnet/testnet-pools.tsx",import.meta.url),"utf8");
 const logic=await readFile(new URL("../lib/testnet/pools.ts",import.meta.url),"utf8");
 assert.match(route,/TestnetPools/);
 assert.doesNotMatch(route,/LiquidityForm|PoolDirectory/);
 assert.match(ui,/simulateContract/);
 assert.match(ui,/waitForTransactionReceipt/);
 assert.match(ui,/removeLiquidityETH/);
 assert.match(ui,/approve/);
 assert.match(logic,/chainId===4613/);
 assert.match(logic,/getPair/);
});
