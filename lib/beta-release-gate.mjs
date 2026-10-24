/**
 * Lidde Milestone 8 informational gate.
 * It intentionally cannot authorize, deploy or activate trading.
 * An attached report / JSON boolean is NOT independent audit authentication.
 */
const ETH = /^0x[0-9a-fA-F]{40}$/;
const HASH = /^0x[0-9a-fA-F]{64}$/;
const nonzero = value => typeof value === "string" && ETH.test(value) && !/^0x0{40}$/i.test(value);
export const REQUIRED_EXTERNAL_REVIEWS = Object.freeze([
  "Signed independent audit of final source and retest by auditor",
  "Confirmed official native wrapper provenance and audited redemption",
  "Manual bytecode provenance verification against source and approved deployments",
  "Reviewed initial ERC-20 tokens and token behavior restrictions",
  "Approved treasury cap, signer identities and documented governance",
  "VERY fork execution and approved mainnet rehearsal receipts",
  "Operational indexer, reserve reconciliation and incident-response drill",
  "Owner and independent security approver authorize any public release"
]);
export function inspectBetaReadiness(deployment,manifest) {
  const findings=[];
  const record=(id,ok,blocker)=>findings.push({id,passed:ok,detail:ok?"Structurally present (NOT independent proof)":blocker});
  record("chain-id",deployment?.chainId===4613 && manifest?.chainId===4613,"VERY chain ID must be 4613.");
  record("mainnet-off-by-default",deployment?.status==="not-deployed" && deployment?.releaseApproved===false && deployment?.auditReviewed===false,
    "Mainnet frontend release config unexpectedly enabled; investigate immediately.");
  record("verified-address-format",nonzero(manifest?.factory) && nonzero(manifest?.router) && nonzero(manifest?.wrappedVery),
    "No verified factory/router/canonical WVERY addresses in release manifest.");
  record("verified-bytecode-hash",typeof manifest?.pairBytecodeHash==="string" && HASH.test(manifest?.pairBytecodeHash),
    "No verified pair bytecode hash.");
  record("compiler-and-license",manifest?.license==="MIT" && manifest?.compiler==="0.8.26" &&
    manifest?.optimizerRuns===200 && manifest?.evmVersion==="paris" && manifest?.viaIR===true,
    "Manifest compiler, optimizer, EVM target and MIT license must match frozen source.");
  record("source-commit",typeof manifest?.sourceCommit==="string" && /^[a-f0-9]{40}$/i.test(manifest.sourceCommit),
    "Missing full frozen source commit.");
  record("reported-external-audit",typeof manifest?.independentAuditReport==="string" &&
    /^https:\/\//.test(manifest.independentAuditReport),"No auditor-issued report URL. User-supplied URL is not proof.");
  record("auditor-review-claimed",manifest?.findingsRetested===true && manifest?.reviewersApproved===true,
    "Auditor retest and independent reviewer signoff have not been attested.");
  record("production-source-verification-claimed",manifest?.verifiedOnVeryScan===true && manifest?.reproducedBytecode===true,
    "Production explorer source and reproducible bytecode not both confirmed.");
  // Crucially, even syntactically complete, plausible attestations cannot prove outside reviewer independence.
  return {
    status:"BLOCKED_PENDING_INDEPENDENT_EVIDENCE",
    authorizedForDeployment:false,
    authorizedForFunding:false,
    authorizedForPublicTrading:false,
    gateIsInformationalOnly:true,
    passedStructuralChecks:findings.filter(x=>x.passed).length,
    totalStructuralChecks:findings.length,
    findings,
    requiredExternalReviews:[...REQUIRED_EXTERNAL_REVIEWS],
  };
}
export function assertMainnetStillLocked(deployment) {
  if(!deployment || deployment.chainId!==4613 || deployment.status!=="not-deployed" ||
      deployment.releaseApproved!==false || deployment.auditReviewed!==false ||
      deployment.factory!==null || deployment.router!==null || deployment.wrappedVery!==null ||
      deployment.feeBps!==null)
    throw new Error("Unexpected production deployment configuration: STOP release and investigate.");
  return true;
}
