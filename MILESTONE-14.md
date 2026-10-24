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

## Complete 30-stage workstream index

| Stage | Engineering workstream | Priority |
|---|---|---|
| **14.1** | M11–M13 handover and dependency verification | P0 |
| **14.2** | Persistent EVM and state continuity | P0 |
| **14.3** | Deployment pipelines and feature gates | P0 |
| **14.4** | Public RPC and explorer | P0 |
| **14.5** | Sponsored faucet and reserve budgets | P0 |
| **14.6** | Observability and incident response | P0 |
| **14.7** | Swap precision and gas optimization | P1 |
| **14.8** | Liquidity depth and LP efficiency | P1 |
| **14.9** | Orderbook and solver performance | P1 gated |
| **14.10** | Perpetuals/margin/liquidation stress testing | P1 gated |
| **14.11** | Options/lending/vault risk containment | P2 |
| **14.12** | Test-market-making and non-fabricated volume | P1 |
| **14.13** | Canonical event indexing | P0/P1 |
| **14.14** | Charts and price data integrity | P1 |
| **14.15** | Data warehouse and adoption metrics | P1 |
| **14.16** | Unified wallet portfolio, risk exposure and withdrawal UX | P1 |
| **14.17** | Full exchange usability, accessibility and performance engineering | P1 |
| **14.18** | Mobile wallets, PWA resilience and optional messaging access | P1 |
| **14.19** | Public TypeScript SDK, reference contract package and CLI | P1 |
| **14.20** | Agent infrastructure, bounded automation and x402-style sandbox flows | P1 gated |
| **14.21** | Cross-chain simulation and safe interoperability laboratory | P2 research |
| **14.22** | Token creator, developer launchpad and sandbox market lifecycle | P1 |
| **14.23** | Integration hub, adapter compatibility and external partner testing | P1 |
| **14.24** | Developer console, permission scopes and ecosystem examples | P1 |
| **14.25** | Faucet onboarding missions, referrals and user anti-sybil controls | P1 |
| **14.26** | Community operations, support triage and ecosystem education | P1 |
| **14.27** | Real tester growth experiments, cohort retention and product evidence | P1 |
| **14.28** | Security review, formal invariants, bug bounty and abuse readiness | P0 |
| **14.29** | Disaster recovery, scalability, resets and protected testnet operations | P0 |
| **14.30** | Large beta evaluation, operating scorecard and Milestone 15 handover | P0 closeout |

## Complete engineering checklist — all 30 stages

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

## Complete engineering checklist — Part II

### 14.16 — Unified wallet portfolio, risk exposure and withdrawal UX

**Priority:** P1  
**Owner:** Wallet/portfolio engineering  
**Current readiness:** Basic testnet wallet and LP source exists; advanced modules are plans.

- [ ] Implement consolidated wallet identity by test chain plus active address, isolating balances when the connected wallet or chain changes.
- [ ] Display native fake gas, demo ERC20 spot balances, LP shares, reserved signed-order allowance, posted mock margin and loan liabilities only where actual contracts are enabled.
- [ ] Derive spot and LP amounts from contract reads at a common block, and show indexing freshness for historical events.
- [ ] Show account equity, available collateral, open leveraged positions and liquidation distance only with a valid current oracle snapshot; otherwise show unavailable.
- [ ] Expose the exact contract, spender, token, permitted allowance, fee estimate and expected minOut before wallet authorization.
- [ ] Enable pending/confirmed/replaced/reverted/indeterminate tx recovery from real hashes without duplicating orders on browser refresh.
- [ ] Provide direct independent exit instructions for underlying LP or collateral contracts if frontend is offline, with versioned verified ABIs.
- [ ] Test multi-wallet switching, stale cached balances, partial fills, spent token allowance, fee-on-transfer demo fixtures and RPC outage.

**Acceptance evidence:** A user can inspect assets and obligations and withdraw all eligible test positions without double-counted balances.  
**Blocker / stop condition:** Incorrect available collateral, fake portfolio values or missing exit route.

