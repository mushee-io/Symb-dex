# LIDDE DEX — MILESTONE 14: FULL-SCALE TESTNET, PERFORMANCE & ECOSYSTEM EXPANSION

> **DETAILED ENGINEERING ROADMAP — PLANNED, NOT BUILT. TESTNET ONLY. ZERO REAL FUNDS.** M11's persistent hosted public chain has not been verified in the current repository; M12 advanced financial contracts and M13 cross-module integrations are plans, not deployed products. **Do not present M14 as a working exchange or invent volumes, user counts, receipts, yields or successful security audits.**

## Objective and boundary

Milestone 14 is an operational-quality and adoption-validation phase. Upgrade the valueless Lidde test network into a robust, observable, scalable and developer-friendly exchange test environment; optimize spot/LP, verify whichever advanced financial modules genuinely exist, enable independent wallet users and maintain evidence-backed reporting.

- No VERY Mainnet chain ID 4613 as testnet, no real-value tokens, bridge deposits, regulated real assets, token sale or forced user spending.
- Existing implemented foundations: MIT Solidity Factory/Pair/Router, local Foundry/Anvil faucet/swap/LP smoke, isolated Neon testnet schema and source for wallet, LP and minimal receipt explorer.
- No public RPC/domain, signed operator keys, funded hosted faucet or independent wallet test receipts have been demonstrated from the current state. These must be proven before any public-user scale claims.
- M12/M13 modules stay OFF until actual reviewed Solidity code, chain receipts, indexer support, bounded risk and individual release acceptance exists.
- M14 is not the mainnet compliance, regulated launch, exchange token issuance or tokenomics deployment milestone.

**Dependencies:** [M11 master plan](MILESTONE-11.md) · [M11 operator guide](docs/M11-OPERATIONS.md) · [M12 advanced DeFi](MILESTONE-12.md) · [M13 cross-module integration](MILESTONE-13.md) · [disabled public testnet registry](config/deployments.testnet.json).

## Six implementation phases / 30 stages / 240 individually testable tasks

1. **Phase A — Infrastructure, hosting, wallets, safety:** M14.1–M14.6.
2. **Phase B — Trading quality and capital simulations:** M14.7–M14.12.
3. **Phase C — Data integrity, UX and external tester reliability:** M14.13–M14.18.
4. **Phase D — Developer ecosystem, agent workflows and test integrations:** M14.19–M14.24.
5. **Phase E — Onboarding, community growth and measured retention:** M14.25–M14.27.
6. **Phase F — Security, stress, release evidence and M15 transition:** M14.28–M14.30.

## Hard P0 user-visible release gate

- [ ] A genuinely persistent externally reachable non-mainnet test chain, explorer, deterministic deployment receipts and working faucet are proven.
- [ ] Independent wallets (not CI/owner accounts) can claim valueless assets, swap, create pools, add/remove all redeemable LP and inspect receipts.
- [ ] Canonical Neon indexer reconciles actual reserve/account state at same block and survives node/indexer restarts.
- [ ] Unsafe or unfinished leveraged/agent/lending/options features remain OFF; all wallet transaction write paths fail closed on chain mismatch or invalid codehash.
- [ ] Demonstrated monitoring, operator responsibility, safe configuration, per-module emergency restrictions and truthful public incident status.
- [ ] Beta usage claims distinguish independent human testers, managed test bots and locally scripted transactions.

## Complete engineering checklist — Part I

### 14.1 — Handover, actual testnet evidence and module inventory

**Priority:** P0  
**Owner:** Release engineering  
**Current readiness:** No persistent public test-chain deployment has yet been verified.

