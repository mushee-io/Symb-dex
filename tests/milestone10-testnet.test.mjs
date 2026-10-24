import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const root=await readFile(new URL("../MILESTONE-10.md",import.meta.url),"utf8");
const readme=await readFile(new URL("../README.md",import.meta.url),"utf8");
const road=await readFile(new URL("../docs/MILESTONES.md",import.meta.url),"utf8");
const chain=JSON.parse(await readFile(new URL("../config/networks.testnet.template.json",import.meta.url),"utf8"));
const main=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));

test("M10 has 25 stages with seven detailed testable tasks and acceptance each",()=>{
 const headings=[...root.matchAll(/^### (10\.(?:[1-9]|1\d|2[0-5])) — (.+)$/gm)];
 assert.equal(headings.length,25);
 for(let i=0;i<25;i++){
  assert.equal(headings[i][1],`10.${i+1}`);
  const start=headings[i].index+headings[i][0].length;
  const end=i<24?headings[i+1].index:root.indexOf("## First-user testing path",start);
  assert.ok(end>start);
  const sec=root.slice(start,end);
  assert.equal([...sec.matchAll(/^- \[ \] /gm)].length,7,`Seven checks in M10.${i+1}`);
  assert.match(sec,/\*\*Acceptance evidence:\*\*/);
  assert.match(sec,/\*\*Stop condition:\*\*/);
 }
});
test("current root priority is testnet, previous mainnet plans remain deferred",()=>{
 assert.ok(readme.indexOf("## Milestone 10 — CURRENT PRIORITY")<readme.indexOf("## Milestone 9 — DEFERRED"));
 assert.ok(readme.includes("MILESTONE-10.md"));
 assert.ok(road.includes("## M10 — CURRENT: Deep Public Testnet"));
 assert.ok(road.includes("../MILESTONE-10.md"));
});
test("testnet configuration never accidentally targets real VERY Mainnet",()=>{
 assert.equal(chain.status,"not-configured");
 assert.equal(chain.chainId,null);
 assert.equal(chain.rpcUrl,null);
 assert.equal(chain.realFundsAllowed,false);
 assert.equal(chain.officialVeryTestnetVerified,false);
 assert.equal(chain.mainnetChainIdForbidden,4613);
 assert.equal(main.chainId,4613);
 assert.equal(main.status,"not-deployed");
 assert.equal(main.releaseApproved,false);
 for(const name of ["factory","router","wrappedVery"])assert.equal(main[name],null);
});
