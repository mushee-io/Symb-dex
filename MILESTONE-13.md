# LIDDE DEX — MILESTONE 13: DEEP CROSS-MODULE TESTNET INTEGRATION

> **PLANNED, NOT BUILT · TESTNET ONLY · NO REAL FUNDS · ALL ADVANCED MODULES DEFAULT DISABLED.**
>
> M13 integrates the distinct advanced protocols envisioned in [Milestone 12](MILESTONE-12.md) into one test-chain product, with wallet-scoped collateral, safe risk accounting, signed executions, canonical data and real user proof. **Milestone 12 is itself a plan, not a completed advanced protocol**, so no M13 derivatives, options, loans, agent trades or vault funds may be described as operational until implemented and independently evidenced.

**Product direction:** Integrate, not merely decorate: genuine on-chain test settlement, solvency invariants, wallet-controlled authorizations, no fabricated volume/positions, and real LP/position exits. Separate user-value mainnet release and regulatory launch work remain outside this engineering sprint. Keep protections for VERY Mainnet **chain ID 4613** unchanged.

**Start here:** [M11 engineering and operator instructions](docs/M11-OPERATIONS.md) · [M12 advanced build](MILESTONE-12.md) · [M11 master plan](MILESTONE-11.md) · [testnet deployment manifest](config/deployments.testnet.json). M11 local CI, source and separate Neon schema are available, but **no persistent external chain has been proven live** in the last verified repository state.

## 25 stages / 175 detailed acceptance tasks

| Stage | Deep integration workstream | Priority |
|---|---|---|
| **13.1** | M12 handover, deployed feature provenance and release matrix | P0 |
| **13.2** | Unified demo trading account and collateral architecture | P0 |
| **13.3** | Shared margin, health and insolvency risk engine | P0 |
| **13.4** | Oracle verification, price confidence and bounded risk execution | P0 |
| **13.5** | Cross-module atomic clearing, accounting and settlement | P0 |
| **13.6** | Perpetual position lifecycle and multi-market interaction | P1 gated |
| **13.7** | Cross-product liquidation, insurance and bad-debt containment | P1 gated |
| **13.8** | Options collateral, expiry and cross-position payout | P2 experimental |
| **13.9** | Overcollateralized lending integrated with spot and margin | P2 experimental |
| **13.10** | Atomic demo flows: swap-repay, collateral rotation and hedging | P2 gated |
| **13.11** | Signed intent and order-routing gateway | P1 |
| **13.12** | Solver competition, best execution and MEV stress testing | P1 gated |
| **13.13** | DCA, TWAP and safe recurring execution | P1 gated |
| **13.14** | Strategy vaults, rebalance and composable share accounting | P2 experimental |
| **13.15** | AI-agent trading and delegated execution safeguards | P1 gated |
| **13.16** | Synthetic RWA reference instruments with accurate labeling | P2 experimental |
| **13.17** | Token creator, seed liquidity and real market lifecycle | P1 |
| **13.18** | Unified trading terminal, portfolio and account-risk UX | P1 |
| **13.19** | Canonical Neon indexer, cross-module event schema and reorgs | P0 for enabled modules |
| **13.20** | Cross-market analytics, stress tests and observability | P1 |
| **13.21** | Mobile-first advanced trading and transparent risk dialogs | P1 |
| **13.22** | Community campaigns, proof-based quests and anti-sybil integrity | P1 |
| **13.23** | SDK, permissioned agents and third-party integration tests | P1 |
| **13.24** | Cross-module security verification, performance and incident drills | P0 release |
| **13.25** | Integrated alpha/beta release, real tester journeys and M14 charter | P0 release |

## Five delivery phases

**Phase A — Foundation and shared risk:** 13.1–13.5.

**Phase B — Perpetuals, options, lending and composability:** 13.6–13.10.

**Phase C — Orders, solvers, automation, vaults and agents:** 13.11–13.15.

**Phase D — Synthetic RWA, tokens, UX, data and analytics:** 13.16–13.20.

**Phase E — Mobile, community, SDK, security and beta:** 13.21–13.25.

## Non-negotiable release prerequisites

- [ ] **M11 genuinely public:** Outside wallets connect to a separately identified persistent test EVM network, claim valueless assets, swap, create/add liquidity, fully withdraw LP and inspect genuine canonical receipts; funded real mainnet wallets are never used.
- [ ] **M12 physically built:** Solidity implementation and verified test contracts exist for any advanced module proposed for M13; its source hash, ABI, keeper dependencies and risk gate are known and tested.
- [ ] **Shared solvency and oracle invariants:** Every enabled leveraged module uses pinned, valid price rounds, backed collateral and auditable settlement records.
- [ ] **User-controlled execution:** Agents, keepers, order fillers and vault strategies operate under revocable and bounded test-wallet permissions.
- [ ] **Release flags fail closed:** Incomplete modules are OFF and clearly unavailable; a mocked UI cannot count as completed on-chain trade functionality.
- [ ] **Canonical audit trail:** Every material position change, fill, liquidation, LP exit and loan repayment is linked to real test-chain receipts and rebuilt into a consistent Neon ledger.
- [ ] **No real money/marketing claims:** Demo volume and reference USD notional are synthetic; tokens, points, mock RWAs and account balances have no cash or guaranteed reward entitlement.

## Complete 175-task technical execution specification

