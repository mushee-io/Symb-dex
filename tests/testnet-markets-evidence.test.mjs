import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("read-only market data is sourced from canonical Neon and never invents USD value",async()=>{
 const api=await readFile(new URL("../app/api/testnet/markets/route.ts",import.meta.url),"utf8");
 const ui=await readFile(new URL("../components/testnet/demo-markets.tsx",import.meta.url),"utf8");
 for(const s of ["TESTNET_DATABASE_URL","m06_cursors","m06_events","m06_swaps","m06_pairs","m06_syncs"])
  assert.ok(api.includes(s));
 assert.match(api,/usdVolume:null,usdTvl:null/);
 assert.match(api,/includesTestBots:true/);
 assert.match(api,/demoNetwork.chainId===4613/);
 assert.match(ui,/No transactions or trading volume are being invented/);
});