- [ ] Verify separate EVM chain identity, immutable genesis hash and chain ID; never label VERY Mainnet 4613 as testnet.
- [ ] Require external-wallet faucet, token swap, pool creation, LP mint and full LP exit on the SAME persistent public demo chain, with real receipts.
- [ ] Inventory every M12/M13 Solidity address, source SHA, ABI, deployment block, owner and linked indexer version; mark absent ones NOT IMPLEMENTED.
- [ ] Create an executable dependency graph for spot, router, vault, oracle, risk, perp, lending, options, automation, agents, farm and token launchpad.
- [ ] Separate OFF, LOCAL_ONLY, TESTNET_ALPHA, TESTNET_BETA and DISABLED_INCIDENT statuses; default unverified modules OFF.
- [ ] Pin supported wallet/provider matrix, signed operator access, approved test currencies and user warning strings in a release manifest.
- [ ] Run codehash and chain-state attestation at deployment, frontend startup, worker startup and before risk-sensitive signatures.
- [ ] Obtain accountable go/no-go signoff for each module from code, independent user receipts and reconciled on-chain records.

**Acceptance evidence:** A signed chain-and-module manifest with actual outside-wallet receipts, no guessed contract addresses.  
**Blocker / stop condition:** Unproven network provenance or a planned feature shown as operational.

### 14.2 — Persistent EVM infrastructure, high availability and state continuity

**Priority:** P0  
**Owner:** EVM platform/SRE  
**Current readiness:** Existing Docker/Anvil configuration is a recipe, not hosted multi-node public infrastructure.

- [ ] Deploy isolated valueless public test EVM nodes with persistent storage, reviewed client versions, published chain parameters and documented restart sequence.
- [ ] Separate public read RPC, transaction-broadcast gateway and operator/admin RPC on private networks with no node-held public signing.
- [ ] Design standby read replicas or alternative safe RPC providers; do not imply a single Anvil process provides consensus-level high availability.
- [ ] Create periodic state snapshots, off-host restore copies, integrity hashes and safe network-reset notices for testers.
- [ ] Monitor block production, block age, orphan/reorg behavior, disk growth, mempool saturation and transaction queue status.
- [ ] Rehearse scheduled restart, unexpected outage, full disk, backup restoration and RPC failover without silently changing genesis.
- [ ] Validate external CORS/HTTPS, rate limits and wallet connectivity from distinct devices and residential networks.
- [ ] Publish honest uptime and incident history after observing actual hosted operating conditions, not aspirational availability.

**Acceptance evidence:** Public test chain survives a controlled restart and reads/write receipts can be verified independently afterward.  
**Blocker / stop condition:** Node serves wrong genesis/chain, loses state or exposes admin controls.

### 14.3 — Versioned deployment pipeline, staging environments and feature flags

**Priority:** P0  
**Owner:** Release/DevOps  
**Current readiness:** M11 local Anvil CI exists; real beta rollout and release provenance need execution.

- [ ] Define local, integration, persistent staging and public-testnet environments with separate chain IDs and valueless signing credentials.
- [ ] Compile reproducible Foundry artifacts and matching versioned Next/SDK/Neon event schemas from a pinned source commit.
- [ ] Execute automated contract verification against deployed bytecode and Router/Factory/Oracle/Vault dependency edges before activation.
- [ ] Maintain immutable deployment manifest per module with chain ID, genesis, codehash, constructor values, role owners and deployment block.
- [ ] Implement OFF/READ_ONLY/TESTNET_ALPHA/TESTNET_BETA feature gates per module, failing closed when contract or schema is missing.
- [ ] Add automatic frontend build/deploy smoke, wrong-chain checking, independent RPC reads and bundle rollback when code or data mismatches.
- [ ] Write explicit reset, migration, old-contract read-only and reindex procedures to prevent dangling user approvals.
- [ ] Make release changes traceable to code review, CI output, one operator approval and post-release chain receipts.

**Acceptance evidence:** Reproducible staged deployment with verified addresses, safe rollback and separately gated modules.  
**Blocker / stop condition:** Accidental mainnet transaction, wrong ABI, unreviewed contracts or feature falsely enabled.

### 14.4 — Hardened public RPC, explorer, developer endpoint and fair use

**Priority:** P0  
**Owner:** Infrastructure/API operations  
**Current readiness:** M11 has a basic gateway; complete explorer and public ops are not proven.

