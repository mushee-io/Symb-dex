# Milestone 07 — Solidity, MIT License and Security

**Source delivered:** experimental Foundry implementation; **production:** no verified deployment, no external audit, no public trading.

## What was built
- Root LICENSE (MIT) and foundry.toml (Solidity 0.8.26, optimizer, Paris EVM, via IR, fuzz/invariant profiles).
- Original Solidity in contracts/src: LiddeERC20, LiddeWrappedVery, LiddeFactory, LiddePair, LiddeRouter.
- Fixed 30 bps LP fee, ERC-20 swap paths, native VERY-compatible ABI selectors, LP mint/burn and first-1000-LP lock.
- Foundry Solidity tests: swaps, pool creation, LP accounting, wrapped/native actions, deadlines, slippage, fuzz bounds, adversarial token reentrancy.
- Stateful fuzz handler and invariant tests: reserve backing, permanently locked initial LP, factory pair identity.
- GitHub Actions Foundry compilation/testing, Slither high-finding gate, no-accidental-deployment policy check.
- Root SECURITY.md private vulnerability reporting policy, THREAT-MODEL.md, INCIDENT-RESPONSE.md and DEPLOYMENT-MANIFEST.template.json.

## MIT and licenses
Original Solidity source is MIT-licensed and uses SPDX-License-Identifier: MIT. It does not incorporate GPL-protected Uniswap V2 source. AMM equations and standard interface conventions can be independently implemented. Future vendored/copy-pasted source requires a license-provenance audit. npm and third-party CI dependencies retain their upstream licenses.

## Security assumptions
- 0.30% fixed swap fee stays in pool reserves for LPs; no owner-controlled fee switch or protocol revenue.
- Factory and pairs are immutable/unpauseable experimental contracts. A frontend pause does not prevent direct on-chain activity.
- Unsafe tokens including rebasing, tax-on-transfer, blacklist and upgradeable proxies are NOT automatically supported.
- LiddeWrappedVery is a LOCAL WRAPPER REFERENCE, not verified as VERY Chain's canonical WVERY.
- Release configuration in config/deployments.json remains not-deployed/null/false. Do not change flags without signed independent release approval.

## Still required — not delivered
1. Full independent external smart-contract audit of a frozen commit and verification of all fixes.
2. Actual native VERY EVM compatibility and canonical wrapped native token identification.
3. Economic design review covering arbitrage, flash-loan/oracle dependencies, MEV and market manipulation.
4. Wider fuzz/property testing, gas bounds, Slither finding review and real deployment/fork testing.
5. Multisig operational governance and owner-signer runbook; no role is assigned in this repository.
6. Verified bytecode hashes and addresses plus an independently signed production deployment manifest.
7. Independent low-value mainnet transactions only after explicit funding and security authorization.
8. Neon operator deployment and reorg/reconciliation validation.
9. Post-release on-chain incident response and public communications readiness.

No audit certificate, no safe-funds claim, and no user-deposit authorization are asserted by this project.

## Automated static-analysis findings

Slither runs in GitHub Actions and blocks high-impact results. Passing that specific gate does NOT mean no medium/low/informational findings remain: all reported findings need human security triage, explicit review outcomes and appropriate remediation before mainnet release. The wrapped-native withdraw sequence was adjusted to emit before the external send, following state-before-interaction discipline. Deployment remains forbidden by the release gate.

## Pre-beta audit hardening and provenance results

See [Slither finding register](SLITHER-FINDINGS-TRIAGE.md), [WVERY provenance investigation](WRAPPED-VERY-REVIEW.md), [independent auditor handoff](INDEPENDENT-AUDIT-BRIEF.md) and [Milestone 8 roadmap](MILESTONE-08.md). Source hardening requires token contract bytecode before raw ERC-20 calls and moves factory pair records ahead of initialization. Local deployment-like smoke tests are deliberately not mainnet broadcasts. The canonical wrapped VERY contract has **not** been established; no address should be added to the live registry.
