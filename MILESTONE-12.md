# Symb DEX — Milestone 12: Advanced DeFi Testnet Execution Roadmap

> **PLANNED, NOT BUILT. TESTNET ONLY. NO REAL ASSETS OR GUARANTEED REWARDS.** M11 local Solidity/Anvil plus Neon integration and testnet LP functionality are merged, but its persistent external public chain, hosted RPC, publicly funded faucet and independently validated external-wallet transactions were not confirmed when this plan was written. M12 work must not be represented as live functionality until deployment and acceptance evidence exists.

**Milestone objective:** Expand the proven test spot AMM into a modular non-custodial advanced *test* exchange: signed limit orders, perpetual positions, liquidations, optional options, lending, portfolio risk, mock RWA reference markets, bounded automated strategies, developer agents and verifiable analytics. All leveraged protocols are isolated, activated independently, and never connected to the VERY Mainnet chain 4613.

**Start from:** [Milestone 11](MILESTONE-11.md) · [M11 operator handover](docs/M11-OPERATIONS.md) · [Testnet LP interface](app/testnet/pools/page.tsx) · [Real testnet deployment path](infra/devnet/README.md). Existing MIT code and local CI are foundations, not proof of public operation.

## Milestone 12 — 25 workstreams and 125 granular engineering tasks

| Stage | Scope | Priority |
|---|---|---|
| 12.1 | M11 acceptance, network provenance and feature gates | P0 |
| 12.2 | Modular Solidity architecture and on-chain registry | P0 |
| 12.3 | Markets, token metadata and realistic sandbox environments | P0 |
| 12.4 | Oracle routing, confidence bounds and manipulation defenses | P0 |
| 12.5 | Collateral vaults, account balances and testnet risk ledger | P0 |
| 12.6 | Perpetual futures core: positions and market lifecycle | P1 gated |
| 12.7 | Margin engine, account health and liquidation rules | P0 for perps |
| 12.8 | Funding, mark pricing and perpetual fee accounting | P1 gated |
| 12.9 | Signed order book and executable limit orders | P1 gated |
| 12.10 | Liquidator bots, keeper network and circuit breakers | P1 gated |
| 12.11 | European-style cash-settled test options | P2 experimental |
| 12.12 | Overcollateralized lending and interest-bearing receipts | P2 experimental |
| 12.13 | Lending liquidations and bad-debt containment | P2 experimental |
| 12.14 | Advanced spot orders: DCA, TWAP and scheduled execution | P1 |
| 12.15 | Advanced routing, protected execution and liquidity efficiency | P1 |
| 12.16 | Unified portfolio, positions and risk dashboard | P1 |
| 12.17 | Simulated RWA markets and proof-based asset labeling | P2 experimental |
| 12.18 | Strategy vaults and programmable portfolio rebalancing | P2 experimental |
| 12.19 | Permissioned agent execution, developer APIs and automation | P1 |
| 12.20 | Token launchpad, new-market seeding and guarded listings | P1 |
| 12.21 | Campaigns, quest proofs, test incentives and ranking integrity | P1 |
| 12.22 | Historical analytics, backtesting and observability | P1 |
| 12.23 | Mobile trading workstation and optional messaging access | P1 |
| 12.24 | Adversarial security programme and invariant verification | P0 for every module |
| 12.25 | Gated advanced testnet beta, KPIs and Milestone 13 handoff | P0 release |

## Implementation phases and gates

**Phase A — Foundation, collateral and oracle protections:** 12.1–12.5.

**Phase B — Perpetuals, order settlement and liquidator automation:** 12.6–12.10.

**Phase C — Options, lending and advanced spot automation:** 12.11–12.15.

**Phase D — Portfolio, simulated RWAs and programmable strategies:** 12.16–12.20.

**Phase E — Engagement, analytics, security and gated beta:** 12.21–12.25.

**P0 (mandatory):** M11 external-testnet acceptance, module configuration, token/oracle/collateral safety, accounting integrity, security, test-run evidence.