- [ ] Run public HTTPS JSON-RPC behind WAF/abuse controls, bounded payload size and per-wallet/IP/provider budgets where feasible.
- [ ] Expose only permitted EVM read and signed-raw-transaction methods; refuse all Anvil impersonation, admin and personal-sign endpoints.
- [ ] Recheck upstream RPC chain ID and genesis before write relays and on endpoint change; reject chain 4613 and known live networks.
- [ ] Provide independent stable read RPC, transaction submission endpoint and live status health, with resource budgeting and alerting.
- [ ] Deploy a full explorer that decodes blocks, contracts, token transfers, factory pools, liquidity, perp/order events and transaction errors.
- [ ] Serve actual ABIs/codehash/verified Solidity links alongside tx hash, receipt, event logs, gas and confirmation count.
- [ ] Document RPC rate limits, allowed methods, block finality policy, pagination and sample wallet/SDK queries.
- [ ] Stress-test long getLogs scans, concurrent quotes, malicious large requests, upstream failure and invalid JSON-RPC batches.

**Acceptance evidence:** External users can verify test blocks and decoded transaction events while admin methods remain inaccessible.  
**Blocker / stop condition:** Spoofed chain, open administrative RPC, no trusted explorer or unbounded public cost.

### 14.5 — Test token faucet, sponsor keys, claim budgets and recovery

**Priority:** P0  
**Owner:** Backend/signer operations  
**Current readiness:** Solidity faucet + disabled sponsorship source and Neon tables exist; public operator not running.

- [ ] Enable zero-gas first claim only after verified test-only signer, separate Neon URL, trusted-proxy IP details and chain-id-bound wallet challenge.
- [ ] Refill limited native fake gas, tUSD/tUSDC/tUSDT/tBTC/tETH/tLIDDE and approved scenario assets using test-chain-only mint rights.
- [ ] Enforce on-chain wallet cooldown plus database daily wallet/IP/network quota with atomic reservations and duplicate detection.
- [ ] Serialize sponsorship nonces across multiple API replicas, bound sponsor gas per day and disable service on unexpected nonce drift.
- [ ] Reconcile submitted, pending, confirmed, reverted and unknown-transaction claims before any retry; never blindly issue twice.
- [ ] Publish transparent claim amount, queue status, cooldown, failure reason and account test-chain transaction link.
- [ ] Practice malicious recipient, bot burst, replayed signature, midnight boundary, operator key rotation and depleted inventory scenarios.
- [ ] Demonstrate from a brand-new external wallet that no real gas, card, bridge, deposit or seed phrase is required.

**Acceptance evidence:** Many separate external wallets claim exactly permitted free test gas and tokens with durable receipts.  
**Blocker / stop condition:** Faucet asks for real value, suffers replay bypass or uses a real-money signing key.

### 14.6 — Service health, capacity budgets, logs and incident ownership

**Priority:** P0  
**Owner:** Observability/SRE  
**Current readiness:** Some CI checks exist; no complete hosted service SLO baseline.

- [ ] Create trace IDs connecting wallet intent, simulation, RPC request, on-chain hash, indexer event, Neon transaction and UI confirmation.
- [ ] Monitor node block lag, RPC p50/p95 latency, tx inclusion/revert rate, indexer lag, oracle heartbeat and faucet reserves.
- [ ] Set alert severity and owner for corrupt block history, stalled network, active exploit, signer misconfiguration, queued job backlog and token inventory.
- [ ] Define tested internal SLO targets separately from achieved uptime; record available hosting budget and realistic cost per test user.
- [ ] Implement metrics endpoint, structured redacted logs, dashboards, privacy protections and secret detection for all hosted services.
- [ ] Exercise mock incidents: RPC outage, reset, fork, stale oracle, database unavailable and private signer disabled.
- [ ] Publish testnet status/known issues and documented maintenance/reset calendar, avoiding invented performance assurances.
- [ ] Verify manual runbooks allow front-end risk-sensitive actions to disable without falsely claiming immutable contracts can be paused.

**Acceptance evidence:** Observed dashboards and correctly fired alerts plus a documented on-call and recovery test.  
**Blocker / stop condition:** A chain failure is invisible or operator cannot stop unsafe frontend transactions.

### 14.7 — Spot AMM performance, swap price precision and gas optimization

**Priority:** P1  
**Owner:** AMM/Solidity engineering  
**Current readiness:** Existing V2 spot source and local test swaps exist; large-scale tests need real public chain.

