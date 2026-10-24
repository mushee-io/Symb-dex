import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const m12=await readFile(new URL("../MILESTONE-12.md",import.meta.url),"utf8");
const readme=await readFile(new URL("../README.md",import.meta.url),"utf8");
const roadmap=await readFile(new URL("../docs/MILESTONES.md",import.meta.url),"utf8");
const prod=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));
const testnet=JSON.parse(await readFile(new URL("../config/networks.testnet.json",import.meta.url),"utf8"));
test("M12 is a 25-stage 125-task engineering plan with evidence for each",()=>{
 const starts=[...m12.matchAll(/^### (12\.(?:[1-9]|1\d|2[0-5])) — /gm)];
 assert.equal(starts.length,25);
 for(let n=0;n<25;n++){
  assert.equal(starts[n][1],"12."+(n+1));
  const section=m12.slice(starts[n].index,starts[n+1]?.index??m12.indexOf("## Environments",starts[n].index));
  assert.equal([...section.matchAll(/^- \[ \] /gm)].length,5);
  assert.match(section,/Acceptance evidence:/);
 }
});
test("M12 is linked from root and roadmap without falsely claiming deployment",()=>{
 assert.match(readme,/\]\(MILESTONE-12\.md\)/);
 assert.match(roadmap,/\.\.\/MILESTONE-12\.md/);
 assert.match(m12,/PLANNED, NOT BUILT/);
});
test("M12 roadmap never enables mainnet or invents hosted testnet",()=>{
 assert.equal(prod.chainId,4613);
 assert.equal(prod.releaseApproved,false);
 assert.equal(testnet.chainId,null);
 assert.equal(testnet.status,"not-configured");
});
