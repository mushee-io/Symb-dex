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

## M08 — Capped mainnet beta (historical plan, DEFERRED)

**DEFERRED MAINNET REFERENCE:** [18-stage, 90-substep M08 master checklist](../MILESTONE-08.md) · [Engineering runbook](MILESTONE-08-EXECUTION.md). Treat all checked development source items separately from mandatory real-world audit, funding, bytecode and mainnet acceptance.
- [x] Draft detailed 18-stage [mainnet-beta plan](MILESTONE-08.md), external audit brief, wrapped-token inspection and local deployment-style rehearsal tests.
- [ ] Complete independent audit of frozen Solidity source and all high-severity remediation.
- [ ] Confirm chain-operator provenance, bytecode and backing of canonical wrapped VERY.
- [ ] Verify contract source and complete reproducible deployment manifest on VeryScan.
- [ ] Authorize bounded funding and establish multisig responsibilities.
- [ ] Complete fork testing, production incident drills, verified live receipts and Neon reconciliation.
- [ ] Run capped, disclosed liquidity beta after explicit financial and security signoff.
- [ ] Complete full add/swap/remove cycle, validate monitoring and decide M09 launch separately.

## M09 — Real-value public launch (historical plan, DEFERRED)

**Full root master plan:** [MILESTONE-09.md](../MILESTONE-09.md) contains 20 stages and 140 checkable tasks with acceptance and no-go evidence. [Production handover/operations runbook](MILESTONE-09-EXECUTION.md).

- [ ] Close Milestone 8 with real signed audit, canonical WVERY, authorized pool/swap/LP-exit receipts, deployment proof and incident-readiness signoff.
- [ ] Obtain professional UK and served-market financial promotions, cryptoasset-activity, sanctions and privacy legal assessment.
- [ ] Secure official domain, CI/CD, release provenance, contract identity and verified token registry.
- [ ] Complete production swap, liquidity, wallet, portfolio, Neon indexer and analytics proof with real chain receipts.
- [ ] Publish verified source/contracts, risk disclosures, terms, docs, official status/support and incident reporting.
- [ ] Test monitoring, resilience, load, rollback, treasury governance, and lawful community marketing.
- [ ] Obtain independent separate Milestone 9 public launch approval; stage traffic safely with abort criteria.
- [ ] Validate post-launch metrics and publish evidence-based Milestone 10 handover.

No project web or blockchain mainnet trading is represented as live by this roadmap; contract deployment remains blocked by the existing review configuration.

## M10 — CURRENT: Deep Public Testnet (valueless assets only)

**Source delivered for 10.1–10.6:** separate configured-or-disabled network registry, disposable Anvil deployment, synthetic test tokens, capped faucet contracts with optional operator sponsorship, a dedicated testnet wallet and swap execution page, on-chain quote/transaction logic, broadcast verifier and regression tests. **No persistent public devnet or external live test swaps are deployed yet.**

**ROOT MASTER PLAN:** [Milestone 10 — 25 stages / 175 individually checkable tasks](../MILESTONE-10.md). This is the current delivery track, superseding the past M08/M09 mainnet-oriented schedules as active priorities.

- [ ] Verify a genuine VERY testnet (not yet confirmed), or establish a separately identified persistent Lidde EVM developer network with its own chain ID, faucet, RPC and explorer.
- [ ] Deploy original MIT Factory, Pair, Router and test wrapped-native token **to test environment only**, record exact addresses and deployment block.
- [ ] Provide free synthetic tVERY/tUSD/tUSDC/tUSDT/tBTC/tETH assets, testnet wallet onboarding and rate-limited faucets.
- [ ] Make actual demo swaps, route selection, pool creation, deposits, LP ownership and redemptions work with real test-chain receipts.
- [ ] Enable testnet charts, portfolio, markets, Neon indexing and proof-backed user activity.
- [ ] Introduce gated token creator, limit orders, DCA keeper, test farms, quests, referrals and leaderboard campaigns one-by-one after individual test evidence.
- [ ] Provide mobile UI, explorer, documented APIs/SDK, security checks, monitoring and clear network reset announcements.
- [ ] Run phased public user testing and produce honest chain-backed transaction counts (no real-value TVL or airdrop promises).

**Current network status:** No verified public VERY testnet RPC or explorer published. VERY chain 4613 is mainnet, NOT a testnet. Devnet details and demo contract addresses are not yet configured. No real funds required.

## M11 — P0 code implemented; external persistent network still outstanding

The repository now includes testnet LP creation/exit, Neon indexer, restricted RPC/Anvil hosting recipe, read-only receipt explorer and fresh-wallet smoke-test CI. An isolated Neon project with faucet/indexer tables has been created. **Not publicly live yet.** [Operator guide](M11-OPERATIONS.md).

### Next work: persistent public testnet and external-wallet testing

**[Root Milestone 11 checklist](../MILESTONE-11.md): 25 stages, 125 detailed engineering tasks.** The first P0 goals are a persistent isolated chain, explorer, signed gas-sponsored demo faucet, live external-wallet swaps, liquidity pool creation and complete LP exits. Then grow real test-chain analytics, routing, portfolio and optional token creator, non-monetary quests, referrals, SDK and separately gated limit-order/DCA/farm experiments. No real funds and no mainnet activation are included.

## M12 — PLANNED: Advanced DeFi testnet (25 stages / 125 tasks)

**[Root Milestone 12 technical execution plan](../MILESTONE-12.md).** Begin only after a real M11 test network is accessible and external tester swaps/LP exits reconcile. Separate MIT Solidity contracts for module registry, oracle/collateral safety, signed orders, perp margin and liquidators, recurring spot automation, and optional cash-settled options/lending/simulated RWA/vault strategies. Include unified portfolio, scoped bot SDK, test analytics, security invariants and staged user beta.

**Every new module must pass its own signed testnet transaction and technical acceptance gate before being called live.** Mainnet and real funds remain excluded.

## M13–M16 — Later expansion

- [ ] Use actual tester feedback and signed technical evaluations to plan further advanced features; independent real-money/mainnet deployment decisions are outside M10.

The exchange must not report fabricated trading volume, liquidity or wallet metrics.