- [ ] Benchmark Factory/Pair/Router gas for creation, approvals, direct swap, multihop swap, add liquidity and full LP withdrawal.
- [ ] Measure quoting accuracy across 6/8/18 decimal demo tokens, extreme reserve ratios, tiny trades and large orders.
- [ ] Profile gas and runtime for repeated router path checks, exact approvals, native wrap/unwrap and user refund handling.
- [ ] Develop optimization proposals only after reference invariants and before/after bytecode/receipt comparisons.
- [ ] Prevent fee discrepancies and quote rounding from producing zero-output or misleading slippage results.
- [ ] Run high-frequency test swaps and reserve changes, checking each transaction's LP fee and on-chain Sync events.
- [ ] Produce deterministic simulation vectors and benchmark tables with exact block height and test-chain contract revision.
- [ ] Demonstrate full LP withdrawal compatibility remains after any router or Pair code change, or treat change as separate new version.

**Acceptance evidence:** Lower or justified gas costs with identical swap/LP safety and accurate receipt balances.  
**Blocker / stop condition:** Optimization introduces changed fee economics, rounding exploit or broken LP withdrawal.

### 14.8 — Liquidity depth, LP tools and capital-efficiency experiments

**Priority:** P1  
**Owner:** Liquidity/AMM product  
**Current readiness:** Pool creation/LP code exists; real multi-provider markets and ranges not proven.

- [ ] Build real testnet pool discovery with actual reserves, LP supply, age, fee-growth proxy and clearly synthetic reference prices.
- [ ] Enable creation of pools with custom demo ERC-20s while warning about initial prices and permanent minimum LP locks.
- [ ] Provide LP position drilldowns: deposit events, net token flows, pool ownership, pending approvals and complete exit conditions.
- [ ] Add price-impact simulation to demonstrate liquidity requirements and explain impermanent-loss scenarios from test prices.
- [ ] Research per-pool liquidity incentives, balanced/imbalanced pool exposure and optional fee tiers as separately versioned contracts.
- [ ] If range liquidity is pursued, isolate its tick math/factory/position manager from the current V2 Pair to avoid ABI confusion.
- [ ] Test whale swap, LP withdrawal during volatility, reserve donations, token transfer taxes, rebases and stale pool indexes.
- [ ] Compare capital efficiency and gas use only using on-chain test transactions and clearly disclosed synthetic market assumptions.

**Acceptance evidence:** Two or more LP wallets can deposit, receive correct shares and withdraw after stressed swaps with exact accounting.  
**Blocker / stop condition:** Unredeemable shares, unverified custom token mislabeled approved or fictional liquidity returns.

### 14.9 — Professional orderbook, signature lifecycle and solver execution

**Priority:** P1 gated  
**Owner:** Order-service/solver engineers  
**Current readiness:** Requires independently deployed M12/M13 signed-order contracts, not roadmap text.

- [ ] Build per-market off-chain order discovery with on-chain EIP-712 settlement, expiry, cancellation and immutable replay protection.
- [ ] Show OPEN, PARTIAL, FILLED, CANCELLED, EXPIRED, REJECTED and UNKNOWN_CONFIRMATION states derived from chain evidence.
- [ ] Support exact lot/tick constraints, partial-fill floor, maker asset reserve, fee caps and chain-specific nonce domains.
- [ ] Run bounded filler and solver bots using separate test-only keys with durable nonce/job locks and kill switch.
- [ ] Validate proposals across direct AMM, multihop, future approved routes and price-impact/gas requirements.
- [ ] Reject stale oracle, signer-spoofed orders, broken router links, false tx receipts and incompatible SDK ABI.
- [ ] Display order price, actual average execution, fees, fill timestamps and user cancellation path without promising fills.
- [ ] Test concurrent solver fills, attempted replays, sign/withdraw race, reorg reversal, shortage and user disconnect.

**Acceptance evidence:** Two independent wallet orders are partially filled, canceled and settled with exact receipt-linked state.  
**Blocker / stop condition:** No on-chain settlement, forged signature, miscounted partial fills or irrecoverable order.

### 14.10 — Derivatives stress harness, funding, margin and liquidation quality

