import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const root=await readFile(new URL("../MILESTONE-09.md",import.meta.url),"utf8");
const readme=await readFile(new URL("../README.md",import.meta.url),"utf8");
const milestones=await readFile(new URL("../docs/MILESTONES.md",import.meta.url),"utf8");
const runbook=await readFile(new URL("../docs/MILESTONE-09-EXECUTION.md",import.meta.url),"utf8");
const deployment=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));

test("M09 has 20 distinct stages with exactly seven tasks and acceptance evidence each",()=>{
  const headings=[...root.matchAll(/^### (9\.(?:[1-9]|1\d|20)) — (.+)$/gm)];
  assert.equal(headings.length,20,"20 complete major launch workstreams required");
  for(let i=0;i<20;i++){
    assert.equal(headings[i][1],`9.${i+1}`);
    const begin=headings[i].index+headings[i][0].length;
    const end=i<19?headings[i+1].index:root.indexOf("## Cross-functional public launch gating",begin);
    assert.ok(end>begin);
    const section=root.slice(begin,end);
    assert.equal([...section.matchAll(/^- \[ \] /gm)].length,7,`Seven actionable items in M09.${i+1}`);
    assert.match(section,/\*\*Owner:\*\*/);
    assert.match(section,/\*\*Acceptance evidence:\*\*/);
    assert.match(section,/\*\*Stop \/ release blocker:\*\*/);
  }
});

test("root README and roadmap retain M09 as deferred while public testnet M10 is current priority",()=>{
  assert.ok(readme.includes("## Milestone 10 — CURRENT PRIORITY"));
  assert.ok(readme.includes("## Milestone 9 — DEFERRED real-value public launch"));
  assert.ok(readme.includes("## Milestone 8 — DEFERRED mainnet beta planning"));
  assert.ok(readme.indexOf("## Milestone 10 — CURRENT PRIORITY")<readme.indexOf("## Milestone 9 — DEFERRED"));
  assert.ok(readme.includes("](MILESTONE-09.md)"));
  assert.ok(readme.includes("](MILESTONE-10.md)"));
  assert.ok(milestones.includes("../MILESTONE-09.md"));
  assert.ok(milestones.includes("../MILESTONE-10.md"));
  assert.ok(runbook.includes("../MILESTONE-09.md"));
});

test("public launch documentation cannot bypass unfinished security, token and funding gates",()=>{
  for(const id of ["issues/9","issues/10","issues/11"])assert.ok(root.includes(id));
  for(const token of ["financial promotions","independent","on-chain","withdraw","NO-GO"])assert.ok(root.toLowerCase().includes(token.toLowerCase()));
  assert.equal(deployment.status,"not-deployed");
  assert.equal(deployment.auditReviewed,false);
  assert.equal(deployment.releaseApproved,false);
  assert.equal(deployment.factory,null);
  assert.equal(deployment.router,null);
  assert.equal(deployment.wrappedVery,null);
});
