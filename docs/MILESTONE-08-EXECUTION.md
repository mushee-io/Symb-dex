# Symb Milestone 08 — Deep Integration / Mainnet Beta Execution Plan

> **Root highlighted checklist:** [MILESTONE-08.md](../MILESTONE-08.md) lists all 18 stages and 90 checkable technical substeps. Start there for progress status, then use this runbook for implementation details.

**Reviewed:** 24 Oct 2026 · **Network:** VERY chain 4613 · **License:** MIT · **Mainnet launch:** BLOCKED
**Primary repository:** https://github.com/mushee-io/lidde-dex

This document supplements [the 18-stage roadmap](MILESTONE-08.md), turning the milestones into engineering work packages with prerequisites, implementation tasks, validation, tangible acceptance evidence and stop conditions.

## Release trust model — read before implementation

The Solidity Factory/Pair/Router are experimental, immutable and permissionless. Their local tests and GitHub CI do not imply production safety or a third-party audit. The code cannot revoke third-party on-chain access through the frontend. **No arbitrary "signed approval" JSON or web UI setting can replace independent security evidence.**

The canonical WVERY issuer and bytecode are still unconfirmed. Explorer search results alone are insufficient; see [WVERY review](WRAPPED-VERY-REVIEW.md). Source and signature checks must be performed by independent authorized reviewers at a fixed source revision. Dependency advisories have not been remediated.

## Phase 0 — External blockers: DO NOT DEPLOY

### 8.0A: Independent AMM auditor contract
**Dependency:** code owner selects an independent auditor and authorizes scope, fees, and confidentiality.

**Implementation:**
- Identify independent security firm(s) experienced with Solidity AMMs and native-wrapped tokens.
- Send [external auditor brief](INDEPENDENT-AUDIT-BRIEF.md) plus complete source, Foundry settings, threat model, Slither output and all test traces.
- Establish immutable candidate source SHA, explicit exclusions, start/end dates, disclosure terms and remediation window.
- Demand severity-ranked written findings, concrete testable demonstrations, remediation PR review and re-audit/delta report.
- Produce a signed public report matching exact deployed commit and compiler configuration; record exceptions and who accepted them.

**Acceptance:** actual independent auditors are contracted, report delivered, every critical/high finding resolved and retested, all material changes delta-reviewed.
**Evidence:** firm, authorized contract scope, frozen SHA, dated report, findings register, retest confirmation.
**Current:** OPEN. GitHub Issue #9. No auditor engagement has been created by AI.

### 8.0B: Canonical wrapper verification
**Dependency:** independently verifiable, official VERY source identifies canonical wrapper.

**Implementation:**
- Collect issuer or chain-operator provenance and audited source matching the on-chain address.
- Read `eth_chainId`, `eth_getCode`, wrapper deposit/withdraw selectors, `totalSupply`, `eth_getBalance` at pinned block.
- Confirm wrapped issuance is redeemable for native VERY, privileged mint/blacklist/upgradeability powers, and emergency conditions.
- Exercise wrapper interaction on a **local fork** against recorded bytecode, including native-value deposits, sends and withdrawals to hostile recipients.
- Confirm `router.WETH()` target matches approved wrapper and code hash in deployment manifest.

**Acceptance:** verified issuer provenance, bytecode, source, custody and redemption model; explicit independent review.
**Evidence:** signed/written official confirmation, chain ID, block, code hash, verified source and recorded fork results.
**Current:** OPEN. GitHub Issue #10. A token symbol WVERY is not equivalent to canonical approval.

### 8.0C: Supply-chain vulnerability remediation
**Dependency:** owner triages package advisories and all Slither results.

**Implementation:**
- Archive complete `npm audit --json` with package paths, GHSA/CVE IDs, runtime reachability, impacted versions and fixed versions.
- Upgrade and regression-test runtime dependencies, avoid `npm audit fix --force` without reviewing breakage.
- Independently triage Slither `reentrancy-no-eth`, `calls-loop`, strict equality, timestamp and other results.
- Save a disposition for each report: validated and fixed, accepted with safeguards, or documented false positive.
- Reproduce static/fuzz/audit findings against frozen code; require action on exploitable high/critical vulnerabilities.

**Acceptance:** documented and remediated runtime high/critical risks; independent auditor reviewed smart-contract finding dispositions.
**Evidence:** npm SBOM/advisory export, lockfile diff, relevant test suite, triage log and release signoff.
**Current:** OPEN. GitHub Issue #11.

## Phase 1 — Deterministic executable contract integration