### 14.17 — Full exchange usability, accessibility and performance engineering

**Priority:** P1  
**Owner:** Product/frontend QA  
**Current readiness:** Separate testnet swap and pool screens are source-complete for local state, but public use unverified.

- [ ] Unify Spot, Pools, Orders, Portfolio, Advanced Markets, Rewards, Launch and Developers under intuitive navigation with disabled modules clearly labeled.
- [ ] Provide beginner flow: verify network → connect wallet → free gasless faucet → approve → first swap → create pool → redeem LP → inspect receipt.
- [ ] Define standardized empty, loading, RPC unavailable, wallet rejection, stale quote, failed transaction and maintenance states for every interaction.
- [ ] Optimize React rendering, bundle chunking, contract read batching, quote debouncing and mobile error boundary behavior against measured testnet benchmarks.
- [ ] Audit keyboard flows, semantic labels, screen-reader names, focus restoration, motion reduction, color contrast and large touch targets.
- [ ] Build a chain-codehash/state freshness ribbon that blocks writes when the wallet, expected chain, manifest or live router differs.
- [ ] Introduce optional onboarding tours and context-sensitive education on price impact, LP share, margin, synthetic assets and unbacked test tokens.
- [ ] Test a no-assistance first-session journey with multiple outside users on slow networks and measure true task completion, not only clicks.

**Acceptance evidence:** Accessible desktop/mobile flows complete external user test operations with acceptable measured responsiveness.  
**Blocker / stop condition:** Users are guided to the wrong chain or UI reports synthetic confirmation before receipt.

### 14.18 — Mobile wallets, PWA resilience and optional messaging access

**Priority:** P1  
**Owner:** Mobile/client engineering  
**Current readiness:** No independently confirmed public mobile wallet test coverage exists.

- [ ] Test supported injected and mobile EVM wallets on iOS Safari, Android Chrome, embedded wallet webviews and explicit WalletConnect variants.
- [ ] Use secure network addition/switching to a verified non-4613 test chain, preserving a visible TESTNET/no-real-funds warning.
- [ ] Handle OS app switching, deep link return, session invalidation, account replacement and wallet signature confirmation on background resume.
- [ ] Build responsive compact quote card, risk notice, approve/swap controls, LP withdrawal sliders and order cancellation controls.
- [ ] Store only non-sensitive transaction hashes/local UI preferences for recovery; never store private keys or bearer signing secrets in PWA cache.
- [ ] Use installable PWA/offline mode only for read-only history and help; disable all chain writes while offline or when quote age is unknown.
- [ ] Optional Telegram Mini App must verify server-side init data and retain user-controlled EVM wallet signing, not custodial shortcuts.
- [ ] Complete two-device mobile smoke cycles: first claim, ERC20 swap, native token swap, add LP, full withdrawal and receipt inspection.

**Acceptance evidence:** iOS/Android external testers complete verified test-chain lifecycle without desktop fallback or hidden signatures.  
**Blocker / stop condition:** Wallet connection appears successful but signatures target a wrong chain or stale state.

### 14.19 — Public TypeScript SDK, reference contract package and CLI

**Priority:** P1  
**Owner:** Developer relations/SDK engineering  
**Current readiness:** M11 SDK and M13 advanced API are planned, not a published stable package.

- [ ] Publish testnet-only config with chain ID/genesis, deployed verified addresses, ABI versions, token metadata and optional faucet endpoint.
- [ ] Provide typed functions: connectChain, listPools, getQuote, simulateSwap, buildSwapCall, approveExact, addLiquidity, removeLiquidity and inspectReceipt.
- [ ] Extend SDK with order/position/borrow/agent methods only after each actual contract is implemented and ABI verified.
- [ ] Require a caller-owned signer and reject any mainnet chain ID, wrong codehash, expired quote or incompatible contract version before forming write calldata.
- [ ] Implement cross-runtime examples for Node.js, Next.js/browser, mobile wallets and demo agent runners without leaking keys into logs.
- [ ] Publish signed release changelog, semver compatibility, RPC limits, common errors, example transaction receipts and reset notices.
- [ ] Create local fixture EVM integration tests and one public demo-chain CI smoke per SDK release where infrastructure exists.
- [ ] Provide CLI diagnostics for health, chain provenance, verified contracts, faucet eligibility and wallet read-only balances.

