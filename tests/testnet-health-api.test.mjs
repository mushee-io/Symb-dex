import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("testnet health checks actual chain ID and bytecode, never treats configured sponsor as working claim",async()=>{
 const api=await readFile(new URL("../app/api/testnet/health/route.ts",import.meta.url),"utf8");
 assert.match(api,/getChainId/);
 assert.match(api,/getBlockNumber/);
 assert.match(api,/getBytecode/);
 assert.match(api,/remoteId===4613/);
 assert.match(api,/Last indexed block/);
 assert.match(api,/requires a successful zero-gas claim smoke test/);
});