**P1 (incremental modules):** order book, test perps, automations, cross-module portfolio, execution routing, market creation, agents and analytics. Each module begins disabled and becomes usable only after its own security and test-chain proof.

**P2 (separate experiments):** test options, lending/bad-debt handling, RWA simulation and vault strategies. No implied backing, actual financial yield, or real-world assets.

## Full engineering specification

### 12.1 — M11 acceptance, network provenance and feature gates

**Priority:** P0 · **Owner/workstream:** Foundation · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Require an externally reachable independent EVM testnet with pinned chain ID/genesis, HTTPS RPC, code-verified contracts and explorer receipts; do not substitute local CI activity.
- [ ] Confirm zero-gas users can claim free test assets, swap, create/add liquidity and fully redeem LP from external wallets without developer intervention.
- [ ] Collect deployment manifest, source commit, verified Solidity bytecode hashes, chain reset version and indexer block-height parity.
- [ ] Create separate deployment manifests and runtime feature flags for spot, perps, options, lending, RWA simulation, vaults and agents; default every new module off.
- [ ] Publish a module-level readiness matrix, emergency-disable conditions and release owner; preserve very-mainnet 4613 write locks.

**Acceptance evidence:** External tester receipts and reproducible M11 P0 signoff; M12 new contracts cannot execute by default.


### 12.2 — Modular Solidity architecture and on-chain registry

**Priority:** P0 · **Owner/workstream:** Core protocol · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Define separate MIT Solidity contract packages for SpotAdapter, MarginVault, PerpClearing, OracleGuard, LendingPool, OptionsEngine, TestRWAIssuer and KeeperRegistry.
- [ ] Build a chain-specific, versioned module registry with authorized operator roles, explicit activation flags and immutable implementation identifiers.
- [ ] Separate user asset ownership and authorization from indexer, frontend, relayer, cron scheduler and AI agent privileges.
- [ ] Develop upgrade/migration boundaries for test deployments; do not describe redeployment of immutable contracts as an upgrade.
- [ ] Generate ABI artifacts, TypeScript clients, source hashes and Foundry deployment scripts with fail-closed checks for real-value chains.

**Acceptance evidence:** Each module can be deployed, read, activated and disabled independently on the isolated testnet; other modules remain unaffected.


### 12.3 — Markets, token metadata and realistic sandbox environments

**Priority:** P0 · **Owner/workstream:** Market configuration · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Register verified synthetic pairs (tBTC/tUSD, tETH/tUSD, tVERY/tUSD) with tick sizes, lot sizes, precision, margin modes and contract-specific risk parameters.
- [ ] Separate reviewed demo assets from user-created tokens and simulated index/RWA instruments; never imply redemption against actual assets.
- [ ] Implement market activation, pause, settlement-only and retirement lifecycle states with recorded operator changes.
- [ ] Create market-fixture feeds and replayable price/volatility scenarios, distinguishing synthetic test reference prices from actual oracles.
- [ ] Build a market registry read API with immutable chain/contract provenance, current flags, fee schedules and risk limits.

**Acceptance evidence:** Market state is deterministic and readable across API, UI and Solidity, with no live trading when a market is paused.


### 12.4 — Oracle routing, confidence bounds and manipulation defenses

**Priority:** P0 · **Owner/workstream:** Risk infrastructure · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Create an IPriceOracle interface supporting timestamp, round ID, price, scale and source provenance, with optional signed test price reporters.
- [ ] Validate staleness limits, decimals, feed quorum, monotonic rounds, maximum deviation and heartbeat timeouts before settlement.
- [ ] Separate spot AMM prices, mark prices, index prices and simulated RWA reference prices to avoid circular reliance on thin pools.
- [ ] Add circuit breakers, capped fallback mode and halt-on-unknown rules when feeds diverge, become stale or vanish.
- [ ] Test flash-liquidity manipulation, outlier updates, sequencer pauses, delayed keeper messages and replayed signed prices.

**Acceptance evidence:** Stale, spoofed or divergent oracle input cannot authorize new leverage, liquidation or options exercise.


### 12.5 — Collateral vaults, account balances and testnet risk ledger