### 13.1 — M12 handover, deployed feature provenance and release matrix

**Priority:** P0  
**Responsible workstream:** Protocol release owner  
**Current readiness:** M12 modules are planned, not implemented

- [ ] Verify an independently reachable persistent testnet with actual outside-wallet swap, faucet and LP-withdrawal receipts; refuse a local Anvil run as equivalent proof.
- [ ] Inventory the implementation of every M12 Solidity component, app route, worker, ABI, canonical index and operator signer; mark absent modules NOT BUILT.
- [ ] Pin test chain ID and genesis, source SHA, contract codehash, deployment block, module operator and feature flag in a signed evidence matrix.
- [ ] Require one-to-one matches between deployed registry, reviewed source, frontend ABI, indexer codec and per-market release version.
- [ ] Publish separate OFF/READ_ONLY/BETA states for Spot, Perps, Options, Lend, Strategies, RWA, Token Creator and Agents; all new capabilities default OFF.
- [ ] Run complete unit, Foundry fuzz/invariant, ABI compatibility, on-chain smoke and indexer reconciliation for every module proposed for integration.
- [ ] Obtain separate accountable M13 cross-module testnet approval; never treat a Milestone 12 roadmap as evidence of deployment.

**Acceptance evidence:** Written module matrix with chain-specific receipts, proven security gates and disabled missing features.  
**Stop condition:** Feature represented live without executable test-chain code or an actual wallet receipt.

### 13.2 — Unified demo trading account and collateral architecture

**Priority:** P0  
**Responsible workstream:** Account ledger engineer  
**Current readiness:** Design to implement after a real M12 collateral vault exists

- [ ] Design a shared account root that links an EVM signer to separately accounted spot, lending, options, perp and vault subaccounts without sharing signing keys.
- [ ] Track settled free demo collateral, pending deposits, reserved order collateral, initial margin, maintenance margin, borrowed assets, accrued interest and realized PnL independently.
- [ ] Prevent any fake USD, unverified token, or already pledged LP balance from being counted twice as freely spendable collateral.
- [ ] Define isolated margin as the initial enabled mode; introduce cross-margin only after separate audited invariant tests and explicit enabling.
- [ ] Implement noncustodial deposit, withdraw, allocate, release and asset-transfer entry points with exact decimal conversion and zero-address checks.
- [ ] Provide per-operation authorization scopes for wallet, bounded agent, order filler and liquidation contract; forbid operators from arbitrarily spending user assets.
- [ ] Reconcile vault ERC-20 balances and per-account claims under transfers, failed token returns, multiuser settlements and full closure.

**Acceptance evidence:** Account balance sum and collateral-claim invariants hold for two or more independent wallet accounts.  
**Stop condition:** A deposit can fund two positions simultaneously or wallet ownership can be bypassed.

### 13.3 — Shared margin, health and insolvency risk engine

**Priority:** P0  
**Responsible workstream:** Protocol risk engineering  
**Current readiness:** A reference model and actual chain inputs are not yet implemented

- [ ] Implement fixed-point account equity and available collateral reference math for token decimals, maintenance margin and borrowed liabilities.
- [ ] Unify initial/maintenance margin checks across leveraged perps, open orders, lending borrowing and any separately approved options collateral.
- [ ] Apply configurable collateral haircuts, exposure caps, per-market concentration limits, liquidation buffers and maximum-loss assumptions.
- [ ] Compute health using a bounded oracle snapshot at explicit block/round ID and reject stale or inconsistent cross-module observations.
- [ ] Reserve margin atomically at order acceptance, adjust on partial fill and restore after cancellation or expiry without releasing funds twice.
- [ ] Develop independent TypeScript reference calculations and differential tests against Solidity accounting for rounding, fee and funding edge cases.
- [ ] Add cross-product invariant fuzz suites: sum of obligations <= backed collateral plus explicitly bounded bad debt; no negative withdrawable collateral.

**Acceptance evidence:** Fuzz and differential tests confirm account health across mixed demo positions and deposits.  
**Stop condition:** Unsafe cross-margin, negative equity hidden, inaccurate reserved collateral or unbounded synthetic claims.

### 13.4 — Oracle verification, price confidence and bounded risk execution

**Priority:** P0  
**Responsible workstream:** Oracle and market data  
**Current readiness:** M12 oracle-protection architecture remains a proposal

- [ ] Implement a common oracle adapter delivering scaled price, timestamp, signed reporter/source, round ID and confidence data for each sandbox market.
- [ ] Maintain separate simulated index, reference spot, mark, settlement and RWA reference price types; never use one manipulable AMM price as sole liquidation input.
- [ ] Require heartbeat bounds, maximum price deviation, quorum where relevant, reporter rotation and monotonic round sequencing.
- [ ] Stop position opening, liquidation or expiry settlement on invalid, stale, divergent, replayed or future-timestamped observations.
- [ ] Simulate thin-pool manipulation, sudden price gaps, sequencer pause, signer compromise, delayed oracle updates and price-decimal errors.
- [ ] Store the exact oracle snapshot used for each risk-sensitive transaction so later replays can reproduce the decision.
- [ ] Publish an operator-only circuit breaker and clear fallback to CLOSE_ONLY/SETTLEMENT_ONLY when market confidence deteriorates.

