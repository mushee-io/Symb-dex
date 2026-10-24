import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("explorer and indexer are testnet-only and never fabricate receipts",async()=>{
 const tx=await readFile(new URL("../app/testnet/explorer/tx/[hash]/page.tsx",import.meta.url),"utf8");
 const api=await readFile(new URL("../app/api/testnet/indexer/route.ts",import.meta.url),"utf8");
 assert.match(tx,/getTransactionReceipt/);
 assert.match(tx,/demoNetwork\.chainId===4613/);
 assert.match(api,/TESTNET_DATABASE_URL/);
 assert.match(api,/indexer-not-provisioned/);
 assert.doesNotMatch(tx,/https:\/\/veryscan\.io/);
});