**Priority:** P0 · **Owner/workstream:** Collateral · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Implement noncustodial Solidity vault deposits/withdrawals of reviewed valueless test collateral with precise ERC-20 decimals.
- [ ] Separate available, reserved, posted initial margin, maintenance margin and unsettled PnL in an event-replayable ledger.
- [ ] Create isolated-margin subaccounts and prepare (but do not enable by default) cross-margin accounts that require independent invariants.
- [ ] Enforce account debt, open-order holds, collateral haircuts, withdrawal buffer and locked settlement funds before withdrawals.
- [ ] Fuzz deposits, withdrawals, token transfer failure, decimal extremes, liquidation timing, fee debits and account insolvency.

**Acceptance evidence:** Every deposited test token is traceable and withdrawals are blocked when risk requirements cannot be satisfied.


### 12.6 — Perpetual futures core: positions and market lifecycle

**Priority:** P1 gated · **Owner/workstream:** Perpetuals · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Deploy a separate test-only perpetual clearing engine with long/short exposure, bounded leverage, isolated initial margin and position size caps.
- [ ] Support opening, increasing, reducing, closing and reversing positions with signed or on-chain trade authorization.
- [ ] Store entry price, signed position quantity, margin, realized/unrealized test PnL, fees, funding debt and liquidation status.
- [ ] Enforce position caps, open-interest caps, per-market circuit breakers, no new exposure during oracle failure and minimum order notional.
- [ ] Test two-sided trade matching, multiple fills, partial closing, flip trades, residual dust and no-negative-balance invariants.

**Acceptance evidence:** Two test wallets open opposing positions, resize and close with genuine clearing-contract events and accurate PnL.


### 12.7 — Margin engine, account health and liquidation rules

**Priority:** P0 for perps · **Owner/workstream:** Derivatives safety · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Define initial and maintenance margin formulas, loss caps, collateral haircuts and tiered risk limits in exact fixed-point arithmetic.
- [ ] Compute portfolio/account equity, reserved orders, liquidation thresholds and risk checks at pinned oracle prices.
- [ ] Implement partial liquidation, then full liquidation only when needed, with capped liquidator incentive and clear account state transitions.
- [ ] Prevent self-liquidation reward abuse, partial-liquidation looping, underwater account withdrawals and oracle-triggered wrongful liquidation.
- [ ] Add Foundry invariant tests and scenario tests for price gaps, fees, funding drift, high leverage and concurrent open orders.

**Acceptance evidence:** Unhealthy test accounts are liquidated according to published deterministic formulas; healthy accounts cannot be liquidated.


### 12.8 — Funding, mark pricing and perpetual fee accounting

**Priority:** P1 gated · **Owner/workstream:** Derivatives settlement · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Design capped and time-bounded test funding rates using mark-index premium and independently verified update cadence.
- [ ] Accrue funding fairly across active positions without rounding-based interest creation or resetting debt during partial fills.
- [ ] Track opening/closing, maker/taker, settlement and liquidation fees separately using explicit event types.
- [ ] Publish realized versus unrealized PnL and funding history with correct signs, scales and settlement accounting.
- [ ] Replay historical trades/funding events through a reference math implementation and compare to Solidity balances.

**Acceptance evidence:** Funding and fee ledgers net correctly across counterparties and market snapshots with bounded rounding differences.


### 12.9 — Signed order book and executable limit orders

**Priority:** P1 gated · **Owner/workstream:** Execution · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Use EIP-712 typed orders bound to test chain, clearing contract, maker, market, nonce, quantity, price, expiry and side.
- [ ] Maintain an off-chain order discovery book with matching-price/time rules but enforce all financial settlement on-chain.
- [ ] Support maker cancel, partial fill, full fill, expiry, sequence IDs and deterministic replay protection.
- [ ] Run bounded relayer/filler services with test-only gas budgets, order-signature verification and duplicate-fill prevention.
- [ ] Test wash-order spam, invalid maker allowance, stale quotes, replayed signatures, colliding fills and unfillable markets.