**Acceptance evidence:** Independent developer installs SDK and submits confirmed bounded test swap/LP withdrawal with caller-owned disposable key.  
**Blocker / stop condition:** SDK sends real-chain writes, embeds privileged key or exports fake receipt data.

### 14.20 — Agent infrastructure, bounded automation and x402-style sandbox flows

**Priority:** P1 gated  
**Owner:** Agent protocol engineering  
**Current readiness:** Earlier agent delegation and recurring order proposals not deployed.

- [ ] Implement explicit per-agent on-chain user delegation with target contracts, spend ceilings, asset allowlists, expiry, nonce and revocation.
- [ ] Host simulation/intent APIs where agents can obtain quotes, read risk, propose limited trades and request user-signed approvals without custody.
- [ ] Support automated test-only DCA, TWAP, liquidity rebalance or risk notifications only for demonstrably enabled modules.
- [ ] Represent agent identity with a scoped test registry and operator-owned demo keys; prohibit reusable personal wallet seed phrases.
- [ ] Record intent ID → proposer → user permission → simulated execution → hash → receipt → indexed reconciliation as an auditable pipeline.
- [ ] If implementing x402-style paid API experiments, charge only synthetic valueless tokens with no gateway to real funds; independently verify invoice/payment semantics.
- [ ] Enforce nonce serialization, error retry budgets, daily fake-gas limits and revocation even when an agent backend is unavailable.
- [ ] Run malicious prompt, tool-output injection, role confusion, over-budget, wrong-chain and replay attacks, proving bounded testnet execution.

**Acceptance evidence:** A restricted agent completes one valid demo operation, then fails all attempts after revocation.  
**Blocker / stop condition:** Agent controls unrestricted signer, accepts injected parameters or charges real money.

### 14.21 — Cross-chain simulation and safe interoperability laboratory

**Priority:** P2 research  
**Owner:** Research/bridge engineering  
**Current readiness:** Current build is a single test chain; no official bridge or cross-chain settlement exists.

- [ ] Model a second independent valueless EVM sandbox network only if it materially improves developer integrations; assign distinct genesis/chain ID and demo token identity.
- [ ] Implement local-only message relay fixtures and proof verification simulations before considering any public test bridge.
- [ ] Represent source chain, destination chain, message nonce, finality, token mapping, replay domain and reorg invalidation unambiguously.
- [ ] Do not bridge real VERY, real ERC20s, stablecoins or actual user assets; synthetic destination tokens have no external backing or redemption.
- [ ] Allow mock cross-chain swap or portfolio read-only demonstrations behind an explicit EXPERIMENTAL_SIMULATION gate, without misleading guarantee of settlement.
- [ ] Test duplicate messages, invalid proof, delayed relayer, partial progress, source reorg, stuck transaction and revoked mapping.
- [ ] Publish transaction linkage and status on BOTH real test chains if a test bridge is implemented, including unsettled failure warnings.
- [ ] Make cross-chain features optional; they must not block reliable spot/LP testing on the initial persistent demo EVM.

**Acceptance evidence:** Sandbox relay behaves deterministically under replay/finality tests with zero live-asset involvement.  
**Blocker / stop condition:** Real bridge deposits, ambiguous token backing or unverified cross-chain finality.

### 14.22 — Token creator, developer launchpad and sandbox market lifecycle

**Priority:** P1  
**Owner:** Token launch/market UX engineering  
**Current readiness:** Custom test-token factory and community launcher are not proven deployed.

