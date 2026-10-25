# SYMB DEX — MILESTONE 8 MASTER CHECKLIST

> **ROOT HIGHLIGHT — VERY MAINNET · CHAIN 4613 · MIT LICENSE · NOT LIVE / RELEASE BLOCKED**
>
> Original Solidity and Foundry security tests exist, but **no production AMM, independent audit, officially verified canonical WVERY or funded mainnet beta exists**. The current deployment registry has null Factory/Router/WVERY and false release flags. **Never fund or approve an unverified deployment.**

**Source:** [Solidity contracts](contracts/src) · [Root README](README.md) · [Deep operator runbook](docs/MILESTONE-08-EXECUTION.md) · [Formal roadmap](docs/MILESTONE-08.md) · [Deployment manifest template](docs/DEPLOYMENT-MANIFEST.template.json)

## Immediate external release blockers

- [ ] **[Issue #9 — Independent audit](https://github.com/mushee-io/lidde-dex/issues/9):** commission a real external audit, freeze final source, remediate and obtain auditor retesting.
- [ ] **[Issue #10 — Official WVERY verification](https://github.com/mushee-io/lidde-dex/issues/10):** establish chain-operator/issuer provenance, codehash, backing and working redemption.
- [ ] **[Issue #11 — Slither and npm advisory remediation](https://github.com/mushee-io/lidde-dex/issues/11):** triage package vulnerabilities and each static-analysis finding, prove fixes and review residual risk.

## Source code versus production status

| Subsystem | Built today | Outstanding proof |
|---|---|---|
| Factory, Pair, Router, LP ERC-20 | Original MIT Solidity compiled, locally fuzzed | Independent final audit, chain-compatible deployment verification |
| Wrapped VERY | Local-only development reference and read-only candidate inspector | Official canonical contract identity and redeemability |
| Swap/LP frontend | Source present, with transaction release locks | Approved tokens, funded mainnet tests and receipts |
| M06A/B Neon/event indexer | Source/schema exist | Live migration, funded event ingestion, reorg drills and reconciliation |
| Security automation | Foundry, Slither, node tests and dependency reports exist | Third-party audit and package/finding remediation |
| Local beta rehearsal | Limited Foundry lifecycle passes | Approved VERY fork and capped production proof |
| Governance, monitoring, funding | Drafts and planning tools | Signed roles, true caps, live alerts and treasury approval |

## Execution order

1. **Block 0:** Finish Issues #9–11; finalize native wrapper and the external audit scope.
2. **Build 1:** 8.1–8.7, reviewed artifacts and local/fork tests; no funded public-chain activity.
3. **Controlled execution:** 8.8–8.10 only with audit, explicit capped funding and authorized signers.
4. **Operations:** 8.11–8.16 wallet, Neon, metrics, monitoring and public source records.
5. **Approval:** 8.17 independent go/no-go and 8.18 post-beta evidence plus separate M09 decision.

## Full itemized engineering checklist

**Phase A: Security, contract source, governance, asset review**

- **8.1 VERY Mainnet and canonical WVERY:** Official wrapper identity is unverified.
- **8.2 Independent Solidity audit and remediation:** No auditor has been commissioned.
- **8.3 Reproducible deployment manifest and ABI verification:** Only manifest template exists.
- **8.4 Treasury signers, multisig, governance and budget:** No approved treasury/governance arrangement.
- **8.5 Reviewed ERC-20 token registry:** Verified token list remains empty.

**Phase B: Local and fork tests, first on-chain funding and transactions**

- **8.6 Full local Foundry deployment rehearsal:** Local lifecycle smoke tests already pass.
- **8.7 VERY RPC fork compatibility and gas checks:** No verified fork report yet.
- **8.8 Approved first deployment and capped initial liquidity:** Not authorized; zero production deposits.
- **8.9 Mainnet direct, native and two-hop swap smoke tests:** Not started (no live liquidity).
- **8.10 LP mint, partial exit and full redemption:** Only local simulation exists.

**Phase C: Wallets, Neon, beta limits, live monitoring**

- **8.11 Wallet and frontend integration matrix:** Source implemented; actual-wallet review incomplete.
- **8.12 Neon schema, on-chain indexing and reconciliation:** M06 source implemented; not verified on funded production DB.
- **8.13 Restricted beta enrollment and explicit user risks:** No live beta or invitations issued.
- **8.14 Observability, alerting and incident drills:** Draft plan exists; no production drills.

**Phase D: Verification, analytics, independent release authority and handover**

- **8.15 Public contract verification and disclosure:** No official Symb deployment.
- **8.16 Provenance-based beta volume, wallets and TVL:** No confirmed Symb production metrics.
- **8.17 Independent final security go/no-go signoff:** No go-live authorization granted.
- **8.18 Beta closeout and Milestone 9 handover:** No beta data; M09 not authorized.

### 8.1 — VERY Mainnet and canonical WVERY

**Responsible:** Protocol / security  
**Actual status:** Official wrapper identity is unverified.

- [ ] Confirm official chain 4613, RPC, finality, opcode compatibility, block hash and explorer.
- [ ] Get issuer- or VERY-operator-backed canonical WVERY address and source references.
- [ ] Read deployed bytecode, codehash, decimals, supply, native collateral and admin permissions at the same pinned block.
- [ ] Reproduce deposit, withdraw, transfer and failure behaviour in a fork; compare router WETH() binding.
- [ ] Archive independent provenance signoff; never approve an explorer symbol by itself.

**Acceptance evidence:** Official attestation, pinned RPC read and safe fork redemption results.  
**Release stop condition:** Unverified code, backing, signer or redemption.

### 8.2 — Independent Solidity audit and remediation

**Responsible:** Auditor / maintainer  
**Actual status:** No auditor has been commissioned.

- [ ] Freeze Solidity 0.8.26, optimizer 200, viaIR/Paris and full audited source commit.
- [ ] Engage an external audit firm under separately authorized scope and commercial terms.
- [ ] Audit Factory, Pair, Router, ERC20, native wrapper and economics: reentrancy, MEV, access controls, reserves and LP invariants.
- [ ] Provide all Foundry traces and complete Slither SARIF; remediate every exploitable high/critical vulnerability.
- [ ] Obtain dated signed report, severity register and independent retesting of changes.

**Acceptance evidence:** Genuine third-party report, frozen SHA, fix/retest artifacts.  
**Release stop condition:** No auditor, unresolved finding or material unaudited patch.

### 8.3 — Reproducible deployment manifest and ABI verification

**Responsible:** Contracts / reviewer  
**Actual status:** Only manifest template exists.

- [ ] Record exact bytecode, verified Solidity source, SPDX MIT provenance, compiler settings and immutable commit.
- [ ] Generate ABI artifacts and compare Factory, Pair and Router interfaces to frontend Viem expectations.
- [ ] Test router factory(), WETH(), PairCreated, pair.factory(), pair token order and fixed 30 bps fee.
- [ ] Compute creation/runtime codehash and CREATE2 pair verification; archive constructor args and deployment gas.
- [ ] Publish real deployment transaction hashes and verified VeryScan links only after authorized execution.

**Acceptance evidence:** Reproducible bytecode manifest reviewed at pinned block.  
**Release stop condition:** Codehash, fee, constructor or chain mismatch.

### 8.4 — Treasury signers, multisig, governance and budget

**Responsible:** Owner / treasury  
**Actual status:** No approved treasury/governance arrangement.

- [ ] Define deployer, release approver, treasury signers, security reviewer, data operator and incident commander.
- [ ] Configure independently held multisig approval threshold where treasury or deployment risk justifies it.
- [ ] Segregate operator, treasury and tiny testing wallets; never store seed phrases/private keys in git or browser.
- [ ] Approve maximum gas, initial liquidity, trading test budget and incident spending limits in writing.
- [ ] Drill key compromise and recovery; disclose immutable pools cannot be paused from the frontend.

**Acceptance evidence:** Approved signer matrix, thresholds, financial caps and recovery drill.  
**Release stop condition:** Undefined authority, budgets or emergency contacts.

### 8.5 — Reviewed ERC-20 token registry

**Responsible:** Asset security  
**Actual status:** Verified token list remains empty.

- [ ] Review source, exact contract address, codehash, decimals, issuer/upgrade and blacklist privileges.
- [ ] Test transfer, transferFrom, approvals, callback, tax-on-transfer, rebasing and dust/rounding behaviour.
- [ ] Exclude incompatible assets and prevent self-imported tokens becoming trusted automatically.
- [ ] Prepare initial market eligibility, first LP ratio and user asset warnings.
- [ ] Keep signed reviewed-token registry in sync with audited contract restrictions.

**Acceptance evidence:** Reviewed and versioned token provenance/behaviour register.  
**Release stop condition:** Unverified or incompatible token.

### 8.6 — Full local Foundry deployment rehearsal

**Responsible:** Solidity QA  
**Actual status:** Local lifecycle smoke tests already pass.

- [ ] Deploy Factory, Pair, Router, local wrapped-native test fixture and reviewed mock ERC20s to isolated EVM.
- [ ] Verify first mint plus 1,000 locked LP, multi-provider ratios and total-supply/reserve arithmetic.
- [ ] Test direct/2-hop swaps, native wrap/unwrap, fee math, slippage, deadline and exact allowance.
- [ ] Rehearse 25%, 50%, 100% LP withdrawals, failed deposit rollback, adversarial tokens and reentrancy.
- [ ] Save deterministic seeds, trace, gas report, emitted events and before/after wallet balances.

**Acceptance evidence:** Complete deterministic test suite with full state reconciliation.  
**Release stop condition:** Reserve delta, attacker extraction or test failure.

### 8.7 — VERY RPC fork compatibility and gas checks

**Responsible:** Blockchain QA  
**Actual status:** No verified fork report yet.

- [ ] Pin an actual VERY block/hash and attest chain 4613; run isolated fork without broadcasting.
- [ ] Load independent official wrapper and reviewed ERC20 code when verified.
- [ ] Test gas schedules, Solidity EVM opcode compatibility, router receipts, call simulation and native refunds.
- [ ] Re-run slippage/revert/MEV-style stale reserve scenarios with actual chain client behaviour.
- [ ] Capture scripts, block information, gas variance and independent execution review.

**Acceptance evidence:** Reproducible fork run and verified wrapper/call traces.  
**Release stop condition:** RPC disagreement, code mismatch or failed native redemption.

### 8.8 — Approved first deployment and capped initial liquidity

**Responsible:** Treasury / security  
**Actual status:** Not authorized; zero production deposits.

- [ ] Approve a precisely denominated cap in VERY and each token, and an explicit initial price risk statement.
- [ ] Deploy audited Factory/Router using approved signer and frozen audited bytecode only.
- [ ] Verify actual deployed address, code, constructor values, `factory()` and `WETH()`.
- [ ] Create pair and fund small LP position; verify PairCreated, Mint, Sync and permanently locked LP.
- [ ] Record gas, chain block, all receipts and reconcile wallet and pool reserves before further funding.

**Acceptance evidence:** Funding authorization and matching successful explorer receipts.  
**Release stop condition:** Missing audit, cap, wrapper, price review or codehash.

### 8.9 — Mainnet direct, native and two-hop swap smoke tests

**Responsible:** Execution QA  
**Actual status:** Not started (no live liquidity).

- [ ] Confirm quote, route, wallet, chain, slippage min, fees and fresh reserves immediately before signing.
- [ ] Require exact ERC20 approval, gas buffer, contract simulation and approved signing destination.
- [ ] Execute tiny approved token/token, VERY/token and token/VERY swaps; test only reviewed paths.
- [ ] Track pending, receipt success/revert, replacement and unknown timeout separately.
- [ ] Reconcile output and gas against Swap logs, reserves and actual wallet balances.

**Acceptance evidence:** Real tx receipts and block-pinned wallet/pool reconciliation.  
**Release stop condition:** Unexplained output, gas or fee mismatch.

### 8.10 — LP mint, partial exit and full redemption

**Responsible:** Liquidity QA  
**Actual status:** Only local simulation exists.

- [ ] Check LP share after first and subsequent deposits, pool supply and min-locked LP.
- [ ] Approve only required LP allowance; test partial 25% withdrawal with min returns.
- [ ] Withdraw remaining redeemable LP tokens, including native redemption if verified.
- [ ] Verify Burn/Transfer/Sync event order, final pool reserves and wallet token amounts.
- [ ] Demonstrate independent contract withdrawal if frontend is inaccessible.

**Acceptance evidence:** Real on-chain withdraw receipts and remaining-share accounting.  
**Release stop condition:** Funds unrecoverable, LP burn mismatch or excess claim.

### 8.11 — Wallet and frontend integration matrix

**Responsible:** Frontend QA  
**Actual status:** Source implemented; actual-wallet review incomplete.

- [ ] Test EIP-6963 browser wallets, WalletConnect, mobile compatibility and chain switch 1→4613.
- [ ] Validate spender, token, price impact, deadline, recipient and human-readable transaction details.
- [ ] Test rejection, disconnect, account change, stale quote, transaction replacement and receipt timeout.
- [ ] Inspect imported token metadata/XSS risk, gas insufficiency, accessibility and VeryScan links.
- [ ] Block writes against unreviewed router or unsupported token regardless of UI state.

**Acceptance evidence:** Device and browser compatibility matrix with redacted actual receipts.  
**Release stop condition:** Wrong-network sign or spoofed spender.

### 8.12 — Neon schema, on-chain indexing and reconciliation

**Responsible:** Data engineer  
**Actual status:** M06 source implemented; not verified on funded production DB.

- [ ] Provision approved Neon staging, migrations and least-privilege indexer/runtime DB accounts.
- [ ] Backfill canonical PairCreated, Mint, Burn, Swap, Sync and LP Transfer from verified deployment block.
- [ ] Enforce atomic cursor/checkpoint and idempotent event identity (chain, tx hash, log index).
- [ ] Simulate worker restart, concurrent writers, shallow reorg replay and deep reorg stop.
- [ ] Reconcile indexed reserves to actual pair `getReserves` at identical block; halt metrics on drift.

**Acceptance evidence:** Migration checksum, checkpoint history and signed reserve-reconciliation report.  
**Release stop condition:** Missing event, stale cursor or reserve mismatch.

### 8.13 — Restricted beta enrollment and explicit user risks

**Responsible:** Product / compliance  
**Actual status:** No live beta or invitations issued.

- [ ] Create reviewed onboarding copy, token support pages, fees, impermanent loss, slippage and wrapper warnings.
- [ ] Limit operational exposure by real treasury cap and staged enrollment; do not promise protocol-level access restrictions.
- [ ] Declare that immutable permissionless pools remain callable directly even if the website hides controls.
- [ ] Provide legitimate support, transaction-help process and risk acknowledgement before live funds.
- [ ] Require owner and security approval for any external promotion and public launch messaging.

**Acceptance evidence:** Approved beta charter, risk disclosure and observed wallet activity.  
**Release stop condition:** Marketing misstates audit, returns or on-chain pause ability.

### 8.14 — Observability, alerting and incident drills

**Responsible:** Operations  
**Actual status:** Draft plan exists; no production drills.

- [ ] Alert on unexpected reserve changes, high price impact, revert spikes, codehash drift and deploy anomalies.
- [ ] Track RPC, Neon, indexer lag, inconsistent blocks and missing event logs.
- [ ] Name on-call responders, escalation contacts, decision authority and backup monitoring route.
- [ ] Simulate site write-disable, compromised signer and reserve mismatch while noting immutable contracts are unpauseable.
- [ ] Store incident event timeline, remediation and explicit recovery approval.

**Acceptance evidence:** Demonstrated alert deliveries, drill transcript and response ownership.  
**Release stop condition:** No responder, missing reserve alerts or failed recovery drill.

### 8.15 — Public contract verification and disclosure

**Responsible:** Protocol / independent reviewer  
**Actual status:** No official Symb deployment.

- [ ] Publish Factory, Router, wrapper and verified pool addresses with on-chain explorer source links.
- [ ] Reproduce deployed bytecode from frozen commit and audit manifest at chain 4613.
- [ ] Disclose 30 bps pool fee, permanent initial LP lock, non-upgradeable/no-pause status and supported assets.
- [ ] Link dated independent audit, unresolved residual risks and incident contact.
- [ ] Ensure frontend links and codehash verification prevent fake-pair impersonation.

**Acceptance evidence:** Verified VeryScan contract records and user documentation.  
**Release stop condition:** Mismatched on-chain source or misleading audit claim.

### 8.16 — Provenance-based beta volume, wallets and TVL

**Responsible:** Data QA  
**Actual status:** No confirmed Symb production metrics.

- [ ] Count actual confirmed swaps, LP deposits/withdrawals and active wallets from chain logs.
- [ ] Calculate volume per pool and separate multi-hop route volume from unique user orders.
- [ ] Value TVL in USD only with vetted reliable sources; display unavailable for unsupported prices.
- [ ] Surface canonical block timestamp and indexing lag for every metric and chart.
- [ ] Reconcile public API with raw receipts and on-chain balances; never fabricate volume, APR or liquidity.

**Acceptance evidence:** Reproducible audited metrics snapshots with event/price provenance.  
**Release stop condition:** Unverified pricing or count mismatch.

### 8.17 — Independent final security go/no-go signoff

**Responsible:** Auditor / owner / treasury  
**Actual status:** No go-live authorization granted.

- [ ] Recheck independent audit on exact deployed code and linked WVERY source/redeemability.
- [ ] Review all Critical/High/Medium findings, npm advisories, Slither dispositions and residual risk.
- [ ] Verify approved funding cap, multisig authority, receipts, LP exit, wallet matrix, Neon and alert drills.
- [ ] Collect attributable dated release approval from independently empowered reviewers.
- [ ] Only separately authorized operators may enable production; local JSON flags/scripts are not authorization.

**Acceptance evidence:** Complete signed release docket with on-chain references and independently checked evidence.  
**Release stop condition:** Any unverified wrapper, exploit, role/budget gap or missing audit.

### 8.18 — Beta closeout and Milestone 9 handover

**Responsible:** Product / risk council  
**Actual status:** No beta data; M09 not authorized.

- [ ] Audit real beta trades, gas costs, liquidity depth, uptime, failure rates and outstanding exposures.
- [ ] Summarize incidents, remediation, warning messages, user support and security findings.
- [ ] Reconcile measured wallet/pool metrics and correctly attributed LP positions at pinned blocks.
- [ ] Explicitly decide continue beta, halt, or propose independently reviewed public release.
- [ ] Publish completion record and prioritized M09 tasks with owners, dependencies and acceptance criteria.

**Acceptance evidence:** Signed post-beta evidence report and separate M09 decision.  
**Release stop condition:** Any active exploit, loss, unreconciled state or misleading reported volumes.

## Production exit criteria (all currently unmet)

- [ ] Verified official WVERY + source and codehash, with independently reviewed wrap/redeem semantics.
- [ ] Genuine third-party audit of frozen deployable Solidity, fixes/retests and documented residual findings.
- [ ] Full Slither/npm advisory triage and no unresolved exploitable high/critical production risk.
- [ ] Approved multisig, exact treasury funding limits, deployment manifest and independent financial signoff.
- [ ] Tiny approved live pool creation, swaps and LP withdrawal receipts and on-chain reserve reconciliation.
- [ ] Wallet signing QA, Neon event replay, verified metrics and live alerting.
- [ ] Verified source on VeryScan and public user risk disclosure.
- [ ] Separate signed 8.17 release and 8.18 M09 handover decisions.

## Root project commands

```bash
npm install
npm test
npm run typecheck
npm run build
forge build --sizes
forge test -vv
npm run beta:preflight
npm run beta:gate:ci
# Read-only wrapper candidate probe, NOT official chain attestation:
SYMB_WVERY_CANDIDATE=<reviewed-address> npm run inspect:wvery
```

**These checks are not a third-party audit and do not permit deployment, token approval, or spending funds.**