**Acceptance evidence:** External wallets can place, cancel and partially fill limits; every fill has an actual chain settlement receipt.


### 12.10 — Liquidator bots, keeper network and circuit breakers

**Priority:** P1 gated · **Owner/workstream:** Operations · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Run a worker that reads confirmed account health and submits bounded liquidation transactions with test-only funds.
- [ ] Use idempotent job IDs, chain-specific key custody, nonce queues, RPC retry and reorg-safe confirmation tracking.
- [ ] Provide permissionless liquidator interfaces where practical and a separate controlled keeper allowlist during alpha.
- [ ] Build emergency pause for new orders/leverage while preserving appropriately reviewed withdrawals and settlement paths.
- [ ] Load-test keeper outage, competing liquidators, stale price feeds, chain reset and gas spikes under realistic replay fixtures.

**Acceptance evidence:** At least two independent keepers can recover from restart and liquidate a controlled unhealthy test position without duplicate settlement.


### 12.11 — European-style cash-settled test options

**Priority:** P2 experimental · **Owner/workstream:** Options · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Implement a standalone test-only options engine for calls/puts with expiry, strike, contract size, collateralization and payout bounds.
- [ ] Choose a well-defined European exercise/settlement model rather than claiming support for arbitrary American exercise.
- [ ] Set premiums through an explicit quote/oracle/auction design; mark pricing as synthetic and expose confidence limits.
- [ ] Reserve collateral or margin at issuance; handle writer obligations, expiry, settlement, cancellation and dust.
- [ ] Fuzz options payout extremes, stale settlement prices, simultaneous expiry, undercollateralized writers and claim replay.

**Acceptance evidence:** A tester writes, buys and settles an option with actual test tokens; payoffs match the specified bounded formula.


### 12.12 — Overcollateralized lending and interest-bearing receipts

**Priority:** P2 experimental · **Owner/workstream:** Lending · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Create isolated lending markets for reviewed demo ERC-20s with supply, borrow, repay, withdraw and collateral enable/disable calls.
- [ ] Implement utilization-dependent test interest accrual, cash/debt accounting, share receipts and reserve factors with fixed-point math.
- [ ] Require oracle-tested collateral values, loan-to-value ratios, liquidation thresholds and borrow caps for each market.
- [ ] Track borrower health and enforce atomic health checks during borrow, withdraw and collateral transfer actions.
- [ ] Test first-depositor inflation, interest rounding, reserve depletion, repayment dust, malicious ERC-20 behavior and bad debt.

**Acceptance evidence:** Multiple demo wallets lend, borrow, repay and withdraw with correct share balances, accrual and health restrictions.


### 12.13 — Lending liquidations and bad-debt containment

**Priority:** P2 experimental · **Owner/workstream:** Lending risk · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Implement collateral seizure discounts, partial repay limits, liquidation bonuses and explicit close factors.
- [ ] Separate lending bad debt from spot LP reserves, perp vault assets and other protocol accounts.
- [ ] Simulate sudden oracle declines, insufficient collateral, borrower repayments during liquidation and auction/liquidator contention.
- [ ] Build a clear test-only insurance/reserve accounting model; never assert depositor protection beyond verified available assets.
- [ ] Add shutdown and recovery procedures that preserve safe withdrawals where possible after lending market failures.

**Acceptance evidence:** Bad debt cannot be silently transferred into unrelated module balances; liquidation outcomes reconcile exactly.


### 12.14 — Advanced spot orders: DCA, TWAP and scheduled execution

**Priority:** P1 · **Owner/workstream:** Spot automation · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Build revocable bounded test-token automation approvals with explicit max input, recipient, active window and total execution budget.
- [ ] Support DCA and TWAP schedules as separate strategies with interval, per-trade size, slippage and expiry.
- [ ] Operate durable scheduler/keeper jobs with idempotent execution intents, nonce locking and actual receipt tracking.
- [ ] Handle missed intervals, reserve changes, chain resets, insufficient gas and user cancellation without fake fills.
- [ ] Display scheduled, skipped, submitted, confirmed, reverted and cancelled executions with associated chain receipts.

