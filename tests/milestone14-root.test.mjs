import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const m14=await readFile(new URL("../MILESTONE-14.md",import.meta.url),"utf8");
const readme=await readFile(new URL("../README.md",import.meta.url),"utf8");
const roadmap=await readFile(new URL("../docs/MILESTONES.md",import.meta.url),"utf8");
const demo=JSON.parse(await readFile(new URL("../config/deployments.testnet.json",import.meta.url),"utf8"));
const real=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));

test("M14 has 30 ordered stages, eight implementation tasks per stage, 240 total",()=>{
 const titles=[...m14.matchAll(/^### (14\.(?:[1-9]|[12][0-9]|30)) — /gm)];
 assert.equal(titles.length,30);
 for(let i=0;i<30;i++){
  assert.equal(titles[i][1],`14.${i+1}`);
  const start=titles[i].index+titles[i][0].length;
  const end=i===29?m14.indexOf("## Required architecture and integration graph",start):titles[i+1].index;
  assert.ok(end>start);
  const section=m14.slice(start,end);
  assert.equal([...section.matchAll(/^- \[ \] /gm)].length,8,`Stage 14.${i+1} must have eight technical tasks`);
  for(const field of ["**Priority:**","**Owner:**","**Current readiness:**","**Acceptance evidence:**","**Blocker / stop condition:**"])
   assert.ok(section.includes(field),`Stage 14.${i+1} missing ${field}`);
 }
});
test("root and milestone tracker link M14 but M11 remains operational blocker",()=>{
 assert.ok(readme.includes("](MILESTONE-14.md)"));
 assert.ok(roadmap.includes("../MILESTONE-14.md"));
 assert.match(m14,/PLANNED, NOT BUILT/);
 assert.match(m14,/ZERO REAL FUNDS/);
 assert.match(readme,/persistent public testnet/);
 assert.match(m14,/chain ID 4613/);
});
test("testnet and mainnet remain deliberately unconfigured during roadmap planning",()=>{
 assert.equal(demo.status,"not-configured");
 assert.equal(demo.chainId,null);
 assert.equal(demo.realFundsAllowed,false);
 assert.equal(real.chainId,4613);
 assert.equal(real.status,"not-deployed");
 assert.equal(real.releaseApproved,false);
});