- [ ] Deliver test-only token templates with configurable symbol, decimals, capped synthetic supply, mint permissions and clear owner disclosure.
- [ ] Integrate one-click verified token deploy, Factory pool creation, first LP add, test trading and owner LP exit with real receipts.
- [ ] Distinguish Lidde reviewed seed assets, user-created unreviewed assets, developer adversarial fixtures and retired UI markets.
- [ ] Offer creator dashboard with actual token holders, transfers, supply, pool reserves, LP shares and test-chain swap history.
- [ ] Add rate limits and community reports for ticker impersonation, malicious callbacks, misleading metadata and spam creation.
- [ ] Measure deployment and liquidity creation gas on the public testchain, and display exact token addresses/ABIs in the explorer.
- [ ] Support simulation of migration or new contract version without rewriting users' historical receipt identities.
- [ ] Do not enable fundraising, token sales, bridge deposits, paid listing or real asset issuance as part of this sandbox module.

**Acceptance evidence:** A new outsider creates a valueless token, seeds liquidity, trades, withdraws and inspects all events.  
**Blocker / stop condition:** Token impostor is falsely verified or user cannot redeem their LP.

### 14.23 — Integration hub, adapter compatibility and external partner testing

**Priority:** P1  
**Owner:** Ecosystem engineering  
**Current readiness:** No verified external partner integrations for advanced modules exist.

- [ ] Create a documented integration registry for testnet token tools, user wallets, SDK apps, read-only analytics, oracles and optional module adapters.
- [ ] Expose versioned adapter contracts with codehash, chain ID, ABI, permissions, route limits and deprecation process.
- [ ] Require each external adapter to pass isolated fork/local fixtures and end-to-end independent test-chain transaction checks before listing enabled.
- [ ] Maintain an allowlist for risk-bearing routing/oracle/settlement connections and label community integrations as unreviewed until assessed.
- [ ] Build external-developer onboarding with sample transactions, support escalation and predictable public testnet reset notices.
- [ ] Test downstream failures, partial indexing, stale external data, token decimals, changing APIs and revoked permissions.
- [ ] Differentiate API interoperability and a sandbox integration from formal ecosystem partnership or foundation endorsement.
- [ ] Publish an integration test matrix and add automated contract/SDK compatibility checks to CI for enabled adapters.

**Acceptance evidence:** At least two separately developed sandbox integrations can read accurate state and execute scoped demo actions.  
**Blocker / stop condition:** Forged partnership claims or an incompatible adapter bypasses chain/risk checks.

### 14.24 — Developer console, permission scopes and ecosystem examples

**Priority:** P1  
**Owner:** Developer platform engineering  
**Current readiness:** Current GitHub source and minimal explorer exist; console is not delivered.

- [ ] Build a read-only public developer console showing network provenance, module status, verified contracts, ABIs and API/indexer freshness.
- [ ] Offer sandbox API keys for rate-limited noncustodial reads where useful, with clear rotation, expiration, quotas and access logging.
- [ ] Provide sample apps for demo token swaps, LP exits, testnet market alerts, portfolio reads and consented agent execution.
- [ ] Develop searchable documentation for event schemas, canonical blocks, ERC20 approvals, slippage, wrong-chain protection and test faucet use.
- [ ] Include an interactive transaction simulator that never claims submission or confirmation before actual wallet and chain receipts.
- [ ] Create fault-injection fixtures for keeper paused, oracle stale, RPC outage, forced swap revert and indexer lag for external developers.
- [ ] Log example-version compatibility across frontend, SDK, contract manifest and Neon API without collecting developers' signing secrets.
- [ ] Measure time-to-first-successful API read and first verified demo transaction from independent integration testers.

**Acceptance evidence:** Developers can reproduce safe read and signed-write sample flows without staff intervention.  
**Blocker / stop condition:** Console exposes secrets, simulates fake fills or points to outdated contracts.

### 14.25 — Faucet onboarding missions, referrals and user anti-sybil controls

**Priority:** P1  
**Owner:** Community/product + data  
**Current readiness:** No verified live M11 public tester cohorts or reward engine.