**Acceptance evidence:** A user starts, pauses, resumes and cancels a test-only DCA/TWAP plan; no execution exceeds signed budget.


### 12.15 — Advanced routing, protected execution and liquidity efficiency

**Priority:** P1 · **Owner/workstream:** Spot execution · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Extend verified Factory graph routing across direct/two-hop/three-hop routes and compatible market sources when deployed.
- [ ] Compare net execution amounts after LP fees, estimated gas, route price impact and minimum received in BigInt arithmetic.
- [ ] Provide user-controlled slippage, transaction deadlines, route visibility and pre-sign simulation revalidation.
- [ ] Assess batch auction/intent/solver execution as separate experimental components with signed user limits and on-chain proof of fill.
- [ ] Reconcile route-level user volume versus pool-level swaps without double-counting multihop intermediate hops.

**Acceptance evidence:** Best-route trades settle on testnet with bounded slippage and on-chain fills that can be independently reconstructed.


### 12.16 — Unified portfolio, positions and risk dashboard

**Priority:** P1 · **Owner/workstream:** Portfolio · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Present spot balances, LP positions, perps, options, loans, lending receipts, collateral and test strategy vault shares per wallet.
- [ ] Read authoritative on-chain balances alongside separately labelled indexer history and oracle-valued mock PnL.
- [ ] Compute leverage, margin usage, liquidation proximity, debt health and exposure only for activated and supported modules.
- [ ] Support multiple wallet accounts, transactions in progress, confirmed receipts and chain reset notices.
- [ ] Export position and activity records with pinned block heights, chain ID, token decimals and price-source labels.

**Acceptance evidence:** A multi-module demo wallet dashboard reconciles each position to its module's Solidity state at the same block.


### 12.17 — Simulated RWA markets and proof-based asset labeling

**Priority:** P2 experimental · **Owner/workstream:** RWA simulator · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Create valueless synthetic reference assets (for example simulated equities, gold, treasury-like indices) without redemption or claims on actual instruments.
- [ ] Design configurable sandbox issuer/mint/redeem permissions, pause controls, notional caps and explicit synthetic collateralization assumptions.
- [ ] Bind market reference prices to test oracle scenarios and disclose delayed/stale/model-generated price status prominently.
- [ ] Allow test spot/RWA trades and optionally isolated RWA-collateral experiments only after oracle and liquidation testing.
- [ ] Test issuer mint-cap abuse, metadata spoofing, market-hours simulator edge cases and wrong-asset settlement.

**Acceptance evidence:** Simulated instruments trade and settle on the demo chain without claiming ownership, backing or real security rights.


### 12.18 — Strategy vaults and programmable portfolio rebalancing

**Priority:** P2 experimental · **Owner/workstream:** Vaults · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Prototype bounded strategy vaults for demo ERC-20 allocations, with immutable strategy limits and share accounting.
- [ ] Implement deposit, proportional share minting, withdrawal, fee/rebalance visibility and maximum-exposure constraints.
- [ ] Provide strategy permissions that cannot obtain unlimited wallet control or arbitrary delegatecall into unverified contracts.
- [ ] Add explicit keeper-triggered rebalance actions with slippage/gas ceilings, pause/withdraw controls and on-chain event proof.
- [ ] Fuzz deposit-withdraw symmetry, share-inflation attacks, oracle edge cases, strategy failure and multi-user withdrawals.

**Acceptance evidence:** Two demo users deposit and redeem correctly even after a strategy rebalance or simulated failure.


### 12.19 — Permissioned agent execution, developer APIs and automation

**Priority:** P1 · **Owner/workstream:** Developer platform · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Publish API/SDK contracts for spot quotes, orders, vault status, options, lending, perps and indexer health, scoped to activated modules.
- [ ] Allow bots and optional AI assistants to propose actions, but require bounded user authorization and cryptographic wallet signing.
- [ ] Define permission scopes for max notional, tokens, markets, expiration, chain ID and daily spend with revocation.
- [ ] Build read-only webhooks and event streams with signed callback receipts, sequence IDs and deduplication.
- [ ] Provide reference test bots, strategy backtests and an API sandbox that never requests or stores a user's wallet seed.