### 8.1: Complete release candidate and machine-checkable manifest
**Build:** final Factory, Pair, Router, canonical wrapped token adapter; freeze all contract source and compiler settings.
**Contracts:** `contracts/src/SymbFactory.sol`, `SymbPair.sol`, `SymbRouter.sol`.
**Validation:** `forge build --sizes`, `forge test -vv`, ABI signature comparison against Viem, bytecode hash comparison, 30 bps fee compatibility with frontend.
**Evidence:** immutable source SHA, compiled artifact hashes, SPDX/provenance record, auditor signature.
**Stop:** any source change after audit or ABI incompatibility requires re-review.

### 8.2: Full local lifecycle simulation
**Build:** create factory, pair and router; initialize standard ERC20/ERC20 and local wrapped native pools in deterministic tests.
**Test cases:** first minimum-locked LP mint; second provider adds in correct ratio; direct and 2-hop swaps; partial and full LP redemption; native wrap/unwrap; transaction expiry; output slippage; insufficient allowance; rejected transfer; failed deposit rollback.
**Evidence:** Foundry logs, gas per operation, block-level reserve and wallet balance assertions, deployed local bytecode.
**Stop:** any value mismatch, failed invariant, reserve inconsistency or unauthorized payout.
**Current:** Foundry local rehearsal exists and passes, but more adversarial cases and chain-specific fork testing required.

### 8.3: VERY fork compatibility
**Build:** fork a pinned VERY block with read-only RPC; prohibit broadcast to public chain.
**Test cases:** deployed wrapper calls if verified, EVM opcode/solc compatibility, call traces, code existence, revert reasons, gas estimators, direct and batched event collection.
**Evidence:** pinned chain block/hash, RPC client version if available, fork command and logs, contract bytecode, test results.
**Stop:** an RPC that reports the wrong chain, missing code or inconsistent reserve semantics.

### 8.4: Audit-grade adversarial property tests
**Build:** expand handler-based invariants and fuzz campaigns.
**Test cases:** multiple user balances, malicious callback token, untrusted token return data, direct reserve donations, Sync order, first LP lock, depleted reserves, reentry attempts, initial price manipulation and extreme arithmetic.
**Evidence:** reproducible seed, counterexamples, fuzz run counts, test/coverage report and review resolution.
**Stop:** any unreconciled loss or exploit case.

## Phase 2 — Signed operational setup

### 8.5: Production identity and multisig
**Build:** identify deployer, treasury signers, signing thresholds, recovery plan and CI build authority, without putting private keys in any repository or environment open to frontend users.
**Evidence:** multisig addresses, approval policy, signer roster held privately, operator procedure and emergency contacts.
**Stop:** all high-impact actions controlled by a single insecure key or an unidentified party.

### 8.6: Token admission policy
**Build:** allowlist only independently verified ERC-20 contracts; record decimals, bytecode, source provenance, transfer behaviour and flags for upgradeable/tax/rebase/blacklist.
**Evidence:** review table signed by security and product owners.
**Stop:** unsafe tokens accidentally treated as reviewed.

### 8.7: Mainnet deployment ceremony (separate explicit approval)
**Build:** compile audited SHA exactly; approve deployment gas cap, verify sender and addresses, deploy Factory/Router from authorized wallet only, inspect receipts, verify contracts on VeryScan.
**Evidence:** tx hash, receipt success, chain 4613, addresses, deployed codehash, source verification and same-commit audit.
**Stop:** mismatched source, constructor args or codehash. **No deployment authorized by this document.**

### 8.8: Liquidity funding / initial price controls
**Build:** approve initial assets, maximum amount, price ratio, starting depth and risk owner. Initial pool is price setting and arbitrage-exposed.
**Evidence:** funding approvals, signed exact amounts, verified token balances, gas budget, minted LP receipt.
**Stop:** undefined fund cap, no independent pricing review, unexpected slippage or unsupported token.

## Phase 3 — Bounded real transaction validation

### 8.9: Trading and price-execution smoke tests
**Build:** test small direct asset swaps and native/token flows using approved wallets and a bounded transaction budget.
**Checks:** quote freshness, expected gas, fee 30 bps/hop, deadline, minimum output, price impact, receipt status, exact wallet reserve deltas.
**Evidence:** VeryScan tx links, transaction hashes, event logs, contract reserves at block.
**Stop:** a mismatched balance, failing simulation or unexpected fee.

### 8.10: Liquidity add/withdraw smoke tests
**Build:** create initial and second-provider deposits, LP exact-value allowance, 25% withdrawal and eventual residual withdrawal.
**Checks:** minted/burned shares, minimum locked LP, reserve backing, native unwrap, ability to exit directly via contract.
**Evidence:** tx receipts, allowance transactions, LP total supply and user token balances before/after.
**Stop:** any non-redeemable position or unexplained reserve delta.

### 8.11: Wallet UX matrix
**Build:** injected EIP-6963 and WalletConnect wallet flows, gas estimation, network-switch warning, simulation and signature details.
**Tests:** wrong chain 1 vs 4613, wallet disconnected, stale quote, rejection, replaced transaction, receipt timeout, insufficient gas, concurrent action.
**Evidence:** redacted browser traces and per-wallet compatibility report.
**Stop:** signing button shown against untrusted router/invalid chain, or silent signed error.