**Acceptance evidence:** No stale or spoofed price can authorize an opening, liquidation or option payout; valid fixture rounds succeed.  
**Stop condition:** Conflicting price sources silently accepted or users liquidated by forged AMM prices.

### 13.5 — Cross-module atomic clearing, accounting and settlement

**Priority:** P0  
**Responsible workstream:** Core Solidity clearing  
**Current readiness:** New shared settlement contracts required

- [ ] Define a versioned settlement adapter standard for spot swaps, perps PnL/funding, option payout and lending repayment without granting unlimited spending rights.
- [ ] Apply double-entry event accounting for debits, credits, fees, collateral holds, unsettled obligations and final settlement.
- [ ] Design atomic intent bundles for repay-with-swap and other allowed cross-module flows, reverting on any unfulfilled slippage or margin check.
- [ ] Enforce domain-separated signer nonces, delegated permission limits, expiries, destination restrictions and per-module operator capabilities.
- [ ] Separate synchronous settlement state from optional eventual off-chain notifications, chart updates and quest events.
- [ ] Reconcile actual ERC-20 vault balances to user claims and external protocol obligations on each settlement and at canonical snapshots.
- [ ] Test nested callbacks, reentrancy, duplicate settlement, unordered partial fills, locked funds, gas exhaustion and failing token transfers.

**Acceptance evidence:** Cross-module operations leave no orphan debt or double spend; independent ledger replays match chain state.  
**Stop condition:** Inconsistent token accounting, replayable intent or non-atomic financial state updates.

### 13.6 — Perpetual position lifecycle and multi-market interaction

**Priority:** P1 gated  
**Responsible workstream:** Perp protocol and trading frontend  
**Current readiness:** M12 perps not built or deployed

- [ ] Build a separately versioned perp clearing implementation with isolated test collateral, long/short quantity, entry price, fee basis and funding index.
- [ ] Support open, increase, reduce, partial close, complete close and reverse, with transaction-proofed execution states.
- [ ] Bind orders to approved synthetic tBTC, tETH and tVERY indices, maximum leverage and maximum per-market open interest.
- [ ] Combine risk checks with available vault collateral and pending spot/limit-order reservations before accepting new positions.
- [ ] Maintain deterministic realized/unrealized PnL, entry-price averaging, fee debits and position funding debt after every fill.
- [ ] Develop distinct positions tables and on-chain position event index codecs, with canonical block provenance and clear pending state.
- [ ] Prove with two wallets opening opposed test positions and closing each side, including a risk-triggered rejected trade.

**Acceptance evidence:** Two independent users execute genuine position lifecycle receipts and exact risk-ledger reconciliation.  
**Stop condition:** Cosmetic positions, unsupported unlimited leverage or margin ledger mismatch.

### 13.7 — Cross-product liquidation, insurance and bad-debt containment

**Priority:** P1 gated  
**Responsible workstream:** Risk and liquidator operators  
**Current readiness:** M12 liquidation tooling is only planned

- [ ] Compute liquidation eligibility from a consistent oracle and full account liabilities across enabled perp/lending modules.
- [ ] Implement partial liquidation first where safe, deterministic liquidation penalty caps and maximum close fraction per action.
- [ ] Define simulated insurance reserve, bounded bad-debt queue and bankruptcy/deficit accounting with explicit recapitalization/reset semantics for testnet.
- [ ] Prevent liquidator self-dealing, duplicate liquidation, circular transfer abuse and forced closure of healthy test positions.
- [ ] Run separate keeper bots with disposable keys, nonce locks, canonical event cursors and retry/expiry/reorg recovery.
- [ ] Enable CLOSE_ONLY, STOP_NEW_BORROW and SETTLEMENT_ONLY states without preventing appropriate protected withdrawals.
- [ ] Fuzz underwater exposure, price gaps, oracle downtime, concurrent liquidators and residual dust until invariants are satisfied.

**Acceptance evidence:** Controlled liquidation keeps solvent accounts safe, closes unhealthy ones and tracks unavoidable mock bad debt.  
**Stop condition:** Healthy user forcibly liquidated or vault insolvency hidden by fabricated assets.

### 13.8 — Options collateral, expiry and cross-position payout

**Priority:** P2 experimental  
**Responsible workstream:** Options and settlement engineer  
**Current readiness:** No approved option contract exists

- [ ] Implement only bounded European-style cash-settled demo calls/puts initially, with immutable strike, expiry, size, series and approved index.
- [ ] Reserve seller collateral at entry and enforce maximum option payout exposures without relying on a future mint or solvency promise.
- [ ] Use an authenticated settlement price after expiry with explicit stale/deviation rules and deterministic expiry windows.
- [ ] Support premium transfer, mint/buy/sell/close where defined, automatic exercise eligibility and expired-without-value outcomes.
- [ ] Integrate option liability into the account-risk model without silently netting it against unrelated spot assets.
- [ ] Index series, premiums, collateral, exercise events, settlements and invalid/stale-oracle deferrals into separate canonical tables.
- [ ] Test deep ITM/OTM, expiry boundary, replay, negative payout, operator outage, unequal decimals and mixed short-options/perps risk.

**Acceptance evidence:** Two test wallets settle a fully collateralized demo series with exact payout and no excess token creation.  
**Stop condition:** Uncollateralized option short, unverified settlement source or payout miscalculation.

### 13.9 — Overcollateralized lending integrated with spot and margin

