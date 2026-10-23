import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { isTradingEnabled } from "../lib/release-gate.mjs";

const deployments = JSON.parse(await readFile(new URL("../config/deployments.json", import.meta.url), "utf8"));
const address = "0x1111111111111111111111111111111111111111";
const ready = {
  chainId: 4613,
  status: "production",
  releaseApproved: true,
  auditReviewed: true,
  factory: address,
  router: address,
  wrappedVery: address
};

test("new deployments are disabled by default", () => {
  assert.equal(isTradingEnabled(deployments), false);
});

test("missing approval or audit prevents trading", () => {
  assert.equal(isTradingEnabled({ ...ready, releaseApproved: false }), false);
  assert.equal(isTradingEnabled({ ...ready, auditReviewed: false }), false);
});

test("wrong chain or missing contracts prevents trading", () => {
  assert.equal(isTradingEnabled({ ...ready, chainId: 1 }), false);
  assert.equal(isTradingEnabled({ ...ready, router: null }), false);
  assert.equal(isTradingEnabled({ ...ready, wrappedVery: "0x0000000000000000000000000000000000000000" }), false);
});

test("only explicit, complete release configuration can open UI gate", () => {
  assert.equal(isTradingEnabled(ready), true);
});