- [ ] Create first-time walkthrough missions with proof from real faucet, first swap, LP add and complete LP exit events.
- [ ] Define deterministic chain event identity and per-wallet one-time/recurring quest eligibility, preventing click-based phantom points.
- [ ] Build opt-in invite codes tied to qualified first confirmed test-chain activity rather than wallet connect alone.
- [ ] Bound points and daily rewards, excluding operator bot wallets and repeatable self-trades from organic user scoring.
- [ ] Detect suspicious wallet farming, repeated claims, fake tokens, swapped circular routes and referral self-invites with explainable enforcement.
- [ ] Use voluntary pseudonymous profiles; separate hashed anti-abuse data from publicly displayed addresses and allow correction/dispute.
- [ ] Keep points nontransferable and noncash, with no guaranteed retrospective token distribution, airdrop entitlement or fiat payout.
- [ ] Rebuild quest/referral outcomes after chain reorg/reset and publish unambiguous campaign schedules and fairness reports.

**Acceptance evidence:** Outside wallets complete authentic missions with no duplicate/forged point credit or fake retrodrop promises.  
**Blocker / stop condition:** A user can farm infinite rewards or leaderboards reveal sensitive identities.

### 14.26 — Community operations, support triage and ecosystem education

**Priority:** P1  
**Owner:** Community and developer relations  
**Current readiness:** Public testnet users/support staffing not yet established.

- [ ] Launch only official verified project channels, links and network setup instructions; avoid unofficial contract addresses.
- [ ] Develop hands-on guides for faucet claim, demo swap, pool creation/exit, limit-order cancellation and transaction inspection.
- [ ] Provide searchable known issues, public status, reset policy, supported wallets and testnet-only risk descriptions.
- [ ] Use a bug intake workflow collecting reproduction steps, chain, tx hash, module version, severity and optional device type.
- [ ] Implement triage assignment, duplicate merging, responder escalation and technical fix-to-release traceability for severe user failures.
- [ ] Prevent support impersonation and disclose that staff never request seed phrases, private keys or paid 'unlock' transactions.
- [ ] Run scheduled educational test events with clearly designated internal bots and no fabricated usage numbers.
- [ ] Analyze the most common onboarding failures and feed validated issues back into UI/documentation changes.

**Acceptance evidence:** Testers can self-serve basic tasks and urgent security/withdrawal errors reach a documented responder.  
**Blocker / stop condition:** Unverified support channels, seed phrase solicitations or unresolved mass user incidents.

### 14.27 — Real tester growth experiments, cohort retention and product evidence

**Priority:** P1  
**Owner:** Product research/analytics  
**Current readiness:** No actual independent-wallet cohort data presently available.

- [ ] Stage internal QA, invited external alpha, larger opt-in beta and only then open public cohorts subject to real infrastructure capacity.
- [ ] Test alternative onboarding copy, token claim guides, first-trade prompts and LP education against consented user cohorts.
- [ ] Track first claim→first swap→first LP deposit→full exit conversion from confirmed events rather than pageviews alone.
- [ ] Measure weekly active external test wallets and return sessions excluding CI runs, platform bots, fake referral loops and operator keys.
- [ ] Measure failure categories: wallet wrong-chain, signer denied, faucet no gas, excessive slippage, RPC timeout and LP exit errors.
- [ ] Run surveys and research sessions without collecting unnecessary personal information or asserting future economic token rewards.
- [ ] Prioritize UX fixes based on measured onboarding drop-offs, support evidence and transaction trace reproductions.
- [ ] Publish a source-backed testnet experiment report with exposure window, cohort size, confidence limitations and honest non-results.

**Acceptance evidence:** Independent tester cohorts demonstrate measurable task completion; no fabricated volume/user adoption.  
**Blocker / stop condition:** Metrics are dominated by project bots or uncontrolled reset destroys attribution.

### 14.28 — Security review, formal invariants, bug bounty and abuse readiness

**Priority:** P0  
**Owner:** Protocol security engineering  
**Current readiness:** Current static/Foundry gates do not constitute independent audit of future advanced contracts.