**Priority:** P2 experimental  
**Responsible workstream:** Lending protocol engineer  
**Current readiness:** No M12 lending deployment has been verified

- [ ] Implement test-only lending pools with transparent deposits, receipt shares, borrow balances, supply caps and borrow caps.
- [ ] Use an interest-index accounting model with bounded accrual per step, exact 6/8/18 decimal scaling and no zero-supply interest minting.
- [ ] Enforce health factors and collateral approvals before borrowing, withdrawing or transferring interest-bearing receipts.
- [ ] Allow optional repay-with-spot-swap only through reviewed atomic adapters with expiry and min-out protections.
- [ ] Keep lender claims separate from assets already pledged for perp/option margin and prohibit double-counted pooled collateral.
- [ ] Index borrow/repay/supply/withdraw/liquidation events and calculate loan health against pinned valid oracle rounds.
- [ ] Test withdrawals under utilization, rate spikes, partial repayments, insolvent borrower and supply/borrow cap exhaustion.

**Acceptance evidence:** Demo borrower collateralizes, borrows, partially repays and lender exits with reserve/accounting parity.  
**Stop condition:** Unbacked loan shares, bad interest math or money double-pledged between modules.

### 13.10 — Atomic demo flows: swap-repay, collateral rotation and hedging

**Priority:** P2 gated  
**Responsible workstream:** Protocol composability engineer  
**Current readiness:** Depends on passing spot, vault, perps and lending settlement

- [ ] Design transaction intents for spot-swap-to-repay, close-perp-to-repay, and demo collateral rotation using bounded operators only.
- [ ] Preflight the account state, exact market price snapshot, token approval, slippage bounds and post-transaction solvency.
- [ ] Run multi-step execution through a single reviewed settlement contract whenever atomicity is necessary; never claim atomic UX from separate unconnected clicks.
- [ ] Define transaction deadlines, nonce replay restrictions, partial execution rejection and deterministic refund of unused demo tokens.
- [ ] Measure gas and compare proposed path against separate user transactions while protecting balance and settlement invariants.
- [ ] Emit composability intent IDs with linked constituent contract events for indexer and user activity views.
- [ ] Exercise failed second leg, minOut revert, mid-transaction callbacks, stale oracle, zero liquidity and concurrent account holds.

**Acceptance evidence:** A single valid demo transaction safely rotates collateral and repays a mock loan; failures fully revert.  
**Stop condition:** A multi-leg flow strands liabilities or exposes unbounded router approval.

### 13.11 — Signed intent and order-routing gateway

**Priority:** P1  
**Responsible workstream:** Order execution and security  
**Current readiness:** M12 order book and settlement contracts not yet working

- [ ] Specify versioned EIP-712 orders tied to test chain, clearing contract, market, signer, expiry, nonce, fees, max slippage and exact recipient.
- [ ] Implement cryptographic signature verification, maker cancellation, nonce floor/bitmaps, partial fills and maker balance revalidation.
- [ ] Build bounded order discovery API and persistent order-state engine without taking custody of users' signer keys.
- [ ] Design direct and solver-proposed routes that can be verified against deployed pool/router code and signed constraints.
- [ ] Use a separate on-chain order-settlement contract to process actual fills; mark off-chain order matching as proposals only.
- [ ] Add canonical state transitions: OPEN, PARTIAL, FILLED, CANCELLED, EXPIRED, REJECTED and INDETERMINATE while receipt missing.
- [ ] Fuzz duplicate fill, parallel solver race, forged signature, permit replay, stale gas quote and expired order settlement.

**Acceptance evidence:** Multiple wallets place, fill partially, cancel and expire genuine signed test orders with no replay.  
**Stop condition:** Backend visually fills an order without an immutable settlement event.

### 13.12 — Solver competition, best execution and MEV stress testing

**Priority:** P1 gated  
**Responsible workstream:** Smart routing and solver operators  
**Current readiness:** Requires working order settlement and oracle risk limits

- [ ] Implement competitive demo quote requests across direct AMM routes, bounded multihop and optional cross-module intents.
- [ ] Validate every solver response for signer authorization, replay, path contract codehash, estimated output, gas cost and expiry.
- [ ] Add minimum guaranteed execution, quote age controls, allowed token/pool lists and slippage-limited simulation.
- [ ] Compare best-output and gas-adjusted best-value decisions without claiming guaranteed best prices under volatile reserves.
- [ ] Track solver success/revert, estimated versus received amounts, route provenance and time-to-confirmation in canonical analytics.
- [ ] Run race conditions, sandwich/price-moving fixtures, poisoned solver responses and failing liquidity-provider cases.
- [ ] Expose full user-facing route explanation with fees, impact and alternative quotes; keep solver opt-in until proven safe.

**Acceptance evidence:** Selected solver fills match signed bounds; malicious or expired proposals are rejected on-chain.  
**Stop condition:** Solver can redirect destination tokens or bypass risk/price boundaries.

### 13.13 — DCA, TWAP and safe recurring execution

**Priority:** P1 gated  
**Responsible workstream:** Automation and queue worker  
**Current readiness:** No deployed keeper or reviewed bounded delegation