**Priority:** P1 gated  
**Owner:** Perps/risk operations  
**Current readiness:** M12 perp clearing and M13 shared risk remain unimplemented.

- [ ] Validate live test contracts for open, resize, reduce, reverse and close of perps and exactly versioned market lists.
- [ ] Recompute funding, mark/index spread, user PnL, unrealized losses and fee accounting from canonical signed oracle rounds.
- [ ] Stress multiple correlated accounts, high leverage, thin liquidity and rapidly changing mock reference prices.
- [ ] Enforce per-market open-interest caps, leverage bands, position-size ceilings, incremental margin and insurance/bad-debt limits.
- [ ] Exercise partial liquidation, backstop rules, liquidation queue competition and safely halted liquidation during oracle outage.
- [ ] Benchmark keeper alert delay, transaction inclusion, margin call acceptance and account-debt reconciliation.
- [ ] Ensure position settlement and collateral withdrawal remain possible when new-position flow is close-only.
- [ ] Publish testnet liquidation metrics without describing fake-dollar notional as actual derivatives trading volume.

**Acceptance evidence:** No healthy position liquidated, bankrupt exposure bounded and mixed-user PnL/margin matches ledger.  
**Blocker / stop condition:** Insolvent account hidden, stale liquidation price or fake leverage execution.

### 14.11 — Options, lending, composability and strategy risk containment

**Priority:** P2 experiment  
**Owner:** Options/lending/vault risk engineers  
**Current readiness:** Not buildable as integration until tested M12/M13 modules exist.

- [ ] Run separately gated demo option issuance, premium, collateral, expiry and cash settlement with verified reference price.
- [ ] Run lending pool deposit, borrow, repay, interest, collateral haircut and lender exit with exact receipt shares.
- [ ] Test atomic spot-swap-to-repay, position close-to-release-margin and optional strategy-vault rebalance only through reviewed adapters.
- [ ] Protect against recursive collateral, repeated receipt shares, bad oracle updates, reserve starvation and debt double-counting.
- [ ] Measure product interoperability under price gap, oracle freeze, keeper outage, liquidation cascade and LP mass-withdrawal scenarios.
- [ ] Separate simulated protocol bad debt and insurance reserve deficits from user-held valueless collateral.
- [ ] Disclose capability gates, economic simulation assumptions, and scenarios in which only partial asset withdrawal is possible.
- [ ] Do not expose option/lending/vault buttons publicly until cross-module invariants, code deployment and exits are proven.

**Acceptance evidence:** Reproducible end-to-end loan/option/vault sandbox transaction receipts and safe failure behaviour.  
**Blocker / stop condition:** Shared liability accounting diverges or unbacked option/lending payouts are possible.

### 14.12 — Test-only market makers, liquidity stimulation and honest volume

**Priority:** P1  
**Owner:** Market simulation engineering  
**Current readiness:** No credible externally operated demo market-maker ecosystem yet.

- [ ] Build controlled demo market-maker agents with designated bot addresses, fake gas caps, per-market spread bands and quote budgets.
- [ ] Use bots to provide seeded LP, controlled trading scenarios and discontinuous stress conditions without artificial user rewards.
- [ ] Tag protocol-owned, synthetic test bots, external independent users and CI actors separately in the canonical event indexer.
- [ ] Prohibit counting repeated self-swaps, bots or pool-internal split legs as external-user organic test adoption.
- [ ] Measure genuine swap success, spreads, quote liquidity, order fill rate, route failures and user cost.
- [ ] Implement safeguards against excessive gas spend, unchecked minting, price runaway, oracle spoofing and rate-limit exhaustion.
- [ ] Provide a transparent on/off market-simulation schedule and market reset metadata to external testers.
- [ ] Run controlled high-concurrency synthetic-volume tests and publish metrics as TEST LOAD, not real economic DEX volume.

**Acceptance evidence:** Bot trades are clearly labeled, budgets bounded and external-user test results remain distinguishable.  
**Blocker / stop condition:** Fake-volume marketing, bot-controlled leaderboard abuse or unbounded simulated mint supply.

### 14.13 — Canonical Neon event pipelines and exactly-once position reconstruction