**Acceptance evidence:** An external developer deploys a constrained demo agent, executes a valid permitted trade and proves revocation blocks subsequent actions.


### 12.20 — Token launchpad, new-market seeding and guarded listings

**Priority:** P1 · **Owner/workstream:** Market creation · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Expand test-only token factory with name/symbol/decimals/supply-cap metadata and explicit owner/mint privileges.
- [ ] Build token detail views, review/unverified labels, creation receipt verification and rate-limited public pool launch.
- [ ] Support optional initial liquidity seeding and launch-stage order restrictions to reduce accidental spoofed-price manipulation.
- [ ] Require genuine PairCreated, transfers and initial reserve receipts before a token appears in the market directory.
- [ ] Run spam, counterfeit symbols, malicious ERC-20, empty pools, cap overflow and creator-rug simulator QA.

**Acceptance evidence:** Any outside wallet can create a fake-value token and launch a real sandbox pool without its ticker being marked reviewed by default.


### 12.21 — Campaigns, quest proofs, test incentives and ranking integrity

**Priority:** P1 · **Owner/workstream:** User testing · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Create missions for valid spot trades, repeated sessions, order placement/fill/cancel, LP deposits/withdrawals and activated advanced modules.
- [ ] Credit nontransferable points from finalized canonical chain events and clearly label their lack of guaranteed future monetary value.
- [ ] Define season score versions, anti-self-referral checks, qualified activity thresholds and anti-wash-trade heuristics.
- [ ] Enable private/pseudonymous participation and error-reporting workflows for unfair scoring or lost events.
- [ ] Recompute standings after reorgs/chain reset and verify point totals against signed module event IDs.

**Acceptance evidence:** A seasonal test leaderboard and quest balances reproduce exactly from canonical events without rewarding spam clicks.


### 12.22 — Historical analytics, backtesting and observability

**Priority:** P1 · **Owner/workstream:** Data platform · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Extend confirmed-event Neon indexer to every activated module using module-specific contracts, chain provenance and atomic checkpoints.
- [ ] Publish real sandbox spot volumes, candle OHLCV, LP flows, orders, funding, liquidations, utilization and fee schedules.
- [ ] Separate synthetic notional/reference pricing from cash-valued market metrics, avoiding fabricated real TVL and economic volume.
- [ ] Develop replayable strategy backtests with test snapshot datasets, data gaps, assumed fees and explicit no-live-performance claims.
- [ ] Alert on indexer lag, oracle drift, unmatched vault ledger entries, failed settlements and reserve reconciliation mismatches.

**Acceptance evidence:** Analytics reproduce sampled events from independently verified testnet receipts, and stop claiming freshness when indexer lags.


### 12.23 — Mobile trading workstation and optional messaging access

**Priority:** P1 · **Owner/workstream:** Client UX · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Create responsive consolidated Spot / Perps / Options / Lend / Portfolio navigation with visible module readiness indicators.
- [ ] Support mobile wallet switching, order signing, faucet, allowance and liquidation-risk disclosures in compact layouts.
- [ ] Provide order cancellation, collateral deposit/withdrawal, position closing and token activity views without desktop dependency.
- [ ] Consider an optional Telegram Mini App only with verified init data and externally signed wallet actions; no hidden server custody.
- [ ] Test iOS/Android browser reloads, backgrounding, wallet deeplink failures, network lag and accessibility.

**Acceptance evidence:** Phone testers safely open/close a position, cancel an order and withdraw demo funds with inspectable receipts.


### 12.24 — Adversarial security programme and invariant verification