- [ ] Build demo DCA/TWAP strategies with total budget, interval, max execution count, user-set price limit and expiration.
- [ ] Authorize recurring swaps with revocable bounded smart-account allowances or capped escrow, never raw user private keys.
- [ ] Persist exact job state with a per-intent idempotency key, scheduled timestamp, retry window and chain nonce reservation.
- [ ] Implement a durable keeper worker with limited test-gas budget, pause switch, local outage recovery and on-chain status reconciliation.
- [ ] Stop execution on depleted demo funds, excessive price impact, wrong chain, stale quote or canceled authorization.
- [ ] Provide user-facing execution history, skipped reasons, next attempt and final actual transaction proof.
- [ ] Load-test duplicate cron ticks, independent keeper instances, queue replay, missed blocks and partial budget exhaustion.

**Acceptance evidence:** An authorized plan executes multiple test-chain transactions, survives restart and cannot exceed its budget.  
**Stop condition:** Unbounded delegated spending, fake completed recurrences or unstoppable keeper.

### 13.14 — Strategy vaults, rebalance and composable share accounting

**Priority:** P2 experimental  
**Responsible workstream:** Vault and portfolio engineer  
**Current readiness:** Depends on approved spot, collateral and keeper adapters

- [ ] Prototype valueless token vault shares with explicitly scoped strategies and immutable withdrawal/asset-accounting semantics.
- [ ] Use independent vault ledgers to separate user deposits, managed collateral, pending orders, strategy PnL and platform fees.
- [ ] Implement bounded rebalances among reviewed test pools with max slippage, allocation caps, stop-loss/stop-activity controls and oracle checks.
- [ ] Design event-driven share valuation that subtracts debts and pending liabilities rather than counting gross strategy positions as assets.
- [ ] Provide deposit, withdraw, partial exit and emergency exit, with honest warnings for illiquid or unsettled positions.
- [ ] Prevent recursively nested vault collateral, debt double-counting, donation/manipulation attacks and unfair share-mint prices.
- [ ] Validate two-user contribution/withdrawal sequences, high volatility, keeper outage, missed orders and liquidation losses.

**Acceptance evidence:** Users receive accurately backed test vault shares and can redeem allowed value without accounting drift.  
**Stop condition:** Unbacked shares, vault drain or promises of real strategy returns.

### 13.15 — AI-agent trading and delegated execution safeguards

**Priority:** P1 gated  
**Responsible workstream:** Agent execution engineering  
**Current readiness:** M12 agents are planned; existing code has no live user delegation

- [ ] Provide separate agent keys with tightly scoped per-market, per-asset, per-day, per-tx and total spend limits.
- [ ] Require explicit signed user delegation identifying allowed actions, expiry, maximum notional, recipient and revocation nonce.
- [ ] Run agent simulation and risk preflight against verified test-chain state before submitting a new on-chain trade.
- [ ] Prevent any agent from holding a human wallet's seed phrase, owner private key, unbounded allowances or general contract admin credentials.
- [ ] Build agent execution logs linking recommendation, constraints, approval, tx hash, chain status and realized simulated outcome.
- [ ] Support cancellation, global pause, user revoke, compromised agent-key quarantine and signed security incident alerts.
- [ ] Test prompt-injection input, malicious route suggestion, fake oracle, over-budget execution, repeated job and signer role confusion.

**Acceptance evidence:** A delegated agent performs a capped demo swap and immediately loses ability to act after on-chain revocation.  
**Stop condition:** Agent can bypass user budget, redirect recipient or sign on mainnet.

### 13.16 — Synthetic RWA reference instruments with accurate labeling

**Priority:** P2 experimental  
**Responsible workstream:** Demo markets/data provenance  
**Current readiness:** No claim to real securities, issuer redemption or backing is permitted

- [ ] Define mock stock, commodity or other off-chain reference assets as valueless demonstration instruments with unique synthetic identifiers.
- [ ] Record simulated data provider, update timestamp, decimals, scenario label, price confidence and market closure conditions.
- [ ] Separate synthetic-reference price feeds from live tokenized-security ownership or real issuer collateral; no legal entitlement conveyed.
- [ ] Set risk limits, expiry/settlement rules and price-discontinuity circuit breakers for mock RWA trades.
- [ ] Build market descriptions distinguishing synthetic reference from real equity or commodity ownership with no redemption mechanism.
- [ ] Connect enabled RWA demo positions to collateral, oracle and portfolio ledger only after fresh signed test prices and risk proof.
- [ ] Test stale session prices, stock split simulation, trading pause, weekend gaps, invalid symbol and feed spoofing.

**Acceptance evidence:** Test user can trade a clearly fake reference instrument with risk-bounded receipts and consistent valuation.  
**Stop condition:** Mock instruments presented as actual shares, redeemable securities or guaranteed issuer backing.

### 13.17 — Token creator, seed liquidity and real market lifecycle

**Priority:** P1  
**Responsible workstream:** Token launch/tooling  
**Current readiness:** M11 supports liquidity with seeded synthetic tokens; public token-creator expansion is planned

- [ ] Implement valueless custom ERC20 creator factory with metadata validation, verified templates and bounded test token mint authorities.
- [ ] Enable one-click pool creation and first LP deposit using actual verified Factory/Router addresses and zero-value demo asset pairings.
- [ ] Disclose initial price formation, locked minimum LP shares, mint privileges and unverified custom token status before signature.
- [ ] Introduce token/pool lifecycle and governance flags: CREATED, REVIEWED_TEST, SUSPENDED_UI and RETIRED with immutable explorer audit trail.
- [ ] Apply rate limits and malformed-token simulation against symbol impersonation, tax/rebasing, transfer hook and creator-spam exploits.
- [ ] Provide demo creator dashboard for supply, holders, pool reserves, real test-chain trades, LP creation and withdrawal transactions.
- [ ] Test creator mint cap, failed deployment reversion, price manipulation, exit liquidity and directory visibility after resets.

