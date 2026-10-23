import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
test("liquidity UI keeps transactions behind deployment review",async()=>{
  const form=await readFile(new URL("../components/liquidity/liquidity-form.tsx",import.meta.url),"utf8");
  const hook=await readFile(new URL("../hooks/use-liquidity-execution.ts",import.meta.url),"utf8");
  assert.match(form,/isTradingEnabled/);
  assert.match(hook,/assertLiquidityWrite/);
  assert.match(hook,/simulateContract/);
  assert.match(hook,/waitForTransactionReceipt/);
  assert.match(hook,/router.*factory/i);
});