- [ ] Expand Foundry invariant/property tests for reserve conservation, LP redeemability, collateral backing, order partial fills, risk solvency and exact lending/vault receipt accounting.
- [ ] Run Slither and dependency audits with issue-by-issue remediation; separate false positives from untested assumptions and externally reviewed findings.
- [ ] Commission scoped independent testnet risk assessment for complex new financial contracts before widening enabled derivative/lending/agent features.
- [ ] Model chain ID confusion, fake RPC, proxy compromise, signer replay, hostile ERC20 callbacks, oracle manipulation and keeper/solver competition.
- [ ] Check admin privileges, multisig or separated test-only roles, emergency stop boundaries and direct-withdrawal ability during frontend outages.
- [ ] Provide responsible vulnerability disclosure/bug-bounty intake with transparent eligibility, disclosure timing and no promise of unavailable cash rewards.
- [ ] Conduct adversarial wallet/UI testing for seed phishing, malicious links, token spoofing, wrong spender and stale partial fills.
- [ ] Record security evidence, remaining weaknesses, retest results and per-module approval status before any beta activation.

**Acceptance evidence:** Audited-by-scope technical findings are resolved or gated, and enabled modules pass reproducing attack test suites.  
**Blocker / stop condition:** Unresolved critical vulnerability, unsafe delegated user authority or misleading audit assertion.

### 14.29 — Disaster recovery, scalability, resets and protected testnet operations

**Priority:** P0  
**Owner:** SRE/incident operations  
**Current readiness:** Local Anvil smoke and basic RPC Compose source exist, hosted recovery not proven.

- [ ] Run repeatable node/data restore and indexer replay from backed-up state, measuring time-to-safe-recovery separately from assumed SLOs.
- [ ] Rehearse corrupted checkpoint, deep reorg, duplicate event replay, broken explorer, missing block RPC and database credential rotation.
- [ ] Test high-concurrency quote reads, faucet claims, pool discovery, bounded trading and keeper work with stable system resource caps.
- [ ] Audit all infrastructure secrets and differentiate test operator, database migration, read-only worker, faucet signer and public API capabilities.
- [ ] Run production-style dry-run frontend rollback, module OFF/CLOSE_ONLY transitions and emergency user exit instructions.
- [ ] Publish testnet genesis/reset history and contract/version migration receipts before wiping any publicly used state.
- [ ] Ensure every saved user tx hash and synthetic position can be attributed to its historical chain instance after a reset.
- [ ] Create on-call escalation, severity ladder, postmortem template and re-enable checklist that require genuine on-chain reconciliation.

**Acceptance evidence:** Two different incident drills restore verifiable demo-chain/account state and prove no data or privilege confusion.  
**Blocker / stop condition:** Node outage, user LP trapped by UI, unannounced chain wipe or ambiguous old receipts.

### 14.30 — Large beta evaluation, operating scorecard and Milestone 15 handover

**Priority:** P0 closeout  
**Owner:** Release owner/product engineering  
**Current readiness:** No public M14 activation or independent cohort evidence exists yet.

- [ ] Release only a proven persistent user testnet with exact chain identity, free claim flow, spot trade, pool mint and complete LP withdrawal for outside wallets.
- [ ] Activate optional M12/M13 spot derivatives/orders/lending/vaults/agents strictly per actual verified code, security evidence, runtime health and signed operator go decisions.
- [ ] Execute a comprehensive user scenario matrix: zero-gas onboarding, swaps, create/add/remove LP, cancel order, open/close perp, repay mock loan and agent revoke where enabled.
- [ ] Reconcile genuine user tx receipts, wallet balances, pool reserves, collateral, risk ledger and canonical Neon aggregates at pinned blocks.
- [ ] Record actual throughput, p95 quote/RPC latency, user task success, fault recovery, gas distribution, oracle staleness and error rates.
- [ ] Publish human tester counts, simulated bot load and valueless synthetic notional separately, never as real liquidity or financial exchange revenue.
- [ ] Create a prioritized backlog of critical defects, security follow-ups, high-value UX improvements, experimental module rollbacks and hosting costs.
- [ ] Publish a signed M14 release report and distinct M15 testnet strategy charter; no automatic mainnet or real-funds deployment authorization.

