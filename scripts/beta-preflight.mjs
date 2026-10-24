// Read-only release planning report. No private keys, RPC writes, deployment or wallet interaction.
import {readFile} from "node:fs/promises";
import {inspectBetaReadiness,assertMainnetStillLocked} from "../lib/beta-release-gate.mjs";
const deployment=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));
const manifest=JSON.parse(await readFile(new URL("../docs/DEPLOYMENT-MANIFEST.template.json",import.meta.url),"utf8"));
const result=inspectBetaReadiness(deployment,manifest);
if(process.argv.includes("--assert-closed")) {
  assertMainnetStillLocked(deployment);
  if(result.authorizedForDeployment!==false || result.authorizedForFunding!==false ||
     result.authorizedForPublicTrading!==false)
    throw new Error("Beta preflight is not allowed to grant launch privileges.");
  console.log("Pre-beta development gate correctly remains CLOSED (not a security audit).");
} else {
  console.log(JSON.stringify(result,null,2));
  console.log("Cannot be used as an audit certificate, deployment authorization or runtime approval.");
}