**Priority:** P0 for every module · **Owner/workstream:** Security · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Maintain Foundry fuzz, invariant and unit tests for AMM, collateral accounting, perps, lending, options, order settlement and vault shares.
- [ ] Model oracle manipulation, signer compromise, reentrancy, precision errors, reserve depletion, storage collisions and cross-module insolvency.
- [ ] Require independent technical reviews and release blockers for leveraged or automated modules; testnet use does not eliminate exploit risks.
- [ ] Run red-team failure drills for keeper downtime, chain reorgs, backend compromise, replay, admin misconfiguration and emergency disable.
- [ ] Store reproducible test evidence, source/ABI hashes, explicit severity findings and regression PRs before enabling any P1/P2 module.

**Acceptance evidence:** Every activated advanced contract passes declared invariants, no unresolved critical path and controlled emergency recovery.


### 12.25 — Gated advanced testnet beta, KPIs and Milestone 13 handoff

**Priority:** P0 release · **Owner/workstream:** Delivery · **Status:** Not implemented under M12.

**Detailed engineering work**

- [ ] Launch a limited invited alpha for one advanced module at a time, preserving the functioning M11 spot/faucet/liquidity experience.
- [ ] Track independent tester outcomes: valid fills, cancellations, collateral exits, reconciled liquidations, RPC uptime and indexed event integrity.
- [ ] Publish test-only modules, receipts, code provenance, known failures, paused features and a bug-intake/support route.
- [ ] Evaluate real infrastructure cost, test-gas distribution, permission/user-error rates and safety incidents separately from financial performance.
- [ ] Write an evidence-based Milestone 13 proposal and keep any mainnet/real funds work outside this test-only phase.

**Acceptance evidence:** External testers complete end-to-end advanced flows with verifiable receipts, no loss of access to baseline spot LP withdrawal and signed release acceptance.



## Environments and non-negotiable technical boundaries

- [ ] Mainnet release remains disabled; no M12 contract is written to VERY Chain ID 4613.
- [ ] Testnet wallet, mintable synthetic collateral, source code, deploy receipts and relevant ABIs are verified independently.
- [ ] No off-chain status or backend database row is mistaken for a completed financial settlement; every fill/claim/position change has canonical receipt evidence.
- [ ] Perps, lending, options and simulated RWA modules are independently gated, with pause/fallback, account safety and tested withdrawal paths.
- [ ] Any mock price or synthetic notional is labeled as such, not real TVL/real income/real stock ownership.
- [ ] All new Solidity uses the project's MIT approach, Foundry invariants, chain-specific signatures and no wallet seed custody.
- [ ] Release documentation reports exactly which modules have publicly confirmed transactions and which remain experimental/disabled.

## Proposed developer package structure

```
contracts/src/advanced/
  ModuleRegistry.sol
  MarginVault.sol
  OracleGuard.sol
  PerpClearing.sol
  PositionRisk.sol
  OrderSettlement.sol
  KeeperRegistry.sol
  OptionsEngine.sol              # P2 — disabled until approved
  LendingPool.sol               # P2 — disabled until approved
  SimulatedRWA.sol              # P2 — zero-value synthetic references
  StrategyVault.sol            # P2 — separately reviewed
contracts/test/advanced/        # risk, funds, invariant, replay and adversarial tests
services/advanced/
  orderbook/  liquidations/  funding/  strategy-keeper/
services/indexer/              # additional canonical event codecs and module cursors
app/testnet/
  trade/  perps/  options/  lend/  rwa/  vaults/  portfolio/  rewards/
app/api/testnet/v2/             # documented bounded, read-only first
sdk/testnet/                    # typed ABI-safe execution builders
docs/
  M12-MARKETS.md
  M12-RISK-MODEL.md
  M12-RELEASE-GATES.md
```

*This is a proposed structure, not a claim that those files already exist.*

## Definition of done

Milestone 12 is not one giant all-or-nothing release. Its **foundation gate** is passed when the M11 externally reachable testnet works and the advanced module registry/oracle/collateral safety are verified. Each **advanced module** passes separately only after code, tests, source deployment, outside-wallet receipts, invariant/risk reconciliation and explicit release authorization. **P2 features can remain disabled** while working spot and selected P1 trading products run. Milestone 13 should be planned from actual tester evidence, not artificial market volume.