**Acceptance evidence:** Several independent external wallets complete all declared enabled test paths with receipts, stable services and reproduced indexed metrics.  
**Blocker / stop condition:** Missing external receipts, unverified modules, material security gap or unreported fake user activity.

## Required architecture and integration graph

```text
INDEPENDENT EXTERNAL WALLET (demo network only)
  |-- Connection + exact test chain/genesis/codehash preflight
  |-- Faucet zero-gas challenge --> sponsor queue --> bounded test operator key
  |-- Spot terminal --> quote engine --> signed allowance --> V2 Router/Pair
  |-- Liquidity UI --> Factory/Router --> test LP shares and exits
  |-- (gated) Advanced orders --> EIP-712 signature --> settlement/solver
  |-- (gated) Perps --> approved oracle + margin risk --> clearing/liquidation
  |-- (gated) Lending/options/vaults --> their OWN proven risk/settlement adapters
  |-- (gated) Agent --> revocable delegated limits --> permitted intent
  |
  |--> Actual test-chain receipts / event logs (not UI-fabricated results)
          |
          +--> Canonical/reorg-safe Neon indexing (chain + genesis + codehash)
          |       +--> Wallet history and reserve/position reconciliation
          |       +--> Honest OHLCV, funnel/cohort analytics and operations
          |       +--> Quest/leaderboard proof with bot exclusion
          +--> Trusted independent read-only explorer
          +--> Contract state reads at pinned blocks
```

**Trust boundaries:** Public SDK and frontend hold no private platform keys. Faucet, keeper, operator and contract admin have distinct restricted permissions and incident/rotation procedures. Public RPC gateway never exposes `anvil_*`, `personal_*` or node admin/impersonation APIs. All irreversible user actions are transactions signed on the *separate fake-value test chain*, not on VERY Mainnet 4613.

## Proposed implementation modules (paths are ideas, NOT pre-existing files)

```text
infra/devnet/                # review/pin persistent EVM node and RPC gateway
infra/observability/         # chain/RPC/indexer/faucet metrics and alerts
config/releases/testnet/     # genesis, codehash, ABI and phase-by-phase evidence
contracts/src/               # existing AMM; optional new contracts only after gating
scripts/smoke-testnet.mjs    # existing disposable-wallet full LP exit proof
services/indexer/            # current event ingestion, future versioned module events
services/analytics/          # candles, adoption funnels, test-bot traffic labeling
services/solvers/            # only if reviewed EIP-712 settlement exists
services/agents/             # only after bounded delegation security approval
app/testnet/                 # actual swap, pool, viewer; additional gated pages
lib/testnet/sdk/             # caller-owned signing, ABI/version provenance
tests/m14/                  # deterministic performance, wallet, reorg and abuse tests
docs/M14-RELEASE-EVIDENCE.md # only fill with actual receipts and verified observations
```

## Test acceptance matrix by module

| Module | Minimum real proof | Status if evidence is absent |
|---|---|---|
| Persistent chain + explorer | Independent HTTPS RPC, correct genesis, external wallet and restart continuity | NOT PUBLIC |
| Faucet | Brand-new wallet gets valueless gas and tokens with rate-limit receipts | DISABLED |
| Spot AMM | Real token/token and native/token test receipts + exact reserve deltas | OFF |
| Liquidity | Pool create, two LP deposits and complete redeemable LP exit | OFF |
| Indexer + charts | Canonical replay, reorg test and exact reserve/candle reproducibility | HISTORICAL DATA UNAVAILABLE |
| Orderbook/solvers | Real signed on-chain partial fill, cancel and expiry | EXPERIMENTAL / OFF |
| Perpetuals | Valid oracle + margin backing + opened/closed/liquidated demo trades | OFF |
| Options/lending/vaults | Individually proven source, collateral, receipt shares and full/controlled exits | OFF |
| Delegated AI agents | Bounded user approval, real demo action, instant on-chain revocation | OFF |
| Community points | Deterministic confirmed-event scoring and bot exclusions | INACTIVE |
| Public beta | Several independent outside wallets, incident/restart drills and honest KPI publication | NOT LAUNCHED |