**Acceptance evidence:** An external tester deploys fake-value token, creates a pool, trades it and withdraws LP from real sandbox receipts.  
**Stop condition:** Custom asset silently treated as reviewed or fundraising requires real funds.

### 13.18 — Unified trading terminal, portfolio and account-risk UX

**Priority:** P1  
**Responsible workstream:** Product/frontend engineering  
**Current readiness:** Existing testnet spot and LP pages are source-based; no unified advanced terminal deployed

- [ ] Create navigation tabs for Spot, Perps, Options, Lend, Vaults, RWA and Agent Activity, showing UNAVAILABLE until real approved contracts exist.
- [ ] Display native test balance, spot holdings, LP assets, posted collateral, outstanding debts, PnL and health in a single wallet-aware dashboard.
- [ ] Make price impact, leverage, liquidation price, expiry, interest and risk constraints understandable at signing time.
- [ ] Track pending/confirmed/reverted/replaced and unknown transactions separately for each module, linking canonical tx receipts.
- [ ] Use accurate symbol/decimals and explain synthetic-only values; avoid presenting made-up dollar balances or real-yield charts.
- [ ] Preserve accessibility, keyboard navigation, mobile responsiveness, wrong-network warnings and account switching.
- [ ] Test contradictory market statuses, uninitialized modules, indexer lag, wallet disconnect and risk engine outage.

**Acceptance evidence:** Users see accurate cross-module balances and can only sign transactions for enabled verified contracts.  
**Stop condition:** Invisible account obligations, fabricated health status or clickable unfinished financial action.

### 13.19 — Canonical Neon indexer, cross-module event schema and reorgs

**Priority:** P0 for enabled modules  
**Responsible workstream:** Data/indexer operations  
**Current readiness:** Neon isolated M11 schema exists; advanced module codecs not implemented

- [ ] Introduce versioned module event schemas for vault deposits, position changes, funding, liquidation, order fill, loan and options settlement.
- [ ] Scope every event by chain ID, genesis/registry version, contract address, tx hash, log index, block hash and canonical-confirmed status.
- [ ] Use idempotent ingestion, bounded backfill, atomic checkpoints and safe rollback/replay after test-chain reorganization or reset.
- [ ] Maintain reference position ledger rebuilt from chain events independently of frontend or optimistic wallet cache.
- [ ] Reconcile indexer per-account collateral, open positions, loan shares, reserves and token balances against on-chain reads at a pinned block.
- [ ] Expose read-only, paginated, rate-limited APIs with `indexedThroughBlock`, `confirmed`, schemaVersion and data-quality flags.
- [ ] Test worker crash, duplicate log deliveries, multi-event settlement, removed blocks, contract migration and two concurrent worker elections.

**Acceptance evidence:** Historical ledger rebuilt from canonical events exactly matches on-chain account/accounting state across restart/reorg.  
**Stop condition:** Wrong-chain data mixed, duplicate volume, stale risk numbers presented as final.

### 13.20 — Cross-market analytics, stress tests and observability

**Priority:** P1  
**Responsible workstream:** Quant/data engineering  
**Current readiness:** Market chart source and scorecard exist, advanced analytics need real transactions

- [ ] Calculate actual test-chain fills, spreads, slippage, gas costs, liquidations, utilization and funding from canonical receipts.
- [ ] Provide simulated exposure, leverage, liquidation distance, concentration and collateral utilization with price-round provenance.
- [ ] Build deterministic replay and backtests using recorded synthetic scenarios rather than invented historical real-market performance.
- [ ] Track per-module maker/taker fills, failed orders, keeper uptime, missed collateral checks and protocol accounting divergence.
- [ ] Distinguish activity counts from fake-value token notional, show unpriced assets as unavailable and label all simulated US-dollar references.
- [ ] Create health dashboards that combine RPC head, chain checkpoints, oracle ages, solver success, keeper queue and reserve invariants.
- [ ] Run stress scenarios for liquidity drought, correlated price gaps, oracle loss, full keeper outage and sudden testnet reset.

**Acceptance evidence:** Market/risk analytics reconcile to canonical event and oracle records; incident monitors trigger in controlled tests.  
**Stop condition:** Invented real volume, fake APY, unbounded latency or stale portfolio risk displayed as current.

### 13.21 — Mobile-first advanced trading and transparent risk dialogs

**Priority:** P1  
**Responsible workstream:** Mobile/frontend QA  
**Current readiness:** Mobile advanced routes are planned and must not expose disabled contracts

- [ ] Optimize spot/perp/order/portfolio screens for small viewports with accessible token, quantity, price and slippage inputs.
- [ ] Support injected/mobile EVM wallet and configured WalletConnect without requesting or hosting user seed phrases.
- [ ] Display clear leverage risk, simulated margin requirement, liquidation price, oracle age and token approval spender before each signature.
- [ ] Handle wallet app background/resume, wrong chain, changed account, stale quote, rejected signature and receipt timeout.
- [ ] Enable transaction recovery with explorer link, last signed hash and explicit confirmation state after reconnect.
- [ ] Optional messaging mini-app must verify provider signatures/session binding and delegate signing to a user-controlled wallet.
- [ ] Conduct iOS/Android external-wallet tests across swap, LP exit, order placement, demo perp open/close and agent revocation when implemented.

