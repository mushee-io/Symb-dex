import test from "node:test";
import assert from "node:assert/strict";
import { allowedRouter, canApprove } from "../lib/approval-policy.mjs";
import { readFile } from "node:fs/promises";

const deployment = JSON.parse(await readFile(new URL("../config/deployments.json", import.meta.url), "utf8"));
const wallet = "0x1111111111111111111111111111111111111111";
const token = "0x2222222222222222222222222222222222222222";
const ready = {
  chainId: 4613, status: "production", releaseApproved: true, auditReviewed: true,
  factory: "0x3333333333333333333333333333333333333333",
  router: "0x4444444444444444444444444444444444444444",
  wrappedVery: "0x5555555555555555555555555555555555555555"
};

test("no router is trusted in milestone 3", () => {
  assert.equal(allowedRouter(deployment), null);
  assert.equal(canApprove({deployment, connectedAddress: wallet, tokenAddress: token, connectedChainId: 4613}), false);
});

test("valid deployment alone does not allow approvals on wrong chain", () => {
  assert.equal(canApprove({deployment: ready, connectedAddress: wallet, tokenAddress: token, connectedChainId: 1}), false);
});

test("approvals always require an account, token and reviewed router", () => {
  assert.equal(canApprove({deployment: ready, connectedAddress: wallet, tokenAddress: token, connectedChainId: 4613}), true);
  assert.equal(canApprove({deployment: ready, connectedAddress: undefined, tokenAddress: token, connectedChainId: 4613}), false);
  assert.equal(canApprove({deployment: ready, connectedAddress: wallet, tokenAddress: "notAnAddress", connectedChainId: 4613}), false);
  assert.equal(canApprove({deployment: {...ready, auditReviewed: false}, connectedAddress: wallet, tokenAddress: token, connectedChainId: 4613}), false);
});
