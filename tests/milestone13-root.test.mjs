import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const document=await readFile(new URL("../MILESTONE-13.md",import.meta.url),"utf8");
const readme=await readFile(new URL("../README.md",import.meta.url),"utf8");
const road=await readFile(new URL("../docs/MILESTONES.md",import.meta.url),"utf8");
const demo=JSON.parse(await readFile(new URL("../config/deployments.testnet.json",import.meta.url),"utf8"));
const real=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));

test("M13 has exactly 25 ordered deep integration stages with seven checkable tasks",()=>{
 const headings=[...document.matchAll(/^### (13\.(?:[1-9]|1\d|2[0-5])) — /gm)];
 assert.equal(headings.length,25);
 for(let i=0;i<25;i++){
  assert.equal(headings[i][1],"13."+(i+1));
  const begin=headings[i].index+headings[i][0].length;
  const end=i===24?document.indexOf("## Build order and go/no-go decisions",begin):headings[i+1].index;
  assert.ok(end>begin);
  const section=document.slice(begin,end);
  assert.equal([...section.matchAll(/^- \[ \] /gm)].length,7,"M13."+(i+1)+" must include 7 tasks");
  for(const anchor of ["**Priority:**","**Responsible workstream:**","**Current readiness:**","**Acceptance evidence:**","**Stop condition:**"])
   assert.ok(section.includes(anchor),"M13."+(i+1)+" lacks "+anchor);
 }
});
test("root links M13 but preserves M11 as actual current delivery priority",()=>{
 assert.ok(readme.includes("](MILESTONE-13.md)"));
 assert.ok(road.includes("../MILESTONE-13.md"));
 assert.ok(readme.includes("Active work remains M11"));
 assert.ok(document.includes("PLANNED, NOT BUILT"));
 assert.ok(document.includes("TESTNET ONLY"));
});
test("documentation never enables testnet or real-money contracts",()=>{
 assert.equal(demo.status,"not-configured");
 assert.equal(demo.realFundsAllowed,false);
 assert.equal(demo.chainId,null);
 assert.equal(real.status,"not-deployed");
 assert.equal(real.releaseApproved,false);
 assert.equal(real.chainId,4613);
});