**Priority:** P0/P1  
**Owner:** Indexing/data engineering  
**Current readiness:** M11 isolated Neon schema exists, advanced M12/M13 event codecs are not built.

- [ ] Use chain ID/genesis, contract codehash, block hash, tx hash and log index to identify exact canonical events across module versions.
- [ ] Index Swap/Sync/Mint/Burn/LP transfers plus signed orders, vault deposits, margin, funding, liquidation, lending and options only after corresponding contracts exist.
- [ ] Introduce schema migrations with tested forwards/backwards compatibility, no destructive silent mutation and deployment block provenance.
- [ ] Run a single-writer or explicitly leased multiwriter worker with atomic checkpoints and confirmation depth.
- [ ] Simulate duplicate logs, overlapping backfills, reorgs, contract redeployments and midnight resets without duplicated activity.
- [ ] Rebuild wallet balances, LP shares, collateral holds, position PnL and loans from verified events independently of frontend estimates.
- [ ] Provide read-only paginated query endpoints with indexed-through block, indexed-through hash and data-quality flags.
- [ ] Audit Neon permissions and database backups; prohibit publicly exposing owner database roles, connection strings and wallet secrets.

**Acceptance evidence:** Full replay from genesis or deployed start produces the same account/pool state and unique event count.  
**Blocker / stop condition:** Indexer duplicates activity, mixes chain identities or loses data after rollback.

### 14.14 — Realtime charts, historical analytics and derived price-quality limits

**Priority:** P1  
**Owner:** Market data engineering  
**Current readiness:** Testnet charts and synthetic valuation require actual transactions before claimed live.

- [ ] Generate canonical OHLCV for 1m/5m/15m/1h/4h/1d views from confirmed per-pool swaps with correct decimals.
- [ ] Show accurate latest trades, mock reference prices, pool reserve depth, spreads and simulated slippage across markets.
- [ ] Enforce token ordering, direction normalization and route aggregation to avoid double-counting multi-hop notional as a single user trade.
- [ ] Surface missing historical intervals honestly and mark synthetic USD/tUSD valuations as simulations.
- [ ] Distinguish block-confirmed data, optimistic pending data, stale indexer, missing price and invalid oracle source visually.
- [ ] Backfill historical chart data after reorg, reset, contract migration and indexer replay without inventing candles.
- [ ] Bench chart API latency, cache invalidation, expensive queries and pagination under concurrent test users.
- [ ] Compare selected chart candles and total test-volume aggregates to raw on-chain receipt data at pinned blocks.

**Acceptance evidence:** Charts and aggregates reproduce exact sample chain events, and missing data is never silently interpolated as real trades.  
**Blocker / stop condition:** Made-up candles, doubled volume or unconfirmed price displayed as authoritative.

### 14.15 — Data warehouse, reproducible metrics and user cohort measurement

**Priority:** P1  
**Owner:** Analytics/experiment engineering  
**Current readiness:** M11 basic event schema exists but no real public user cohort baseline.

- [ ] Define canonical KPIs: first faucet claim, first swap, successful LP mint, full LP exit, weekly returning test wallets and support-reported failures.
- [ ] Separate organic externally connected wallets from scripted simulations, chain operators, sponsored faucet farms and CI accounts.
- [ ] Build deterministic daily and weekly aggregation using chain, contract, tx and event identities with reorg corrections.
- [ ] Measure activity funnels, time-to-first-trade, wallet session failure, pool creation, liquidity withdrawal success and mobile breakdown.
- [ ] Calculate risk/perp/options/lending activity only from enabled real contracts with missing modules explicitly omitted.
- [ ] Add documented privacy controls and data retention boundaries for optional off-chain accounts, emails, IP hashes and community referrals.
- [ ] Publish metric definitions, source freshness, data quality checks, block boundaries and bot exclusions with dashboards.
- [ ] Verify monthly data snapshots can be independently recomputed from canonical Neon events and contract state.

**Acceptance evidence:** No reported activity KPI can be inflated by one replayed event; cohort definitions and omissions are public.  
**Blocker / stop condition:** Unverifiable growth claims, undeclared bot volume or exposure of personal data.
