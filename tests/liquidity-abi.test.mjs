import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("pair, liquidity router and factory ABIs are tracked by source",async()=>{
  const code=await readFile(new URL("../lib/liquidity/abi.ts",import.meta.url),"utf8");
  for (const fn of ["getPair","allPairsLength","allPairs","getReserves","totalSupply","balanceOf",
    "addLiquidity","addLiquidityETH","removeLiquidity","removeLiquidityETH"])
    assert.ok(code.includes(fn),fn);
});
test("pool explorer never invents or hardcodes address",async()=>{
  const data=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));
  assert.equal(data.factory,null);assert.equal(data.router,null);assert.equal(data.releaseApproved,false);
});