**Acceptance evidence:** Two real devices complete enabled testnet flows with consistent status and no hidden approvals.  
**Stop condition:** Mobile UI masks financial risk, redirects to mainnet or falsely reports a confirmed trade.

### 13.22 — Community campaigns, proof-based quests and anti-sybil integrity

**Priority:** P1  
**Responsible workstream:** Community/product analytics  
**Current readiness:** Quest/referral/season system not live

- [ ] Define test missions across faucet, spot swap, LP exit, risk simulation, order cancellation and bounded agent use.
- [ ] Credit points only from canonical confirmed chain events using unique event IDs and chain-specific season contracts or ledger rules.
- [ ] Separate actual independent wallet activity from infrastructure bots, test fixtures and self-farmed wash trades.
- [ ] Implement meaningful eligibility thresholds, daily budgets, referral qualification and deterministic appeals/corrections.
- [ ] Build privacy-conscious score views and opt-in handles without publishing unnecessary wallet-to-person linkage.
- [ ] Reconcile points after chain reset/reorg, market cancellation, invalidated orders and exploit-related event reversals.
- [ ] State plainly that all points are nontransferable/noncash and do not guarantee any later token, retrodrop or payment.

**Acceptance evidence:** Quest and leaderboard results survive replay without duplicate credit or promised monetary rewards.  
**Stop condition:** User engagement figures fabricated or bots monopolize unrestricted test rewards.

### 13.23 — SDK, permissioned agents and third-party integration tests

**Priority:** P1  
**Responsible workstream:** Developer platform engineering  
**Current readiness:** Existing testnet SDK is planned; no production agent API

- [ ] Publish typed packages for network provenance, module registry, pool/risk reads, wallet simulation, EIP-712 order signing and position settlement.
- [ ] Version Solidity ABIs, EIP-712 domains and API schemas with strict compatibility checks against deployed module manifests.
- [ ] Provide sample wallet-owned test bot: quote → simulate → sign bounded request → observe receipt → reconcile account state.
- [ ] Separate read-only public endpoints from signed user actions; rate-limit order submissions and reject non-test chain IDs.
- [ ] Implement scoped agent delegation SDK with locally controlled signing keys and testnet-only permissions/revocation.
- [ ] Provide sandbox fixtures, network reset notices, developer status API and reproducible explorer links.
- [ ] Run compatibility tests for wrong-chain provider, stale ABI, malicious marketplace route, expired delegation, browser/mobile wallet and replay.

**Acceptance evidence:** Independent developer completes a real sandbox order or spot trade through SDK without platform custody of keys.  
**Stop condition:** SDK signs uncontrolled transactions or uses a different contract version from the verified test chain.

### 13.24 — Cross-module security verification, performance and incident drills

**Priority:** P0 release  
**Responsible workstream:** Security/reliability engineering  
**Current readiness:** Standalone M11 CI exists; module-level and cross-module audits are not complete

- [ ] Run Foundry invariant/fuzz suites on account solvency, vault shares, liabilities, liquidation accounting, oracle replay and LP redemption.
- [ ] Test end-to-end cases across spot-perp-lending-option adapters with hostile callbacks, overflows, reentrancy and wrong-decimal assets.
- [ ] Threat-model agent delegation, relayer fills, keeper credentials, token creator privileges, admin circuit breakers and Neon worker reorgs.
- [ ] Apply static analysis, dependency scanning, external review of high-risk code and remediation documentation before enabling financial test flows.
- [ ] Load-test RPC latency, quote freshness, position updates, order matching, sponsored faucet and indexer backlog across concurrent wallets.
- [ ] Rehearse signer compromise, persistent node outage, stale oracle, mistaken deployment registry, corrupt indexer state and testnet reset.
- [ ] Demonstrate deterministic safe-mode operation, independently attributable release decision and recovery without suppressing user withdrawals.

**Acceptance evidence:** Security and reliability matrix passes with no unresolved high-impact cross-module failure for enabled test modules.  
**Stop condition:** Collateral insolvency, unsafe liquidation, signature replay, key compromise or deceptive readiness claims.

### 13.25 — Integrated alpha/beta release, real tester journeys and M14 charter

**Priority:** P0 release  
**Responsible workstream:** Product release manager  
**Current readiness:** M13 integration planned, not yet deployed or user-verified

- [ ] Invite successive internal, independent alpha and opt-in public beta cohorts only after real M11/M12 dependencies and test deployments pass.
- [ ] Run an outside-wallet test script for faucet → spot trade → create/add/exit LP → deposit demo collateral → open/close demo position → repay/settle as modules are enabled.
- [ ] Record authentic chain hashes, gas, actual token deltas, risk-ledger reconciliation, failed transactions and time-to-completion for each user flow.
- [ ] Measure independently active users and retention separately from bots/test harnesses; distinguish fake-value notionals from real trading volumes.
- [ ] Review adverse risk scenarios, liquidations, keeper downtime, mobile signing, user-reported bugs and protocol reserve parity.
- [ ] Document per-module RELEASED_TEST / BETA / OFF decisions, unresolved technical debt and measurable infrastructure operating budgets.
- [ ] Publish a signed M13 testnet integration report and a scoped M14 roadmap, without automatically authorizing real-value mainnet deployment.