## Release gates and order of execution

**Gate 0 — Prove M11 in public.** Provision the real separately identified EVM node/HTTPS RPC and explorer, deploy verified demo contracts, enable first-claim sponsored faucet, collect outside wallet swap and LP-withdrawal hashes, and validate Neon chain/indexer state. No other gate can waive this.

**Gate 1 — Stabilize core infrastructure.** Execute stages 14.1–14.6 and 14.13, 14.16–14.18, 14.28–14.29. Establish observed operating baseline and reduce first-trade/withdrawal failures.

**Gate 2 — Upgrade organic trading and LP use.** Complete 14.7–14.8 and 14.12, 14.14–14.15 with honestly bot-separated volume; monitor real tester performance.

**Gate 3 — Grow developer and integration tools.** Enable 14.19, 14.22–14.24 with independently validated SDK, user-created demo tokens and a compatible adapter registry. Agent experiments 14.20 depend on separately verified permissions.

**Gate 4 — Optional complex financial experiments.** 14.9–14.11 and 14.21 only after relevant M12/M13 Solidity, risk engine, oracle, settlement and security tests **actually exist** and pass independently. Never advertise missing perps/options/lending/bridge as active.

**Gate 5 — User beta and M15 charter.** 14.25–14.27, 14.30, with actual independent users, confirmed transactions, real metrics, bot exclusions and incident evidence.

## Detailed operational test-user journey

1. **Onboard:** Open verified official Lidde testnet hostname, inspect distinct chain and zero-value notice, connect user-held wallet.
2. **Get assets:** Sign faucet claim without paying actual money, receive native test gas plus synthetic tokens. Verify receipt and quotas.
3. **Spot execution:** Approve exact spend, execute swap, inspect pool reserve changes and token balance deltas in trusted explorer.
4. **Provide LP:** Create or use demo pool, deposit tokens, check LP mint and locked minimum, then withdraw part and all redeemable LP.
5. **Use market data:** Observe the same swaps and LP actions indexed to canonical Neon blocks and accurate charts.
6. **Optional advanced:** Use only already-deployed gated signed limit-order, perp, lending, option or strategy modules, always with controlled risk and genuine receipts.
7. **Optional agent:** Delegate a very small fake-value trade to a sandbox agent, then revoke and verify further trades are impossible.
8. **Join campaign:** Earn noncash points from genuine events and inspect transparent anti-bot scoring, with no promised token distribution.
9. **Fail safely:** Test wrong chain, rejected signature, stale quote, denied faucet, temporary RPC outage, keeper stop and frontend restart.
10. **Finish and exit:** Close orders/positions/loans and LP, reclaim all eligible valueless assets and reconcile every final account amount.

## Required evidence for an M14 closure report

- Chain/genesis/deployment registry and exact contract transactions.
- Foundry fuzz/invariant runs, Slither findings, app/typecheck CI and independent security review where scoped.
- Test wallet receipt hashes for free faucet, token swap, pool creation, partial and full LP exit.
- Actual uptime, observed p95 RPC/quote latency, indexing lag, application build version and resource costs.
- On-chain bot vs external wallet activity breakdown, activation/retention funnels and unpriced-value disclosures.
- Canonical Neon reconciliation report, reorg replay test and market data replay samples.
- Emergency/roll-back/backup restore drills and owner signoffs with remaining defects.
- Per-module enabled/OFF flags with exact source and signer policies.
- M15 roadmap based on actual user and operator learning, with real-value/mainnet launch still separately prohibited.

**Milestone 14 completion is evidence-based.** This roadmap alone proves none of the infrastructure, financial modules, user count, security claims, performance metrics or active testnet deployments described above.
