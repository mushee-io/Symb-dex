# SYMB DEX — MILESTONE 10: DEEP PUBLIC TESTNET MASTER PLAN

> **CURRENT PRODUCT DIRECTION: TESTNET FOR USERS — NO REAL FUNDS, NO MAINNET DEPLOYMENT.**
>
> Every exchange operation should execute against actual test-network contracts and produce real **test-chain** receipts, not animated demo UI or fake transactions. Test token amounts have no cash value, test-volume figures are not real financial volume, and testnet points are not promised tokens or payouts.

**Repository:** [mushee-io/symb-dex](https://github.com/mushee-io/lidde-dex). **Root:** [README.md](README.md). **Existing Solidity:** [contracts/src](contracts/src). **Prior network planning:** [MILESTONE-08.md](MILESTONE-08.md) and [MILESTONE-09.md](MILESTONE-09.md) are future/mainnet-oriented historical planning documents and **do not define the current user-testnet sprint**.

## Testnet network requirement — IMPORTANT

VERY's public documentation (as checked 24 October 2026) establishes **VERY Mainnet** chain ID `4613`, RPC `https://rpc.verylabs.io` and explorer `https://veryscan.io`. A published network-specification page lists public testnet RPC and explorer as `null`, and no official VERY testnet endpoint could be independently verified. We must **not** use chain ID 4613 to pretend that transactions are on testnet, nor use real VERY to fund the public testing programme.

**Primary deployment path:** obtain official VERY testnet details from chain operators if available; **otherwise** provision a *persistent separate EVM Symb development/test network* with its own chain ID, native test gas, RPC, explorer, faucet and independently labelled branding. This is Symb-operated testing infrastructure, not an official VERY testnet. A local ephemeral Anvil instance alone does not provide persistent public network access; use persistent nodes and reliable storage for invited testers. Both frontend, SDK, deploy tooling and indexer must require the verified test chain ID.

Official source references:
- https://verylabs.io/whitepaper/en/verychain/
- https://verylabs.io/whitepaper/en/developers/
- https://wp.verylabs.io/verychain/network-specifications

## Testnet success definition

- [ ] User connects wallet and identifies a distinct test chain with **zero value** assets.
- [ ] User claims test gas and ERC-20s from working faucet; there is no real-world payment.
- [ ] User successfully performs token and wrapped-native swaps with on-chain test receipts.
- [ ] User creates a verified demo pool, deposits liquidity and fully redeems LP shares.
- [ ] User can inspect real test-chain pool reserves, wallet positions, history and OHLCV data.
- [ ] Optional advanced test products (limit orders, DCA, farms, token creator, range pools) are *explicitly experimental* and individually gated until they work.
- [ ] Rewards/quests/leaderboards reflect real test-chain actions, not fabricated volume or guaranteed future distributions.
- [ ] Indexer and Neon state can recover after restart and reorg/reset without duplicating score.
- [ ] Multiple external invited wallets and devices complete tasks without needing seed phrases or mainnet assets.

## 25 deep workstreams / 175 checkable engineering tasks

| Number | Workstream | Source vs deployment status |
|---|---|---|
| **10.1** | Choose and verify Symb's persistent test network | Official VERY testnet endpoint is not verified; don't reuse mainnet 4613. |
| **10.2** | Deploy separate Solidity Factory, Pair, Router and wrapped test token | Contracts already exist locally; no public test network deployment. |
| **10.3** | Issue full suite of synthetic testing tokens | All test assets must be generated on isolated testing network. |
| **10.4** | Build the testnet gas and asset faucet | Public faucet service does not yet exist. |
| **10.5** | Deep wallet onboarding and network auto-switching | Existing wallet code must be isolated to testnet registry. |
| **10.6** | Make swaps fully functional with actual testnet state transitions | Existing V2-style swap UI must be connected to deployed test contracts. |
| **10.7** | Advanced routing, price impact and route comparison | Baseline direct and WVERY hop routes; optimization is an M10 build. |
| **10.8** | Create pools, add liquidity and withdraw testnet LP tokens | M05 liquidity UI exists as gated source; needs public demo deployment. |
| **10.9** | Deep LP portfolio, position history and earned-fee estimates | LP share functions exist; fee history needs M06C logic. |
| **10.10** | Concentrated liquidity and next-generation pool experiments | Distinct additional AMM version, not compatible with current V2 Router by default. |
| **10.11** | Testnet token creator and one-click pool launcher | Synthetic-token launchpad, NOT fundraising/token sale. |
| **10.12** | Limit orders via signed intents and bounded settlement | New infrastructure; swaps alone do not provide limit-order settlement. |
| **10.13** | DCA and scheduled trading automation (opt-in) | Additional independent execution service required. |
| **10.14** | Testnet yield farms, LP staking and emission controls | Separate testnet reward token and contracts; no real yield. |
| **10.15** | Quests, achievement system and transaction-based points | Points are app-level records, not token allocations. |
| **10.16** | Referrals, seasons, community competitions and leaderboard | Growth mechanics must not reward fake trades or require real funds. |
| **10.17** | Neon event indexer, user activity and quest data pipeline | M06A/B indexer source exists; must adapt to separate dev chain. |
| **10.18** | Professional market data, charts and testnet analytics | M06C-F visualization is planned; chain records will be real test transactions. |
| **10.19** | Testnet transaction explorer and verification tools | Needs a real testnet explorer or internal transaction viewer. |
| **10.20** | Open APIs, JavaScript SDK and trading bot playground | Read-only APIs and limited test-write toolchain. |
| **10.21** | Mobile-first frontend and optional Telegram Mini App | Responsive web mandatory; Telegram Mini App optional stretch. |
| **10.22** | User-owned testnet social profiles and gamification | Optional identity layer; never mandate personal data. |
| **10.23** | Contract safety, wallet abuse controls and negative testing | All real-value/mainnet locks remain unchanged. |
| **10.24** | Reliability, CI/CD, network resets and testnet observability | Persistent devnet requires uptime, funding and maintenance operations. |
| **10.25** | Public testnet invitation, feedback, metrics and next milestone | Deep M10 testnet build is not yet implemented. |

## Build sequence

**Phase A: Test network, contracts, demo assets and faucet** — 1–5. 10.1, 10.2, 10.3, 10.4, 10.5.

**Phase B: Deep exchange trading, routing, pools and liquidity** — 6–10. 10.6, 10.7, 10.8, 10.9, 10.10.

**Phase C: Advanced trading products, farms and launch tools** — 11–14. 10.11, 10.12, 10.13, 10.14.

**Phase D: Community quests, referrals and measurable testnet use** — 15–16. 10.15, 10.16.

**Phase E: Indexer, charts, developer APIs and clients** — 17–22. 10.17, 10.18, 10.19, 10.20, 10.21, 10.22.

**Phase F: Security, operations and public testnet release** — 23–25. 10.23, 10.24, 10.25.

## Full checkable implementation specification

### 10.1 — Choose and verify Symb's persistent test network

**Owner:** Network engineering  
**Current status:** Official VERY testnet endpoint is not verified; don't reuse mainnet 4613.

- [ ] Check official VERY documentation and operator announcements for an authentic testnet chain ID, RPC, explorer, gas token and faucet.
- [ ] If no public VERY testnet is confirmed, launch a persistent isolated EVM devnet with its OWN chain ID, RPC, explorer, faucet and block storage; document that it is a Symb developer network, not an official VERY testnet.
- [ ] Define deterministic configuration: network id, native mock token, RPC read/write endpoints, finality policy, timestamp and compatible EVM opcode target.
- [ ] Confirm wallet `eth_chainId` response and Explorer chain genesis before any contract deployment; reject chain ID 4613 in testnet deployment tooling.
- [ ] Design independent development, integration and public test environments and stable upgrade/reset policy, with separated signing accounts.
- [ ] Add public status/network setup instructions, chain metadata JSON and an RPC health check; mark test assets valueless.
- [ ] Record reset plans, usage capacity and compatibility changes so testers are not surprised when network state restarts.

**Acceptance evidence:** Valid own-chain test network metadata and explorer/RPC/faucet tests; mainnet chain ID rejected.  
**Stop condition:** Unknown chain identity or any use of native mainnet VERY for test rewards.

### 10.2 — Deploy separate Solidity Factory, Pair, Router and wrapped test token

**Owner:** Smart contract engineering  
**Current status:** Contracts already exist locally; no public test network deployment.

- [ ] Recompile the root MIT-licensed Solidity contracts with Foundry and record source hash, compiler, ABI and bytecode.
- [ ] Deploy a mock wrapped-native test token to the chosen testnet (never confuse with canonical WVERY on mainnet).
- [ ] Deploy Factory and Router with matching factory/wrapper constructor inputs and verify pair CREATE2 provenance.
- [ ] Record each address, deployment transaction, source hash, chain ID, codehash and block in `config/deployments.testnet.json`.
- [ ] Create release modes `local`, `public-testnet`, `mainnet-disabled` and enforce network mismatch errors across UI, scripts and indexer.
- [ ] Run initial create/swap/mint/burn tests on the persistent network with fake-value tokens and verify emitted events.
- [ ] Add safe versioned deployments/migration strategy; when resetting chain provide archived receipts and explicit invalidation notice.

**Acceptance evidence:** Public testnet explorer receipts and correct Factory/Router/Pair/wrapped-demo contract bindings.  
**Stop condition:** Missing verified contract code or accidentally enabling mainnet registry.

### 10.3 — Issue full suite of synthetic testing tokens

**Owner:** Token engineering  
**Current status:** All test assets must be generated on isolated testing network.

- [ ] Deploy explicit tVERY gas/native-demo token and test ERC-20 equivalents: tUSD, tUSDC, tUSDT, tBTC, tETH and one project-demo token.
- [ ] Provide multiple decimal configurations (e.g. 6/8/18) to stress parsing, quoting, fee math and rounding.
- [ ] Document mock backing: NONE. Stablecoin names are synthetic and do not represent live issued USD, BTC or ETH.
- [ ] Add controlled mint caps, mint events, operator supply limits and clear reset behaviour.
- [ ] Seed reviewed test pools with repeatable mock price ratios without claiming real market values.
- [ ] Include malicious/testing tokens for callback, tax, no-return, false-return and rebasing simulations on a separate developer-only playground.
- [ ] Publish a verifiable token directory with addresses, chain ID, decimals, source-code links, faucet eligibility and demo badges.

**Acceptance evidence:** Users can obtain and trade correctly named valueless demo tokens with accurate balances.  
**Stop condition:** Any real stablecoin address, bridge or cash-backed claim in testnet mode.

### 10.4 — Build the testnet gas and asset faucet

**Owner:** Backend, abuse-prevention engineering  
**Current status:** Public faucet service does not yet exist.

- [ ] Provide connect-wallet + `Claim Test Tokens` UX with eligibility and clear per-token amounts.
- [ ] Dispense test gas token and tUSD/tUSDC/tBTC/tETH from separate rate-limited test reserves.
- [ ] Build an authorization/rate-limit service to control claim frequency by wallet and abuse signals, not just by a visible button.
- [ ] Implement CAPTCHA or privacy-conscious proof-of-humanity as optional friction for mass botting.
- [ ] Persist claim ID, wallet, timestamp, tx hash and chain confirmation in Neon with idempotent distribution.
- [ ] Add reserve monitoring, automatic replenishment from limited operator mint rights and graceful 'temporarily unavailable' states.
- [ ] Never require a deposit, real VERY, seed phrase, social payment or off-chain bank/card information to obtain test tokens.

**Acceptance evidence:** Successful faucet transfers to multiple wallets, rate-limit tests and zero paid-asset requirement.  
**Stop condition:** Faucet can drain unlimited mint allowance or asks users for real funds.

### 10.5 — Deep wallet onboarding and network auto-switching

**Owner:** Wallet/frontend engineering  
**Current status:** Existing wallet code must be isolated to testnet registry.

- [ ] Support EIP-6963 browser-injected wallets plus optional WalletConnect mobile sessions.
- [ ] Offer `Add Symb Testnet` or `Switch Network` only with independently verified testnet chain details.
- [ ] Read chain ID and account before every approval or signing operation; never reuse mainnet 4613 as testnet.
- [ ] Display faucet balances, token decimals, native gas, account history and wallet provider clearly.
- [ ] Implement session persistence, account switching, rejected signatures, wrong-network errors and safe disconnect.
- [ ] Display visible TESTNET badge on every funding, trade, approval and rewards view.
- [ ] Provide onboarding walkthrough without collecting wallet seed/private key.

**Acceptance evidence:** Multiple real wallets connect on the test network and reject wrong chain/wallet state.  
**Stop condition:** Any transaction can route to a mainnet address or ask for user secrets.

### 10.6 — Make swaps fully functional with actual testnet state transitions

**Owner:** Trading engine  
**Current status:** Existing V2-style swap UI must be connected to deployed test contracts.

- [ ] Connect token selectors to verified testnet contract addresses and pool discovery.
- [ ] Quote from actual reserve reads and verified fee model using exact bigint/decimals (no client-side fake fills).
- [ ] Support token/token, native-demo/token and token/native-demo via real router transactions.
- [ ] Enforce deadline, slippage, minimum received, recipient, gas estimate, current balance and exact allowance.
- [ ] Simulate then sign; track transaction hash, pending/confirmed/reverted/unknown receipts and explorer links.
- [ ] Show price impact, effective exchange rate, route breakdown and refreshed wallet balances after trades.
- [ ] Cover tiny/huge amounts, insufficient liquidity, stale reserves, no pair and malicious token failure paths.

**Acceptance evidence:** End-to-end real testnet swap receipts, on-chain balance/reserve changes and wallet UX proof.  
**Stop condition:** A 'Swap' button only animates locally or produces synthetic volume.

### 10.7 — Advanced routing, price impact and route comparison

**Owner:** Smart routing engineering  
**Current status:** Baseline direct and WVERY hop routes; optimization is an M10 build.

- [ ] Build bounded path graph from verified factory pools and supported tokens.
- [ ] Compare direct vs two-hop and approved three-hop paths, with estimated output and gas.
- [ ] Reject cycles, duplicated pairs, unreviewed pools, empty reserves and path overflow.
- [ ] Simulate quote changes between read and execution, adjusting minimum output safely.
- [ ] Add transparent route cards, price-impact warning and gas-adjusted quote comparison.
- [ ] Measure routing efficiency against direct swaps on real testnet transaction fixtures.
- [ ] Reserve multi-split execution or external DEX aggregation as future work until new contracts and settlement accounting are reviewed.

**Acceptance evidence:** Deterministic best-route selection, simulation and tested multi-hop execution receipts.  
**Stop condition:** Misleading guaranteed best price or route bypass of verified-pair validation.

### 10.8 — Create pools, add liquidity and withdraw testnet LP tokens

**Owner:** Liquidity engineering  
**Current status:** M05 liquidity UI exists as gated source; needs public demo deployment.

- [ ] Offer pool creation for approved test tokens and show first-deposit price ratios before sending.
- [ ] Verify Factory PairCreated, Pair Sync and initial minimum LP lock after the first deposit.
- [ ] Support second provider deposits in correct reserve ratios and display unused/refunded amounts.
- [ ] Provide native-demo/token add-liquidity and exact approval flow for ERC-20/ERC-20.
- [ ] Allow percentage/custom LP removal with real Burn events, slippage and native-demo unwrap.
- [ ] Update pool reserves, total supply and wallet LP holdings immediately after confirmed receipts.
- [ ] Publish clear testnet-only pool risks, arbitrary initial prices and full ownership/exit instructions.

**Acceptance evidence:** Real mint/add/remove receipts on testnet with full reserve and LP-supply reconciliation.  
**Stop condition:** Failed withdrawals or fabricated pool ownership.

### 10.9 — Deep LP portfolio, position history and earned-fee estimates

**Owner:** Portfolio and analytics engineering  
**Current status:** LP share functions exist; fee history needs M06C logic.

- [ ] Display each wallet's LP token balance, underlying reserves, share percentage and position block.
- [ ] Attribute deposits and withdrawals from actual Mint/Burn/Transfer logs with transfer-aware accounting.
- [ ] Estimate fee income from V2 reserve growth and trade history; distinguish it from price movements and impermanent loss.
- [ ] Show cumulative deposits, withdrawals, mock-USD value, time in pool and realized vs unrealized components when reliably calculated.
- [ ] Use testnet synthetic prices and label them 'simulation reference', not market valuations.
- [ ] Link every displayed position change to a real testnet tx hash and consistent indexed block.
- [ ] Provide position export/download and transparent 'insufficient data' messages.

**Acceptance evidence:** Reproducible wallet LP position and fee attribution reports consistent with chain events.  
**Stop condition:** Claiming users can claim LP fees separately when they actually accrue in reserves.

### 10.10 — Concentrated liquidity and next-generation pool experiments

**Owner:** AMM research engineering  
**Current status:** Distinct additional AMM version, not compatible with current V2 Router by default.

- [ ] Research an optional V3-style tick/range liquidity module with separate independently tested source and price math.
- [ ] Implement tick spacing, fee tiers, liquidity net/gross and per-position accounting in isolated contracts if the research is approved.
- [ ] Build simulation for out-of-range LPs, active liquidity, fee growth and range-based impermanent-loss scenarios.
- [ ] Use a distinct pool factory/position manager and explicit ABI versioning; never masquerade V3 pools as current V2 pairs.
- [ ] Add separate UI selection 'Classic Pools' vs 'Experimental Range Pools' with risk/beta banner.
- [ ] Run property-based price math and tick-crossing tests before any persistent testnet activation.
- [ ] Keep this feature behind an experimental flag until verified; avoid promising capital efficiency or yield.

**Acceptance evidence:** Distinct test contracts, explicit pool types, ticks/fees accounting and end-to-end range-position tests.  
**Stop condition:** Cross-version router confusion, LP accounting failures or fake V3 features.

### 10.11 — Testnet token creator and one-click pool launcher

**Owner:** Developer tooling  
**Current status:** Synthetic-token launchpad, NOT fundraising/token sale.

- [ ] Provide token creation form: mock name, ticker, decimals, supply, image metadata and deployer address.
- [ ] Deploy limited test-only ERC-20 via audited/reviewed sandbox factory or controlled templates.
- [ ] Allow users to generate initial pool with verified token + tUSD or native demo and clear first-price disclosure.
- [ ] Add per-wallet creation rate limits, symbol collision handling and unverified-asset badges.
- [ ] Display newly created token contracts, genesis supply, mint authorities and ownership controls.
- [ ] Build token directory and developer links while separating official seeded tokens from community creations.
- [ ] Do not include real fundraising, paid token sale, bridging or claimed real-world value in M10.

**Acceptance evidence:** User deploys a fake-value token and creates a functional on-chain liquidity pool.  
**Stop condition:** Any token launch asks for payments in real assets or pretends to represent real investments.

### 10.12 — Limit orders via signed intents and bounded settlement

**Owner:** Execution and order service  
**Current status:** New infrastructure; swaps alone do not provide limit-order settlement.

- [ ] Define typed limit-order data: maker, chain, token pair, amount, limit price, expiry, nonce, recipient and cancellable salt.
- [ ] Choose EIP-712 user signatures or explicit escrow model; do not call local JavaScript alerts 'on-chain limit orders'.
- [ ] Implement order storage in Neon, signature and replay protection, owner cancellation and partial-fill accounting.
- [ ] Implement permissioned/reviewed demo filler bot, exact settlement smart contracts, slippage and stale-price checks.
- [ ] Build orderbook/order history UI with Open, Partially filled, Filled, Expired, Cancelled and Failed states.
- [ ] Test crossed orders, no liquidity, failed fillers, user balance changes, replay and invalid signature attacks.
- [ ] Publish whether order execution requires a running backend bot; do not promise guaranteed fills.

**Acceptance evidence:** Signed demo orders settle/cancel on the test chain with receipts and replay protection.  
**Stop condition:** Fills occur off-chain only or user funds/orders cannot be safely cancelled.

### 10.13 — DCA and scheduled trading automation (opt-in)

**Owner:** Automation and keeper engineering  
**Current status:** Additional independent execution service required.

- [ ] Create DCA plan interface for demo token pair, amount, repeat interval, budget, start/stop and max price impact.
- [ ] Use explicit, revocable user authorization (escrow or bounded permit/delegation) for automated testnet execution.
- [ ] Deploy a scheduler/keeper with persisted job state, nonces and retry/backoff; ordinary frontend timers are insufficient.
- [ ] Define max executions, per-period volume caps, cancellation and pause behavior under insufficient gas/liquidity.
- [ ] Record scheduled, attempted, confirmed, skipped and failed jobs with on-chain tx links.
- [ ] Test scheduler restarts, missed cadence, chain outages and duplicate-trigger idempotency.
- [ ] Label every execution as testnet-only and avoid implying orders are filled when no keeper runs.

**Acceptance evidence:** Scheduled simulated/demo swaps execute with bounded approval and verifiable receipts.  
**Stop condition:** Unbounded approvals, accidental repeated trades or nonfunctional scheduler advertised as active.

### 10.14 — Testnet yield farms, LP staking and emission controls

**Owner:** Farming contract engineering  
**Current status:** Separate testnet reward token and contracts; no real yield.

- [ ] Deploy a demo reward token and reviewed MasterChef-like staking pool or bounded per-block emission contract.
- [ ] Support staking/unstaking actual demo LP tokens, pending reward accounting and reward claim.
- [ ] Add testnet farming dashboard with staked LP, emission rate, pending points and example APY calculations clearly labeled simulated.
- [ ] Bound reward minting and include explicit owner/admin permissions and refill/reset policy.
- [ ] Test reward precision, multiuser share changes, start/end epochs and emergency withdrawal.
- [ ] Exclude irreversible lockups and real-world asset commitments; all farm values are fake.
- [ ] Keep farming behind risk tests and disable if accounting invariants fail.

**Acceptance evidence:** Multiple wallets stake demo LP and claim test rewards with exact contract accounting.  
**Stop condition:** Misrepresented ROI, vulnerable reward minting or stuck LP deposits.

### 10.15 — Quests, achievement system and transaction-based points

**Owner:** Growth/product and data engineering  
**Current status:** Points are app-level records, not token allocations.

- [ ] Define repeatable tasks: connect wallet, claim faucet, first swap, first liquidity, swap days, new pool creation, LP retention and referrals.
- [ ] Credit achievements only after confirmed on-chain actions, not button clicks or synthetic transactions.
- [ ] Store chain/network/tx hash/relevant event IDs so the same activity cannot be counted twice.
- [ ] Build user progress, badge gallery, levels, streaks, milestones and transparent point scoring rules.
- [ ] Rate-limit trivial zero-volume activity, duplicate wallets and reset farming; choose anti-bot measures proportional to privacy.
- [ ] Build administrative rule-versioning and dispute/correction process for miscounted activity.
- [ ] State explicitly that testnet points are nontransferable and do not guarantee a future airdrop.

**Acceptance evidence:** Deterministic point attribution with inspectable rule versions and confirmed transaction provenance.  
**Stop condition:** Points minted through repeated replay, fake volume or opaque undisclosed rules.

### 10.16 — Referrals, seasons, community competitions and leaderboard

**Owner:** Community product engineering  
**Current status:** Growth mechanics must not reward fake trades or require real funds.

- [ ] Create opt-in referral codes and landing links with invitation attribution.
- [ ] Reward qualified activation, not mere wallet connections; use confirmed testnet activity for qualification.
- [ ] Develop seasons for swaps, LP contributions, pools created, bugs reported and educational challenges.
- [ ] Build leaderboards with distinct legitimate transaction/wallet counts and anti-wash-trading safeguards.
- [ ] Separate public wallet handles from private account information and permit nickname privacy.
- [ ] Provide campaign management, start/end time, score version and transparent appeals for bans or errors.
- [ ] Use only testnet badges/points, without declaring actual token entitlements or fund payouts.

**Acceptance evidence:** Test seasons and referrals resist duplicate count and produce honest public scoreboards.  
**Stop condition:** Unbounded farming incentives, privacy leakage or inflated fake trading volume.

### 10.17 — Neon event indexer, user activity and quest data pipeline

**Owner:** Data engineering  
**Current status:** M06A/B indexer source exists; must adapt to separate dev chain.

- [ ] Parameterize M06 indexer by configured testnet chain ID and factory; remove hardcoded 4613 assumptions only behind explicit verified test mode.
- [ ] Run private staging/production-demo Neon schemas and track canonical block hashes, factory-created pairs, swaps, LP actions and LP transfers.
- [ ] Backfill demo-chain history from first deploy block with idempotent writes and resumable cursors.
- [ ] Exercise reorg simulator, restart recovery, competing indexer writers and event decoding across V2 and optional new pool versions.
- [ ] Persist wallet activity, quest eligibility and referrals in separate schemas with immutable idempotency keys.
- [ ] Provide read-only paginated APIs with cache/lag info and exact integer amounts.
- [ ] Make synthetic/demo USD valuations visibly labeled and suppress history when indexer health is degraded.

**Acceptance evidence:** Indexer reconciles to exact sandbox chain blocks and drives wallet/quest stats without double-counting.  
**Stop condition:** Wrong-chain event mixing, stale reserve accounting or fabricated activity.

### 10.18 — Professional market data, charts and testnet analytics

**Owner:** Market data frontend engineering  
**Current status:** M06C-F visualization is planned; chain records will be real test transactions.

- [ ] Generate time-bucketed OHLCV candles from confirmed testnet Swap events and consistent token ordering.
- [ ] Show per-market depth, reserves, slippage simulations, volume and active wallets with explicit 'test tokens only' labels.
- [ ] Build a trading chart with appropriate intervals, trade markers, candle data gaps and honest data freshness.
- [ ] Add market list ranking by verified testnet liquidity, transaction count, on-chain trading volume and age.
- [ ] Compute portfolio performance using explicitly synthetic pricing and warn when price is undefined.
- [ ] Expose dashboard of indexer head, recent blocks, latest transaction receipts and supported pool types.
- [ ] Validate metrics against sampled actual explorer/chain receipts before claiming that charts are connected.

**Acceptance evidence:** Interactive market charts and exchange analytics reflect real persistent testnet trades.  
**Stop condition:** Stock/synthetic mock price graphs masquerading as live market data.

### 10.19 — Testnet transaction explorer and verification tools

**Owner:** Explorer/infrastructure engineering  
**Current status:** Needs a real testnet explorer or internal transaction viewer.

- [ ] Host or integrate a real explorer for the selected public sandbox EVM chain, recording proper genesis and code metadata.
- [ ] Provide transaction detail page showing tx hash, block, status, gas, signatures and decoded Swap/Mint/Burn events.
- [ ] Add verified project contracts, contract ABI and test-token source links where supported.
- [ ] Make every significant UI write link to its transaction hash; no invented or repeated receipts.
- [ ] Offer pool history, factory pair creation, contract address search and wallet activity views.
- [ ] Provide RPC diagnostics and read-only block verification for testers and developers.
- [ ] Explicitly distinguish Symb-operated devnet explorer from an official VERY explorer if not provided by the chain operator.

**Acceptance evidence:** Searchable real test-chain blocks/transactions and exact wallet receipt links.  
**Stop condition:** Misleading 'VERY official testnet explorer' branding without provenance.

### 10.20 — Open APIs, JavaScript SDK and trading bot playground

**Owner:** API developer experience  
**Current status:** Read-only APIs and limited test-write toolchain.

- [ ] Publish versioned endpoints for markets, pools, quotes, wallet positions, trades, candles and indexer health.
- [ ] Implement signed order creation only through wallet-approved auth, with authentication/nonce validation and no custodial private-key collection.
- [ ] Write minimal SDK functions for getPools, getQuote, simulateSwap, buildSwapTransaction, addLiquidity and removeLiquidity.
- [ ] Provide example integration for bots/agents to perform bounded fake-value swaps using their own locally held test wallets.
- [ ] Add request rate limits, cursor pagination, RPC caching and API versioning.
- [ ] Publish OpenAPI spec, typed examples, chain/network config and errors/response freshness.
- [ ] Test SDK against same deployed testnet Pair/Router contracts and an isolated CI fixture chain.

**Acceptance evidence:** External developer can reproduce a real demo quote and signed test transaction from documented SDK.  
**Stop condition:** Backend can sign users' funds or SDK points to real mainnet without explicit separate authorization.

### 10.21 — Mobile-first frontend and optional Telegram Mini App

**Owner:** Client/platform engineering  
**Current status:** Responsive web mandatory; Telegram Mini App optional stretch.

- [ ] Complete responsive Swap/Pools/Create/Portfolio/Farm/Rewards/Launchpad/Explore flows for small screens.
- [ ] Support embedded wallet or approved mobile wallet connect while preserving signer review and no server-held seed.
- [ ] Design one-tap faucet → swap → LP onboarding journey with accurate loading/confirmed steps.
- [ ] Provide accessible dark/light themes, keyboard support, touch target sizing, reduced motion and error guidance.
- [ ] Optionally build Telegram Mini App with secure init data verification and external wallet signing capability where supported.
- [ ] Ensure mobile and mini-app UI display a prominent TESTNET / NO VALUE banner.
- [ ] Test Safari/Chrome/Android/iOS browser compatibility and recoverable wallet disconnect/reconnect.

**Acceptance evidence:** User can claim, swap, add LP and inspect history from phone without real-value transfer.  
**Stop condition:** Wallet signing bypass or broken critical mobile flow.

### 10.22 — User-owned testnet social profiles and gamification

**Owner:** User experience/data engineering  
**Current status:** Optional identity layer; never mandate personal data.

- [ ] Offer opt-in wallet-linked nickname, avatar, testnet badges and activity summary.
- [ ] Support anonymous testnet use without social login or profile creation as a prerequisite for swaps.
- [ ] Show personal trading quests, achievements, referral score and wallet transaction proofs.
- [ ] Build shareable receipts or stat cards marked demo/testnet with chain tx attribution.
- [ ] Add opt-in notifications for quest progress, faucet refill eligibility and test campaign start/end.
- [ ] Limit personal data collection, implement deletion/privacy controls and warn before public wallet leaderboard exposure.
- [ ] Moderate spam/impersonation within community profile features and allow reporting.

**Acceptance evidence:** Privacy-respecting opt-in social stats with real demo activity provenance.  
**Stop condition:** Sensitive wallet/profile linkage exposed without consent.

### 10.23 — Contract safety, wallet abuse controls and negative testing

**Owner:** Protocol/security QA  
**Current status:** All real-value/mainnet locks remain unchanged.

- [ ] Run Foundry build, fuzz, stateful invariants and malicious-token adversarial tests for all testnet contracts.
- [ ] Test reentrancy, bad ERC-20 responses, wrong network, signature replay, unlimited token approvals and unexpected token behavior.
- [ ] Add dynamic simulation for limit orders, staking and faucets including permission/exhaustion attacks.
- [ ] Keep local and testnet keys separate; no private key in GitHub repo or browser logs.
- [ ] Use Slither and dependency advisory reports and document findings without claiming third-party audit.
- [ ] Run wallet phishing/simulation tests and ensure testnet contract addresses cannot leak into mainnet config.
- [ ] Create bug reporting process with reproducer tx traces and plan fixes before escalating to larger user cohorts.

**Acceptance evidence:** Security test evidence and no cross-environment signing; testnet known bugs documented.  
**Stop condition:** Unbounded mint/gas authority, malicious signing or live chain contamination.

### 10.24 — Reliability, CI/CD, network resets and testnet observability

**Owner:** SRE/test infrastructure  
**Current status:** Persistent devnet requires uptime, funding and maintenance operations.

- [ ] Automate testnet deployment in staging with deterministic artifacts and explicit devnet operator approval.
- [ ] Host RPC, explorer, faucet and Neon services with health status and bounded operating budgets.
- [ ] Implement dashboard for block production, head lag, RPC p95 latency, tx success, faucet reserves and worker uptime.
- [ ] Run simulated node restart, data restore, indexer backfill and contract upgrade/reset announcement procedures.
- [ ] Benchmark concurrent swap/quote/faucet/LP traffic and identify rate limits before broader public invites.
- [ ] Maintain a public changelog and advance notice of contract resets or expiring test assets/points.
- [ ] Release weekly integrity reports listing known issues, actual chain transaction count and current user testing coverage.

**Acceptance evidence:** Reproducible staged deploy, recovery logs, honest uptime and visible reset policy.  
**Stop condition:** Devnet halts without notice, data loss or unbudgeted infrastructure exhaustion.

### 10.25 — Public testnet invitation, feedback, metrics and next milestone

**Owner:** Product/Growth/QA  
**Current status:** Deep M10 testnet build is not yet implemented.

- [ ] Publish a focused testnet landing page with clear 'test assets only' messaging and direct faucet access.
- [ ] Invite cohorts in stages: internal QA, invited testers, then open public use when infrastructure supports it.
- [ ] Give each cohort defined test missions: claim, swap, create pool, provide LP, withdraw, limit order, farm and report bugs.
- [ ] Collect authenticated on-chain usage counts, unique tester participation, confirmed swaps, liquidity actions and error trends.
- [ ] Analyze feature retention, bug reports, transaction failures, time-to-first-trade and quest completion without promising future rewards.
- [ ] Prioritize fixes based on severity and frequency; do not treat fake token transaction value as real DEX volume.
- [ ] Prepare Milestone 11 from real testnet feedback, distinct from any later audited real-value mainnet project.

**Acceptance evidence:** Persistent public testnet with successful independent user transactions, functioning faucet, basic LP redemption and truthful metrics.  
**Stop condition:** No working real demo trades, mislabelled mainnet, or unusable wallet/faucet experience.

## First-user testing path

1. Visit official Symb *testnet-labelled* app, confirm network identity (never chain 4613 as testnet).
2. Connect own wallet, add the independently configured sandbox EVM network.
3. Claim gas and demonstration tokens from the faucet.
4. Swap mock tokens; observe a real chain transaction hash and reserves update.
5. Open Pools, create or join test liquidity and receive real demo LP tokens.
6. Remove part/all of demo LP and verify wallet balances.
7. Explore real test-chain market history, candlesticks, wallet activity and pool creation.
8. Complete optional quests, farms or token-launch exercises *only where these modules actually work*.
9. Report a bug and verify that the app can explain/recover from a failed tx.

## Feature rollout priorities

**P0 (must work before inviting users):** 10.1–10.9 essential network/contract/token/faucet/wallet/swap/pool/LP features, plus base 10.17 indexing, 10.19 explorer, 10.23 security and 10.24 monitoring.

**P1 (expanded public testing):** 10.7 advanced route optimization, 10.11 test token creator, 10.15–10.16 quests/referrals, 10.18 chart dashboards, 10.20 APIs, 10.21 mobile experience and 10.25 enrollment/feedback.

**P2 (separate experimental flags):** 10.10 range liquidity/V3 research, 10.12 signed limit orders, 10.13 scheduled DCA, 10.14 farm rewards and any more advanced financial modules. No P2 feature is described as operational until a distinct contract/service passes its acceptance tests.

## Testnet-only implementation and trust rules

- **Separate chain:** never label native chain ID 4613 as testnet. All test environment addresses, RPC and codehashes belong in a separate registry.
- **No production funds:** no native mainnet VERY funding, custodial payments, token buys or bridges required for test users.
- **No pretending:** swaps, LP transactions, limit fills and farm rewards must use actual on-chain sandbox transactions to be called working.
- **No fabricated metrics:** synthetic USD valuation is *labelled synthetic*. Genuine test-chain transaction counts may be reported as testnet activity, never real economic volume.
- **No token promises:** points, badges and leaderboard ranks have no cash or guaranteed airdrop entitlement.
- **Admin controls:** rate-limit faucet and test token issuance, protect owner/keeper signing keys and apply network-specific contract/wallet approvals.
- **Independent later mainnet decision:** later real-money launches require a new audit, chain/wrapper validation, operational review and explicit separate approval; these are NOT part of the current testnet user iteration.

## Suggested new source tree (planned, not yet created)

```text
config/
  networks.testnet.template.json
  deployments.testnet.json
contracts/src/testnet/
  SymbTestToken.sol
  FaucetVault.sol
  TestFarm.sol
  TestRewardToken.sol
  TestLimitSettlement.sol
  ExperimentalRangePool.sol
app/testnet/page.tsx
app/faucet/page.tsx
app/trade/page.tsx
app/pools/page.tsx
app/farms/page.tsx
app/quests/page.tsx
app/leaderboard/page.tsx
app/launch/page.tsx
app/orders/page.tsx
app/portfolio/page.tsx
services/faucet/
services/keeper/
services/quests/
services/indexer/
lib/testnet/
db/migrations/
tests/testnet/
```

**All listed files beyond existing folders are future planned paths**, not a claim they are implemented.

## Known current state

Symb already has MIT Solidity Factory/Pair/Router source, local Foundry security tests, wallet/swap/liquidity/LP interfaces and a Neon event-indexing scaffold. Existing app/config uses mainnet 4613 as its default **disabled** deployment registry. The new testnet architecture, distinct RPC/chain, faucet, mocked tokens, hosted explorer, testnet deployments, persistent indexer and advanced trading modules have not been built or deployed simply by publishing this document.

**Milestone 10 is COMPLETE only when external testers carry out genuine test-chain transactions and position redemption with independently inspectable receipts**, using no real funds.
