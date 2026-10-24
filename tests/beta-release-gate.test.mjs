import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {inspectBetaReadiness,assertMainnetStillLocked,REQUIRED_EXTERNAL_REVIEWS} from "../lib/beta-release-gate.mjs";
const load=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),"utf8"));
const deployment=await load("../config/deployments.json");
const manifest=await load("../docs/DEPLOYMENT-MANIFEST.template.json");
test("development release manifest is blocked and no assets can be approved",()=>{
 const result=inspectBetaReadiness(deployment,manifest);
 assert.equal(result.authorizedForDeployment,false);
 assert.equal(result.authorizedForFunding,false);
 assert.equal(result.authorizedForPublicTrading,false);
 assert.equal(result.status,"BLOCKED_PENDING_INDEPENDENT_EVIDENCE");
 assert.ok(result.findings.some(x=>x.id==="verified-address-format"&&!x.passed));
 assert.ok(result.findings.some(x=>x.id==="reported-external-audit"&&!x.passed));
 assert.equal(assertMainnetStillLocked(deployment),true);
});
test("all syntactic audit flags are still not independent authorization",()=>{
 const forged={...manifest,chainId:4613,
  factory:"0x1111111111111111111111111111111111111111",
  router:"0x2222222222222222222222222222222222222222",
  wrappedVery:"0x3333333333333333333333333333333333333333",
  pairBytecodeHash:"0x"+"ab".repeat(32),
  sourceCommit:"a".repeat(40),
  independentAuditReport:"https://example.org/audit.pdf",
  findingsRetested:true,reviewersApproved:true,verifiedOnVeryScan:true,reproducedBytecode:true};
 const fake={...deployment,status:"deployed",auditReviewed:true,releaseApproved:true};
 const result=inspectBetaReadiness(fake,forged);
 assert.equal(result.authorizedForDeployment,false);
 assert.equal(result.authorizedForPublicTrading,false);
 assert.throws(()=>assertMainnetStillLocked(fake),/STOP/);
});
test("clearing any production configuration block is forbidden in the dev pipeline",()=>{
 for(const patch of [{factory:"0x1111111111111111111111111111111111111111"},{releaseApproved:true},{auditReviewed:true},
  {router:"0x1111111111111111111111111111111111111111"},{wrappedVery:"0x1111111111111111111111111111111111111111"}])
   assert.throws(()=>assertMainnetStillLocked({...deployment,...patch}),/STOP/);
 assert.ok(REQUIRED_EXTERNAL_REVIEWS.length>=8);
});
