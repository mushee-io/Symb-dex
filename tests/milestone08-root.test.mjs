import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const root = await readFile(new URL("../MILESTONE-08.md", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
const release = JSON.parse(await readFile(new URL("../config/deployments.json", import.meta.url), "utf8"));

test("root M08 includes exactly 18 stages with 5 individually checkable engineering tasks", () => {
  const sections = [...root.matchAll(/^### (8\.(?:[1-9]|1[0-8])) — (.+)$/gm)];
  assert.equal(sections.length, 18);
  for (let i = 0; i < 18; i++) {
    assert.equal(sections[i][1], "8." + (i+1));
    const start = sections[i].index + sections[i][0].length;
    const end = i === 17 ? root.indexOf("## Production exit criteria", start) : sections[i+1].index;
    assert.ok(end > start, "M08 section has a known endpoint");
    const items = [...root.slice(start, end).matchAll(/^- \[ \] /gm)];
    assert.equal(items.length, 5, "M08."+ (i+1)+" must list 5 checkable engineering tasks");
    assert.match(root.slice(start,end), /Acceptance evidence:/);
    assert.match(root.slice(start,end), /Release stop condition:/);
  }
});

test("README highlights the root milestone in front of older milestones", () => {
  assert.ok(readme.indexOf("## MILESTONE 8 — CURRENT PRIORITY") < readme.indexOf("## Milestone 1: Foundation"));
  assert.ok(readme.includes("](MILESTONE-08.md)"));
  for(let i=1;i<=18;i++)assert.ok(readme.includes("| **8."+i+"** |"));
});

test("all actual external release blockers stay explicitly open and config stays locked", () => {
  for (const link of ["issues/9","issues/10","issues/11"]) assert.ok(root.includes(link));
  for (const id of ["factory","router","wrappedVery","feeBps"])assert.equal(release[id],null);
  assert.equal(release.auditReviewed,false);
  assert.equal(release.releaseApproved,false);
  assert.equal(release.status,"not-deployed");
});
