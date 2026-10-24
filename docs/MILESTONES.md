# Lidde delivery milestones

All code is developed milestone-by-milestone. Checkmarks here represent delivered source code only; no feature is production-ready until its acceptance criteria pass.

## M01 — VERY network and foundation (merged)
- [x] Document official chain ID, RPC, currency and explorer.
- [x] Implement a read-only chain ID + latest block RPC check (run separately).
- [x] Create Next.js app shell and page navigation.
- [x] Integrate injected wallet connection and real native balance lookup.
- [x] Add a fail-closed deployment configuration.
- [x] Add unit tests and CI definitions.
- [ ] Confirm actual RPC responses from an external network-enabled environment.
- [ ] Verify canonical wrapped VERY contract and issuer/ownership.
- [ ] Obtain and review trusted production token addresses.
- [x] Confirm M01 CI build is green.

## M02 — AMM architecture and Foundry project (experimental MIT source present)
- [x] Implement original MIT-licensed constant-product AMM source, avoiding incompatible GPL-licensed dependencies.
- [x] Add root Foundry configuration with pinned Solidity compiler.
- [x] Implement factory, pairs, 30 bps LP fees, router and local experimental wrapped-native token.
- [x] Add Solidity swap, liquidity, fuzz and invariant test suites.
- [ ] Complete independent security review, determine canonical wrapped VERY and verify deployed ABI/bytecode.
- [ ] Test finalized AMM on a compatible local/forked VERY execution environment before any mainnet deployment.

## M03 — Wallet and token flows (implemented, awaiting human chain smoke test)
- [x] EIP-6963 multi-injected wallet detection, optional WalletConnect and disconnect UI.
- [x] ERC-20 real balance reads and network mismatch handling.
- [x] Router allowance reads and exact approve/revoke flows **fail closed** without reviewed deployment.
- [x] On-chain token metadata import, local watchlist and explicit unverified risk warnings.
- [x] Automated token validation and allowance security-gate tests.
- [ ] Verify EIP-6963 multi-wallet and WalletConnect QR flow against real wallets.
- [ ] Verify an ERC-20 balance read with a legitimately deployed VERY token.
- [ ] Enable live approval flow only after M02 deployed and M07 reviewed.


## M04 — Quotes and real swaps (code implemented; deployment and live tests pending)
- [x] Factory/pair reserve reads, direct/WVERY multihop routing and integer-safe output quotes.
- [x] Slippage presets/custom limits, min-output calculation and 1–60-minute deadlines.
- [x] Mandatory fresh requote, route equality and quote-bound slippage checks before execution.
- [x] Mandatory on-chain simulation, allowance checks, balance/gas buffer validation, wallet signature and receipt monitoring.
- [x] Swap UI: direction, reviewed tokens, output, route, impact, fee settings, refresh, transaction hash.
- [x] Unit tests for math, paths, failure cases and execution gates.
- [ ] Finish M02 audited AMM, verify factory/router/WVERY and approved fee configuration.
- [ ] Verify independent chain code, approved token list, deploy reviewer signoff.
- [ ] Perform browser/wallet smoke tests and small-value confirmed mainnet trades.
- [ ] Validate native gas estimation, router ABI compatibility and behaviour against deployed contracts.

## M05 — Pool deep integration (source implemented; security and live tests pending)
- [x] Factory-based pool discovery with paginated, same-block reserve, supply and LP ownership snapshots.
- [x] Bigint math for initial mint, proportional deposits, LP share and min-output withdrawal.
- [x] Create/add and remove liquidity frontend, exact ERC-20/LP allowances, simulation, gas and receipts.
- [x] Review-gated V2 router calldata for token/token and native VERY/token pairs.
- [x] Portfolio LP positions for reviewed pools, plus pool detail pages.
- [x] Raw Mint/Burn/Swap/Sync/Transfer Neon schema and bounded read-only indexer scaffold.
- [x] Unit tests for liquidity math, reviews, approvals, invalid input and ABI availability.
- [ ] Implement, verify and deploy the Milestone 2 factory/router/pairs/WVERY.
- [ ] Independently review supported tokens and the deployed router interface/fees.
- [ ] Test wallet approvals, initial mint, add/remove, partial/full withdrawal and reserve updates against a deployed environment.
- [ ] Run the indexer in an operator-provisioned Neon database and verify reorg/runbook handling.
- [ ] Derive historical LP fees with transfer-aware attribution in Milestone 6; do not invent APR.
- [ ] Audit contracts and complete controlled low-value mainnet verification.

