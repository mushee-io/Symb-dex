import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const schema=await readFile(new URL("../db/migrations/006a_006b_indexing.sql",import.meta.url),"utf8");
test("v6 creates durable raw and normalized records and checkpoint",()=>{
 for(const table of ["m06_blocks","m06_pairs","m06_events","m06_swaps","m06_liquidity_actions","m06_syncs","m06_lp_transfers","m06_cursors","m06_reconciliation_checks"])
  assert.match(schema,new RegExp("CREATE TABLE IF NOT EXISTS "+table+"\\b"));
 assert.match(schema,/ON DELETE CASCADE/);
 assert.match(schema,/m06_assert_cursor/);
});
test("atomic worker store uses transaction lock and cursor lease",async()=>{
 const store=await readFile(new URL("../services/indexer/store.mjs",import.meta.url),"utf8");
 assert.match(store,/pg_advisory_xact_lock/);
 assert.match(store,/m06_assert_cursor/);
 assert.match(store,/sql\.transaction\(ops\)/);
 assert.match(store,/DELETE FROM m06_blocks/);
});
