import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const root=await readFile(new URL("../MILESTONE-11.md",import.meta.url),"utf8");
const readme=await readFile(new URL("../README.md",import.meta.url),"utf8");
const roadmap=await readFile(new URL("../docs/MILESTONES.md",import.meta.url),"utf8");
const mainnet=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));
const testnet=JSON.parse(await readFile(new URL("../config/networks.testnet.json",import.meta.url),"utf8"));
test("M11 contains 25 ordered stages and exactly five actionable checkboxes each",()=>{
 const stages=[...root.matchAll(/^### (11\.(?:[1-9]|1\d|2[0-5])) — /gm)];
 assert.equal(stages.length,25);
 for(let i=0;i<25;i++){
  assert.equal(stages[i][1],"11."+(i+1));
  const start=stages[i].index+stages[i][0].length;
  const end=i+1<25?stages[i+1].index:root.indexOf("## Milestone 11 mandatory P0 acceptance",start);
  assert.ok(end>start);
  const section=root.slice(start,end);
  assert.equal([...section.matchAll(/^- \[ \] /gm)].length,5);
  assert.match(section,/Acceptance evidence:/);
 }
});
test("root and roadmap link to forward milestone without claiming it is live",()=>{
 assert.ok(readme.includes("](MILESTONE-11.md)"));
 assert.ok(roadmap.includes("../MILESTONE-11.md"));
 assert.ok(root.includes("NO REAL FUNDS") && root.includes("not completed functionality"));
});
test("mainnet and testnet still fail closed during documentation changes",()=>{
 assert.equal(mainnet.chainId,4613);
 assert.equal(mainnet.releaseApproved,false);
 assert.equal(mainnet.status,"not-deployed");
 assert.equal(testnet.chainId,null);
 assert.equal(testnet.status,"not-configured");
});