## M06 — Market data and analytics
### 6A — Indexer foundation (source implemented, deployment tests pending)
- [x] Resumable, bounded confirmed-block scanning, cursor-based backfill and factory PairCreated discovery.
- [x] Strict contract/pool provenance validation and decoded Mint/Burn/Swap/Sync/LP Transfer logs.
- [x] Canonical-block hash tracking, ancestor detection, rollback/replay and deep-reorg halt.
- [x] Tests with deterministic block and event fixtures.
- [ ] Execute against verified M02 contracts and real VERY RPC with production monitoring.

### 6B — Durable Neon indexing data (source implemented, operational proof pending)
- [x] Versioned migration for canonical block, factory pair, raw event and normalized market records.
- [x] Atomic commits and per-chain advisory locking with optimistic checkpoint assertion.
- [x] On-chain reserve reconciliation and persisted audit outcomes.
- [x] Historical write schema with cascading fork cleanup and precise NUMERIC amounts.
- [ ] Apply migration to user-approved Neon project and verify concurrent-worker/reorg recovery on real DB.
- [ ] Operationalize metrics and runbooks after contract deployment.

### 6C–6F — Future
- [ ] Verified prices, token-denominated volume, trustworthy TVL, OHLCV and LP fee analytics.
- [ ] Versioned public APIs, history and wallet views.
- [ ] Frontend market charts, trending pools and dashboards.
- [ ] Alerting, production monitoring and independent data-integrity audit.

## M07 — Security readiness (internal hardening and audit handoff; independent audit outstanding)
- [x] Root MIT LICENSE, Solidity MIT SPDX headers, contract provenance and pinned Foundry configuration.
- [x] Original pair/router/factory/wrapped-native experimental Solidity source and fuzz/security/invariant suites.
- [x] Automated Foundry CI and Slither high-severity gate (verify live CI result on PR).
- [x] Threat model, private SECURITY.md reporting, incident response draft, deployment manifest template.
- [x] Internal security finding triage, EOA-transfer hardening, wrapped-token probe and controlled local deployment rehearsal.
- [ ] Full independent external audit of exact frozen deployable code and findings remediation/retest.
- [ ] Verified canonical VERY wrapper, production bytecode, gas/fork tests and deployment documentation.
- [ ] Assign actual multisig signers and validate operational incident drills.
- [ ] Resolve high/critical findings, satisfy independent reviewers and authorize M08 separately.

## M08 — Capped mainnet beta (not launched)

**ROOT PRIORITY:** [18-stage, 90-substep M08 master checklist](../MILESTONE-08.md) · [Engineering runbook](MILESTONE-08-EXECUTION.md). Treat all checked development source items separately from mandatory real-world audit, funding, bytecode and mainnet acceptance.
- [x] Draft detailed 18-stage [mainnet-beta plan](MILESTONE-08.md), external audit brief, wrapped-token inspection and local deployment-style rehearsal tests.
- [ ] Complete independent audit of frozen Solidity source and all high-severity remediation.
- [ ] Confirm chain-operator provenance, bytecode and backing of canonical wrapped VERY.
- [ ] Verify contract source and complete reproducible deployment manifest on VeryScan.
- [ ] Authorize bounded funding and establish multisig responsibilities.
- [ ] Complete fork testing, production incident drills, verified live receipts and Neon reconciliation.
- [ ] Run capped, disclosed liquidity beta after explicit financial and security signoff.
- [ ] Complete full add/swap/remove cycle, validate monitoring and decide M09 launch separately.

## M09 — Public launch
- [ ] Production interface, accessible documentation and monitoring.
- [ ] Publish contract addresses, fees and risks.

## M10–M16 — Expansion
- [ ] Rewards and farming, launchpad, advanced routing, limit orders,
      ecosystem integrations, governance and higher-risk DeFi features.

The exchange must not report fabricated trading volume, liquidity or wallet metrics.
