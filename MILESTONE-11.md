# Lidde DEX — Milestone 11: Deep Public Testnet Engineering

> **TESTNET ONLY — NO REAL FUNDS. M11 is a build plan, not completed functionality.** Milestone 10.1–10.6 has delivered MIT Solidity, demo tokens and faucet, local Anvil deployment, testnet wallet/quotes and transaction source. A persistent public chain, externally accessible RPC/explorer, actual public contract deployment and confirmed independent-user trades are not yet running.

**Start here:** [Milestone 10](MILESTONE-10.md) · [Local deployment guide](docs/M10-DEPLOYMENT.md) · [Faucet operator guide](docs/M10-FAUCET-OPERATOR.md) · [Public test network blocker](https://github.com/mushee-io/lidde-dex/issues/17) · [Gasless faucet and external wallet blocker](https://github.com/mushee-io/lidde-dex/issues/18).

## Scope

Build a genuine persistent user-testnet experience from a new wallet's first free faucet claim all the way to real token swaps, pool creation, liquidity deposits and complete LP withdrawals. Then add trustworthy analytics and optional advanced DeFi experiments. No real assets, no mainnet activation, no token payout promises and no unrelated regulatory work.

**Network safety:** The published VERY chain ID **4613 is mainnet**. VERY's published network specifications do not supply an official public testnet RPC/explorer. Obtain authenticated official testnet information or launch a clearly identified independent Lidde-operated EVM test chain. Do not mislabel mainnet as testnet. Sources: https://verylabs.io/whitepaper/en/verychain/ and https://wp.verylabs.io/verychain/network-specifications.

## The 25 workstreams — 125 detailed checkable tasks

| Stage | Workstream | Priority |
|---|---|---|
| **11.1** | Persistent public test network | P0 |
| **11.2** | Real chain explorer and contract verification | P0 |
| **11.3** | Testnet deployment, address registry and reset operations | P0 |
| **11.4** | Gasless faucet, abuse limits and token supply | P0 |
| **11.5** | Wallet onboarding and account recovery | P0 |
| **11.6** | Live swap lifecycle and execution safety | P0 |
| **11.7** | Create pools and complete liquidity UI | P0 |
| **11.8** | LP portfolio and liquidity fee accounting | P1 |
| **11.9** | Verified token and pool discovery | P1 |
| **11.10** | Smart routing and quote optimization | P1 |
| **11.11** | Neon indexing and chain event reconciliation | P0 |
| **11.12** | Market charts and OHLCV | P1 |
| **11.13** | Wallet positions and transaction history | P1 |
| **11.14** | Test ERC-20 creator and liquidity launcher | P1 |
| **11.15** | Limit orders and actual fill settlement | P2 |
| **11.16** | DCA and scheduled keeper swaps | P2 |
| **11.17** | Testnet LP farming and staking | P2 |
| **11.18** | Proof-based quests and points | P1 |
| **11.19** | Referral programme and leaderboard seasons | P1 |
| **11.20** | Mobile UX and Telegram optional prototype | P1 |
| **11.21** | Public read APIs, SDK and demo trading agents | P1 |
| **11.22** | Smart-contract security and adversarial test programme | P0 |
| **11.23** | Uptime, incident handling, node recovery and scale | P0 |
| **11.24** | Guided invited alpha and public user beta | P0 |
| **11.25** | Post-testnet evaluation and Milestone 12 handover | P0 |

## Phases and execution order

**Phase A / P0:** 11.1–11.7 and 11.11 — real chain, explorer, deployment, faucet, wallet, swap, LP and event history. These deliver a real first user journey.

**Phase B / P1:** 11.8–11.14 — LP analytics, pool/token discovery, route optimization, charting, portfolio, token launcher.

**Phase C / P2:** 11.15–11.17 — signed limit orders, DCA keeper, staking and farming; each remains a separately tested experimental module.

**Phase D / P1:** 11.18–11.21 — quests, referrals, mobile and developer APIs.

**Phase E / P0:** 11.22–11.25 — security regressions, uptime, independent beta users and milestone closeout. Safety work begins in parallel with Phase A.

## Full detailed technical checklist

### 11.1 — Persistent public test network

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Authenticate any official VERY testnet before use; otherwise run a clearly named independent Lidde EVM test chain
- [ ] Choose separate non-4613 chain ID, genesis, block interval, node software, native fake gas and consensus setup
- [ ] Provision persistent RPC, HTTPS reverse proxy, long-lived disks, backups and managed node restarts
- [ ] Verify eth_chainId, genesis hash, gas estimation, chain timestamps, ABI compatibility and external wallet access
- [ ] Configure monitoring, RPC rate limits, network reset schedule, operator ownership and safe public endpoints

**Acceptance evidence:** Two external wallets use persistent RPC and confirmed transaction history survives a node restart.

### 11.2 — Real chain explorer and contract verification

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Host a block explorer indexed to exact test genesis, not VeryScan mainnet
- [ ] Expose blocks, hashes, receipts, gas, decoded event logs, token transfers and contract bytecode
- [ ] Register the verified Factory, Router, Pair, test wrapper, faucet and demo ERC20 metadata
- [ ] Link swap, pool, wallet and faucet transactions to actual test explorer URLs
- [ ] Test explorer restart, backfill, stale-chain detection, pagination and consistency with independent RPC reads

**Acceptance evidence:** External testers independently inspect correct real faucet/swap/liquidity receipts.

### 11.3 — Testnet deployment, address registry and reset operations

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Broadcast existing Foundry Solidity deployment script with a test-only signer on verified separate chain
- [ ] Reject chain 4613 and Ethereum mainnet before broadcast, and record complete Foundry transaction receipts
- [ ] Reverify Router factory and wrapper, Pair creation, code hashes, seeded tUSD/tBTC and tUSD/test-native liquidity
- [ ] Populate distinct config/networks.testnet.json and config/deployments.testnet.json only from actual code-verified addresses
- [ ] Publish deployment manifest, ABI/source versions, rotating operator keys, planned resets and chain-state migration policy

**Acceptance evidence:** Real public test chain holds proven Factory, Router, six tokens, faucet and usable pools.

### 11.4 — Gasless faucet, abuse limits and token supply

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Provision independent Neon demo database and faucet signer, never reuse any real-value keys
- [ ] Activate signed wallet challenge and owner sponsored claimFor with a durable verified proxy and rate limits
- [ ] Reserve per-wallet/day, per-IP/day and network/day claim budgets; protect against race conditions and nonce collisions
- [ ] Refill valueless native gas and synthetic tUSD/tUSDC/tUSDT/tBTC/tETH/tLIDDE reserves with monitoring
- [ ] Reconcile submitted and unknown transactions, cooldown, failed claims, drained inventory and cross-day replay

**Acceptance evidence:** New zero-gas external wallet receives real demo-chain tokens for free without duplicates.

### 11.5 — Wallet onboarding and account recovery

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Create guided Connect → Add test chain → Claim faucet → Swap → Inspect receipt onboarding
- [ ] Test injected wallets and configured WalletConnect across desktop and mobile
- [ ] Handle wrong chain, account switch, rejected signature, disconnect, RPC outage and browser reload
- [ ] Show unmistakable TESTNET/no-value banners, network details, demo balances and fee estimates
- [ ] Prevent calls to VERY 4613 and direct users to accurate demo explorer for all receipts

**Acceptance evidence:** Outside testers complete onboarding without assistance or real-asset gas.

### 11.6 — Live swap lifecycle and execution safety

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Support real demo token/token, native/token and token/native swaps against verified Router
- [ ] Quote using real reserves, token decimals, 30 bps fee, price impact, minimum received and deadlines
- [ ] Simulate before sending and verify wallet, chain, recipient, spender, allowance, token eligibility and gas
- [ ] Execute exact allowance approvals separately, then submit swap and wait for real chain success/revert
- [ ] Reconcile actual wallet balance deltas, Swap/Sync events, and unknown/replaced transaction recovery

**Acceptance evidence:** External wallets settle all supported routes with on-chain receipt and correct balances.

### 11.7 — Create pools and complete liquidity UI

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Port M05 pool directory/create/add/remove flows to separate chain-specific testnet context
- [ ] Create first pool with token price warning, minimum permanently locked LP and real PairCreated receipt
- [ ] Add second liquidity provider with reserve-ratio math, exact approvals and native wrap/refund handling
- [ ] Remove 25%, 50%, 75%, 100% or custom LP and enforce actual minimum asset returns
- [ ] Reconcile LP supply, reserve state, token balances and direct contract exit without official UI

**Acceptance evidence:** Tester creates demo pool, adds liquidity and withdraws all redeemable LP.

### 11.8 — LP portfolio and liquidity fee accounting

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Display wallet LP balances, position tokens, share and underlying reserves at a consistent block
- [ ] Track Mint/Burn/LP Transfer and distinguish actual owner when shares are transferred
- [ ] Estimate fee growth separately from asset price change and impermanent loss
- [ ] Represent zero or missing historical values honestly, including testnet-only synthetic USD prices
- [ ] Test two-wallet deposits, swaps, partial exits, full exits and portfolio reconciliation

**Acceptance evidence:** Displayed LP positions match exact chain balance and pool state.

### 11.9 — Verified token and pool discovery

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Discover Factory pools and validate Pair codehash, token0/1, reserves, LP supply and pagination
- [ ] Segregate seeded reviewed demo tokens, unverified community test tokens and attacker fixtures
- [ ] Show real market details and explorer links without fabricated price/TVL
- [ ] Handle spoofed ticker, token metadata failure, zero liquidity, duplicate pools and inconsistent decimals
- [ ] Add directory sorting by real test-chain activity, liquidity and age with freshness metadata

**Acceptance evidence:** Directory displays only genuine test pools and preserves unverified-token warnings.

### 11.10 — Smart routing and quote optimization

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Build pool graph for approved direct, two-hop and Router-compatible three-hop routes
- [ ] Apply BigInt fee/reserve calculations and enforce no cycles, repeated pairs or wrong-chain pools
- [ ] Compare output, price impact, estimated gas and stale-quote risk across candidate paths
- [ ] Simulate actual Router calldata and show selected hop tokens and minimum output
- [ ] Test real multihop swaps, sparse markets, insufficient liquidity and route failure handling

**Acceptance evidence:** A reproducible quote chooses valid route and yields a confirmed multi-hop trade.

### 11.11 — Neon indexing and chain event reconciliation

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Configure separate testnet Neon schema, restricted roles and source Factory deployment block
- [ ] Ingest PairCreated, Swap, Mint, Burn, Sync, Transfer with exact integer/event keys
- [ ] Implement atomic checkpoints, deduplication, chain-id/genesis binding and confirmation depth
- [ ] Exercise worker restarts, shallow reorg rollback, deeper mismatch halt and replay without double count
- [ ] Reconcile indexed reserves and LP supply with RPC values from identical canonical block

**Acceptance evidence:** Index worker recovers cleanly and reports matching verified pool reserves.

### 11.12 — Market charts and OHLCV

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Derive prices and volumes solely from real testnet Swap events with proper token decimals
- [ ] Generate 1m, 5m, 15m, 1h, 4h and 1d canonical block-time candles
- [ ] Build trading charts, swap history, pool depth and quote price-impact indicators
- [ ] Distinguish mock/reference prices from true real-money USD price claims
- [ ] Test backfills, reorgs, gaps in trading, multi-hop double counts and stale-indexer warnings

**Acceptance evidence:** Candles and activity reconcile to sample test blockchain receipts.

### 11.13 — Wallet positions and transaction history

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Show native test gas, synthetic ERC20s, LP balances and token creator holdings
- [ ] Index confirmed approvals, faucet claims, swaps, LP deposits/withdrawals and transfers
- [ ] Connect every history item to genuine chain hash, block and confirmation state
- [ ] Recover pending/failed/replaced transactions after wallet or app reconnect
- [ ] Export demo history and protect privacy without asking for wallet secrets

**Acceptance evidence:** External wallet history matches independent explorer and on-chain balances.

### 11.14 — Test ERC-20 creator and liquidity launcher

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Implement test-only token factory with name, symbol, decimals, supply and clear issuer control
- [ ] Require demo-chain confirmation of every new contract, mint and owner permission
- [ ] Offer one-click initial pool using tUSD or wrapped demo native token after price risk notice
- [ ] Mark community tokens unverified and rate-limit factory spam and name collisions
- [ ] Test decimals, caps, malicious transfer behaviour, spoofing and creator pool lifecycle

**Acceptance evidence:** A real external wallet mints valueless asset, seeds liquidity and trades it.

### 11.15 — Limit orders and actual fill settlement

**Priority:** P2 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Design EIP-712 chain-bound order with nonce, expiry, token pair, limit, size and recipient
- [ ] Build separately tested escrow or bounded signature settlement and cancellation contract
- [ ] Store order and partial-fill states in Neon with signature/replay validation
- [ ] Run explicit test-only filler/keeper with gas caps, retries and no guaranteed fill claims
- [ ] Test expired signatures, double fills, invalid nonce, no liquidity and signer cancellation

**Acceptance evidence:** Two external wallets place/fill/cancel on-chain orders, not cosmetic orderbook cards.

### 11.16 — DCA and scheduled keeper swaps

**Priority:** P2 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Build opt-in recurring demo swap plan with cadence, spend cap, expiry and stop switch
- [ ] Use explicit revocable bounded on-chain delegation rather than custody of users' private keys
- [ ] Run durable keeper queue with wallet nonce isolation and RPC failure recovery
- [ ] Record scheduled, attempted, filled, skipped and cancelled states with receipts
- [ ] Test job duplication, out-of-gas, schedule drift, pause and replay after crash

**Acceptance evidence:** Scheduled genuine demo swaps occur and cancellation prevents later execution.

### 11.17 — Testnet LP farming and staking

**Priority:** P2 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Deploy separate test-only reward token and staking contract with supply/emission caps
- [ ] Support stake, unstake, claim and emergency LP withdrawal with accurate reward-per-share math
- [ ] Build farm UI with epochs, staked shares, pending rewards and no-real-value notices
- [ ] Test multiple wallets, epoch boundaries, rounding, malicious LP callbacks and depletion
- [ ] Verify all reward receipts and prohibit guaranteed real returns or APY claims

**Acceptance evidence:** Two wallets stake, claim and redeem demo LP without incorrect emissions.

### 11.18 — Proof-based quests and points

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Define quests for faucet, first swap, pool creation, LP deposit, full LP exit and return visits
- [ ] Grant points only after canonical confirmed event identity, never a button click
- [ ] Persist idempotent progress, versioned scoring, streaks and badge unlocks
- [ ] Prevent wash-trade quests, repeated same-block triggers and data-reorg duplication
- [ ] Show transparent rules and explicitly no guaranteed airdrop or monetary token entitlement

**Acceptance evidence:** Verified test chain events determine unique and reproducible non-cash quest scores.

### 11.19 — Referral programme and leaderboard seasons

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Create invitation codes and record qualified first-trade activation without self referral
- [ ] Score season participation using confirmed unique wallet actions and approved metrics
- [ ] Publish pseudonymous leaderboard, wallet privacy options and start/end rules
- [ ] Detect wallet farms, inflated volume, wash trading and repeated referral loops
- [ ] Reconcile leaderboard after reorgs and provide dispute/moderation audit history

**Acceptance evidence:** Season standings can be independently reconstructed from verified activity.

### 11.20 — Mobile UX and Telegram optional prototype

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Complete faucet/swap/pools/portfolio/quest flows on narrow touchscreens
- [ ] Test iOS Safari, Android Chrome and popular wallet in-app browsers
- [ ] Support responsive confirmations, readable contract details, deep linking and WC if enabled
- [ ] Add accessible labels, keyboard focus, touch-target sizes and reconnect resilience
- [ ] Prototype Telegram Mini App only after secure Telegram init validation and external wallet signing

**Acceptance evidence:** Phone users complete first faucet → trade → LP withdrawal with receipts.

### 11.21 — Public read APIs, SDK and demo trading agents

**Priority:** P1 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Publish versioned read APIs for pools, balances, quotes, trades, candles and indexer health
- [ ] Create typed JavaScript SDK for chain metadata, approvals, swapping and liquidity calls
- [ ] Provide safe disposable-wallet sample bot with rate limits and fake-asset budgets
- [ ] Make API responses include canonical block, lag, price-source and pagination metadata
- [ ] Reject any SDK request that accidentally targets VERY Mainnet 4613 in this test package

**Acceptance evidence:** Independent developer signs a real testnet trade using published SDK documentation.

### 11.22 — Smart-contract security and adversarial test programme

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Keep Foundry Solidity fuzz/invariant/local integration tests, Slither and dependency advisory CI
- [ ] Test V2 reserve invariants, router slippage, LP minimum lock and ERC20 reentrancy cases
- [ ] Stress faucet sponsorship replay, authentication, IP/rate-limit bypass and signer nonce races
- [ ] Independently gate new limit settlement, DCA keeper and farm prototypes with detailed exploit tests
- [ ] Prove separate testnet and mainnet config isolation, user wallet warnings and test-only secrets

**Acceptance evidence:** Security CI and adversarial regression matrix pass before exposing each module.

### 11.23 — Uptime, incident handling, node recovery and scale

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Monitor node/RPC blocks, 5xx latency, faucet reserves, indexer lag and wallet failures
- [ ] Load-test realistic concurrent quotes, faucet claims and pool discovery with defined budgets
- [ ] Rehearse node restart, Neon outage, indexer rescan, frontend rollback and corrupt block rewind
- [ ] Publish availability status, reset notices, scoped on-call responsibilities and reproducible bugs
- [ ] Do not claim high uptime or transaction throughput before real measured evidence

**Acceptance evidence:** Recovery drills pass, alerts work and public chain state remains accurate.

### 11.24 — Guided invited alpha and public user beta

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Run internal wallet smoke tests, then independent invitation cohorts and later open public testing
- [ ] Give testers mission list: free faucet, token swap, create pool, LP deposit, partial/full exit
- [ ] Provide official chain data, explorer, feedback intake, support, known issues and zero-cash statements
- [ ] Record real swaps, user success/failure, gas, LP exits and time-to-first-trade from canonical logs
- [ ] Keep P2 experimental flags disabled until separately test-proven and ready

**Acceptance evidence:** Multiple external testers complete exact P0 journey with confirmed receipts.

### 11.25 — Post-testnet evaluation and Milestone 12 handover

**Priority:** P0 · **Current state:** Planned unless already specified as Milestone 10 local source.

- [ ] Measure actual unique test wallets, faucet claims, swaps, pools, LP withdrawals and errors
- [ ] Reconcile volume/events/leaderboards against canonical chain; do not sell fake USD volume as economic adoption
- [ ] Review user feedback, wallet bugs, mobile failures, RPC cost, sponsor budget and exploit reports
- [ ] Prioritize fixes and independently reviewed P1/P2 rollout decisions from observed results
- [ ] Publish truthful testnet progress and M12 engineering backlog; defer all real-funds/mainnet launch decisions

**Acceptance evidence:** Evidence-backed public beta scorecard, fixes and approved M12 roadmap.

## Milestone 11 mandatory P0 acceptance

- [ ] A persistent independently verified test network (NOT chain 4613) exists, with HTTPS RPC, explorer and durable block history.
- [ ] Original Solidity deployments have verified chain-specific address manifests and genuine tUSD/tBTC and tUSD/test-native liquidity.
- [ ] New zero-gas wallets can claim fake tokens for free using a working controlled faucet.
- [ ] External wallets perform token/token, native/token and token/native test swaps and receive authentic explorer receipts.
- [ ] Users create pools, add liquidity and withdraw all eligible LP positions through actual smart contracts.
- [ ] Indexed events, balances, pool reserves and LP share values reconcile with canonical chain data.
- [ ] Wallet and signer checks prevent cross-chain approvals; security tests, uptime and recovery drills pass.
- [ ] External users complete the flow without engineering help, paid assets or seed-sharing.

## Clear definition of done

Milestone 11 is done when **real outside testers can complete claim → trade → pool → LP deposit → LP withdrawal → explorer verification**, and services remain dependable after node/indexer restart. **P2 experimental features are not required to claim the core public testnet has launched**, and none should be described as functional before their individual tests and receipts exist. Activity figures must be identified as TESTNET, not real dollar-denominated DEX economic volume.