## Phase 4 — Data and operations

### 8.12: Neon indexer end-to-end proof
**Build:** separate staging vs production Neon roles, apply M06 migration using approved DB credentials, incremental backfill from exact deployment block.
**Checks:** PairCreated/Swap/Mint/Burn/Sync/LP Transfer decoding, checkpoint restart, reorg rollback, counterparty token correctness, on-chain reserves and LP balances at pinned block.
**Evidence:** migration checksum, indexed throughput, replay and reconciliation logs.
**Stop:** DB reorg mismatch, missing events or stale chain ID.

### 8.13: Controlled beta access and exposure
**Build:** limited invitation UI, disclosures and funding caps. Current immutable contracts remain permissionless; frontend invitations cannot limit third-party direct calls.
**Evidence:** disclosed scope, wallet count, operator deployment approvals, trust model.
**Stop:** marketing suggests guaranteed security, protocol pausing, or returns.

### 8.14: Monitoring and emergency operations
**Build:** alerting on reserve divergence, unexpected pair creation, contract code changes, reverted tx rates, wide slippage, RPC downtime, indexer lag and database checkpoint anomalies.
**Drill:** disable frontend writes, communicate to users, preserve logs, identify immutable contract limitations and restart safely.
**Evidence:** alert destinations, drill transcript, responder acknowledgement and runbook.
**Stop:** no responder coverage or inability to detect serious divergence.

## Phase 5 — Auditability, metrics, and launch governance

### 8.15: Explorer verification
**Build:** publish Factory/Router/code hashes, wrapped token provenance, 30 bps fee, audited version, precise status and residual risk.
**Evidence:** canonical explorer URLs for real contract and transaction receipts.
**Stop:** missing source-verified deployed code or address spoofing.

### 8.16: Beta metrics correctness
**Build:** confirm true unique wallet counts, actual swaps, pool-denominated volume, LP balances and token-denominated reserves. Compute USD TVL only from a reviewed price reference.
**Evidence:** reproducible chain-block data sample, reconciliation report and pricing provenance.
**Stop:** invented volume, unpriced assets presented as priced, multihop double-counting.

### 8.17: Final beta security council decision
**Build:** dated signoff signed by fund owner, operations owner, security reviewer and external auditor where their role is required.
**Evidence:** link to frozen source, verified deployed code, risk register, all critical/high findings closed, approved funding, tested incident plan.
**Stop:** any missing core evidence. Do not treat a GitHub boolean or preflight CLI as approval.

### 8.18: Exit to M09
**Build:** review real launch receipts and postlaunch monitoring, user support, liquidity depth, downtime, failed trade patterns, resolved incidents and risks.
**Evidence:** dated go/no-go report and separately authorized public-release decision.
**Stop:** active exploits, unexplained losses, price manipulation without mitigation, custody compromise or unresolved serious findings.

## Security / workflow ownership (roles, not assigned people)

| Role | Mandatory responsibility |
| --- | --- |
| Protocol maintainer | Freeze source and resolve engineering issues |
| Independent auditor | Deliver scoped report, severity findings and retest |
| Chain/wrapper verifier | Verify canonical WVERY source, codehash, and redemption |
| Treasury signers | Approve bounded VERY / token funding and gas |
| Operations lead | Deploy sanctioned artifacts and maintain monitoring |
| Data operator | Run Neon migrations, reconciliation and indexing |
| Release approver | Record independent go/no-go decision |

## Evidence contract for every PR

Each implementation PR should include: specific 8.x stage(s), immutable reference commit, code/tests changed, inputs and network, deterministic result, human signer where money or governance is involved, risks/limitations and next blocking item.

## Automated developer checks

```bash
npm test
npm run typecheck
npm run build
forge build --sizes
forge test -vv
npm run beta:preflight
npm run beta:gate:ci
```

The beta preflight script reports remaining evidence only and is incapable of authorizing deployment. The CI gate asserts that production remains in the safe, not-deployed state. An operator must not turn on release flags merely to make preflight show different values.

## Current evidence / decision

- Root MIT license and experimental Solidity present.
- Local Foundry lifecycle, fuzz and invariants passed in M07 and follow-up hardening.
- npm workflow captured high/moderate advisories; remediation remains open.
- A Slither job completed but not every finding is disposed by a third party.
- VeryScan lists a WVERY candidate; current evidence does not establish a canonical wrapper.
- No external auditor has been engaged, no canonical wrapper independently confirmed, no production contracts deployed, no external credentials or live funding provided.

**Release decision: NO-GO for spending/deploying; CONTINUE code-level testing and independent audit engagement.**