**Acceptance evidence:** Multiple independent outside users exercise all enabled cross-module functions and fully exit valueless positions with reproducible receipts.  
**Stop condition:** Public statements suggest unbuilt derivatives, unverifiable receipts or real-asset custody.

## Build order and go/no-go decisions

**Gate 1 / Essential integration (P0):** complete external M11 testnet and selected M12 code first; implement M13.1–M13.5, M13.19 and M13.24. Do not connect real users to a shared collateral engine until deposit/withdraw/account solvency invariants pass.

**Gate 2 / Trading beta (P1):** integrate M13.6–M13.7 (perps + liquidation) then 13.11–13.12 (orders + routing) with true on-chain fills and constrained oracle/keeper budgets. M13.13 (DCA), 13.15 (agents), 13.17 (token creator), 13.18 (terminal), 13.20 (analytics) and 13.23 (SDK) follow individually proven dependencies.

**Gate 3 / Separate experimental markets (P2):** enable M13.8–13.10 (options/lending/composition), 13.14 (strategy vaults), 13.16 (mock RWA) only after bounded, independently validated contract and event accounting evidence. Never label P2 modules available by default.

**Gate 4 / User release:** mobile M13.21 and community M13.22 after verified interface/data; M13.25 may admit external users only into individually completed modules and must publish actual receipts and failures.

## Real user integration test: one accountable ledger

1. **Connect** an external wallet to authenticated test EVM chain (not VERY Mainnet 4613), get *free* faucet assets and verify transaction.
2. **Spot & LP:** execute demo token swap, create/add/remove LP and observe correct canonical wallet and reserve history.
3. **Account:** deposit mock collateral into the separately deployed vault, read available/reserved/posted amounts and confirm live on-chain balance parity.
4. **Risk-controlled positions:** when enabled, place signed test order, open/resize/close synthetic perp, view funding and test PnL, confirm margin restrictions.
5. **Composability:** when implemented, repay a test loan through an atomic spot swap; a deliberately failing second leg must roll back the entire settlement.
6. **Revocable agent:** authorize a narrowly bounded agent to submit one permitted test order, then revoke and prove further use fails.
7. **Stress:** replay stale oracle, keeper outage, reorg, unexpected token and liquidity-drain scenarios with expected safe-mode behavior.
8. **Audit and exit:** verify every event/position/debt and free-collateral withdrawal from chain and Neon with no unresolved mock liabilities.

## Acceptance scorecard

| Gate | Required real evidence | If not met |
|---|---|---|
| Network | Hosted distinct test-chain RPC/explorer, persistent state and outside-wallet receipts | NO PUBLIC TESTNET |
| Solidity | Deployed module source/codehash/ABI and exhaustive Foundry tests | MODULE OFF |
| Accounting | 1:1 token backing, exact reserve/position/fee/debt reconciliation | NEW ACTIONS STOPPED |
| Oracle and margin | Stale/manipulation tests and proper account health boundaries | LEVERAGE OFF |
| Solvers, keepers, agents | Signed, bounded, revocable, replay-safe execution receipts | AUTOMATION OFF |
| Data and UX | Canonical event replay, correct wallet history, truthful unavailable states | DERIVED DATA HIDDEN |
| Community | Points/leaderboards based on unique confirmed demo-chain activity | REWARDS OFF |
| Release | Independent tester journeys, incident drills, module-by-module signed decisions | NO ADVANCED BETA CLAIM |

## Repository architecture additions (proposed, not implemented by writing this file)

```text
contracts/src/advanced/
  AccountLedger.sol             # test collateral vs reserved/posted/debt
  RiskEngineV2.sol              # fixed-point margin + health + exposures
  ClearingAdapterRegistry.sol   # allowlisted per-module settlement
  BundleSettlement.sol          # atomic swap-repay/position intents
  OracleConfidenceGuard.sol     # price freshness, rounds and deviation bounds
  KeeperPermissions.sol         # scoped signed automation / agent limits
  DemoPerpSettlement.sol        # separate, only after M12 contract reviewed
  DemoOptionSettlement.sol      # optional gated P2
  DemoLendingAdapter.sol        # optional gated P2
services/m13/
  orderbook/  keeper/  solver/  oracles/  risk-monitor/
services/indexer/
  advanced-accounting/          # canonical cross-module codecs and reconciliation
app/testnet/
  terminal/  orders/  positions/  risk/  strategies/  agents/
lib/testnet/m13/
  account-math/  order-typing/  oracle-confidence/
tests/m13/
  account-invariant/  integration/  wrong-chain/  attack-cases/
docs/M13-RELEASE-REPORT.md      # future actual evidence, not pre-populated
```

## Final definition of done

Milestone 13 is considered **integrated** only when source, deployed demo-chain contracts, independent tests, exact accounting and **multiple outside-wallet receipts** exist for each module declared enabled. Feature completeness is *per module*, not an all-or-nothing claim: incomplete derivatives/lending/RWA/AI-agent work remains disabled. A public release may show working testnet Spot while higher-risk modules are still planned. **No mainnet or real-money launch is authorized by this roadmap.**
