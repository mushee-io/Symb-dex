# Lidde DEX

Lidde is a **non-custodial decentralized exchange under development** for VERY Chain.

> **CURRENT BUILD GOAL: PUBLIC TESTNET FOR USERS — NO REAL FUNDS.** Original MIT Solidity and local Foundry tests exist, but a persistent hosted Lidde test network, faucet, working testnet deployments and public test transactions are **not yet live**. The mainnet chain ID 4613 and its release registry remain locked. Do not send real assets to test contracts.

## M11 P0 code delivered — external public testnet not yet hosted

**Implemented:** [testnet liquidity creation and full withdrawal](app/testnet/pools/page.tsx), [demo pool reads](lib/testnet/pools.ts), [isolated Neon canonical indexer](scripts/index-testnet.mjs), [reconciliation](scripts/reconcile-testnet.mjs), [testnet explorer](app/testnet/explorer/page.tsx), [restricted RPC gateway and persistent node deployment recipe](infra/devnet/README.md), and [fresh-wallet transaction smoke test](scripts/smoke-testnet.mjs).

A dedicated Neon project named **lidde-testnet** is provisioned with separate faucet and canonical indexer schema. GitHub Actions verifies real Anvil faucet → swaps → new pool → LP exit. No wallet keys or database credentials were committed.

**Still not live to outside users:** long-lived public EVM hosting, DNS/HTTPS RPC, deployed public demo contracts, enabled gasless sponsorship and independent external-wallet receipts. The testnet registry remains unconfigured and VERY mainnet chain 4613 is locked. See the [operator deployment checklist](docs/M11-OPERATIONS.md).

## Milestone 14 — PLANNED: Full-scale testnet, performance and ecosystem expansion (30 stages, 240 tasks)

> **NOT LIVE OR IMPLEMENTED BY THIS DOCUMENT. TESTNET ONLY.** M14 follows proven M11 external wallet/on-chain access and verified M12/M13 modules; a roadmap is not a deployment receipt or security audit. All real-funds/mainnet work remains disabled.

**[Milestone 14 complete engineering master checklist](MILESTONE-14.md)** — six phases, 30 technical stages and **240 detailed acceptance tasks** with current readiness, owner, actual evidence and explicit failure/stop conditions.

**A: Infrastructure** — Hosted isolated EVM chain, immutable manifests, HTTPS restricted RPC/explorer, sponsored faucet, backups and measured incident monitoring.  
**B: Trading quality** — Gas/price optimization, liquidity capital experiments, reviewed signed orders/solvers, derivatives stress harness, options/lending risk and test-only market makers.  
**C: Data and UX** — Reorg-safe Neon event ledgers, honest OHLCV and tester cohorts, unified account/LP portfolio, accessible trading UI and mobile wallets.  
**D: Ecosystem** — TypeScript SDK, bound/revocable demo agents and automation, optional mock-only cross-chain research, test-token launchpad, third-party adapters and developer console.  
**E: Growth** — Verifiable quest/referral scoring, anti-sybil fairness, community support, independent user cohorts and honest retention analysis.  
**F: Safety and release** — Security invariants/review, adversarial testnet drills, node recovery, external wallet receipt scorecard and M15 handover.

**Prerequisite:** The public testnet config is currently **not-configured**, and there are no independently verified public demo-chain transactions or deployed advanced M12/M13 contracts in the current repository evidence. Only implemented, proven individual modules may be described as live. VERY **4613 is mainnet, not testnet**.

---

## Milestone 13 — FUTURE: Deep cross-module testnet integration (25 stages, 175 detailed tasks)

> **PLANNED · TESTNET ONLY · NO REAL FUNDS.** M13 is the integration phase *after* actual M11 external testnet operation and after implementing and testing the selected M12 advanced contracts. **No M12 derivative, options, lending, RWA or agent module is claimed to be built merely by documenting M13.**

**[Full root Milestone 13 technical execution plan](MILESTONE-13.md)** — 25 stages, **175 checkable engineering tasks**, workstream owners, prerequisites, exact chain/accounting evidence, stopping conditions and a real outside-wallet acceptance journey.

| Phase | Planned work | Must be demonstrated |
| --- | --- | --- |
| **A — Core accounting** | M12 handover, collateral ledger, shared risk, oracle confidence, atomic settlement | Backed valueless collateral and no double-spend or invalid-risk execution |
| **B — Financial integration** | Perps, margin/liquidations, options, lending and bounded swap/repay composition | Correct live demo-chain position, liquidation/settlement/repayment receipts |
| **C — Execution** | EIP-712 orders, solver comparison, DCA/TWAP, vaults and scoped AI agents | Bounded, noncustodial, replay-safe, revocable actual test transactions |
| **D — Product data** | Mock RWA markets, demo token creator, risk-aware terminal, cross-module indexer and analytics | User balances/history and canonical testnet event parity |
| **E — Release evidence** | Mobile, proof-based quests, SDK, invariant fuzz/security and independent user beta | Verified chain receipts, stress/incident drills and module-by-module release decisions |

**Active work remains M11's public devnet hosting/external wallet proof.** Mainnet chain ID `4613` is NEVER testnet; `config/deployments.testnet.json` remains unconfigured until a distinct authentic demo chain is deployed, and the mainnet release registry remains locked. M12 and M13 are forward implementation specifications, not operational services.

---

## Milestone 12 — PLANNED: Advanced DeFi testnet

**[M12 complete technical specification — 25 stages, 125 tasks](MILESTONE-12.md).** New work after the M11 public-testnet prerequisites: modular Solidity registry, price feeds and collateral; signed order matching, isolated-margin perpetuals and liquidation keepers; bounded DCA/TWAP; separately reviewed experimental options, lending, mock RWA markets and strategy vaults; wallet risk portfolio, SDK/agent permissions, analytics and targeted security testing.

**Not live:** M12 is a roadmap, not merged execution code. All new financial modules start disabled, use synthetic assets, and cannot activate VERY Mainnet chain 4613. Persistent public M11 testnet hosting and external-wallet acceptance still come first.

## Milestone 11 — Next deep public testnet build (25 stages, 125 tasks)

**[Full checkable Milestone 11 implementation specification](MILESTONE-11.md).** Building on the completed local M10 foundation, M11 will provision the persistent testnet, explorer, free faucet and verified contracts, then complete real external-wallet swap and LP deposit/withdrawal flows. Indexing, routing, charts, quests, APIs, wallet/mobile QA and experimental orders/DCA/farms follow as separate workstreams.

**This is a planned milestone—not a live public network.** Keep the current M10 source status and chain-4613 mainnet protections intact. P0 before broad invitations: chain → faucet → swaps → liquidity exits → verifiable explorer receipts and indexer reconciliation. No real assets, paid tokens or guaranteed airdrops.

## Milestone 10.1–10.6 — Testnet engineering implemented (NOT PUBLICLY DEPLOYED)

The new source includes:
- [MIT-licensed synthetic tokens](contracts/src/testnet/LiddeTestToken.sol) with 6/8/18 decimals and mint caps; [test-only faucet contract](contracts/src/testnet/LiddeTestFaucet.sol) with a 24-hour cooldown and operator-sponsored claim.
- [Mainnet-rejecting Foundry deploy script](script/TestnetDeploy.s.sol) and [Anvil CI workflow](.github/workflows/testnet-devnet.yml). CI deploys to chain 31337, funds the faucet with **fake gas**, seeds tUSD/tBTC and tUSD/wrapped-native pools and verifies actual deployed bytecode.
- [Dedicated testnet page](/testnet) (route in this app: `app/testnet/page.tsx`) with EVM wallet connection, token balances, real reserve-driven quote, exact token approval, simulated swaps, real test-chain receipt tracking and faucet claim UI.
- [Server-only gas sponsorship](app/api/testnet/faucet/route.ts) with wallet signatures, disabled-by-default operator key, trusted-proxy IP checks and [Neon claim-limiter migration](db/migrations/010_testnet_faucet.sql). Requires separate operator setup; public gasless claims are **not active yet**.
- [Read-only actual deployment verifier](scripts/configure-testnet.mjs) to check RPC, addresses, ERC-20 metadata and pools before enabling the separate `config/*testnet.json` registry.
- [Deployment guide](docs/M10-DEPLOYMENT.md) and [faucet operations guide](docs/M10-FAUCET-OPERATOR.md).

**Live status:** P0 code is in source. A persistent public EVM network, real public explorer/HTTPS RPC, remote contract deployment, faucet sponsorship/Neon credentials and external-wallet transaction receipts are still missing. The testnet UI remains deliberately unavailable until a real verified isolated chain and contracts are configured. **No real assets or mainnet transactions have been used.**

## Milestone 10 — CURRENT PRIORITY: Deep Public Testnet (25 Stages / 175 Tasks)

> **TESTNET ONLY — NO MAINNET ASSETS.** Give users a genuine test-chain trading environment with faucet, demo tokens, real contract swaps, pool creation, LP deposits/withdrawals, market charts, points, quests, and experimental advanced DeFi functionality. There is no testnet deployment or funded test user transaction claimed yet.

**[Read the full root Milestone 10 master plan — 25 stages, 175 checkable implementation tasks](MILESTONE-10.md).** Each stage includes engineering requirements, current readiness, proof and failure/stop conditions.

**Important network distinction:** Official VERY documents show `4613` as **mainnet** and do not provide a verified public testnet RPC/explorer. First validate an official testnet with the VERY operators, or host an isolated persistent Lidde EVM devnet with **its own independent chain ID**, labelled *Lidde Test Network* (not official VERY testnet). Use **valueless test assets only** and isolate its deployment registry from the existing locked mainnet configuration.

| Phase | Build priority | User-facing functionality |
| --- | --- | --- |
| **A — Network / faucet** | P0 | Separate demo network, Factory/Router, synthetic tokens, rate-limited test gas and asset faucet, wallet switching |
| **B — Core trading** | P0 | Real demo swaps, routes, market creation, LP mint/burn, portfolio and optional range-pool research |
| **C — Advanced DeFi** | P1/P2 | Token creator, signed limit orders, DCA keeper, demo LP farms and on-chain test rewards |
| **D — Testnet community** | P1 | Quests, non-redeemable points, referral attribution and seasonal leaderboards |
| **E — Analytics and tools** | P0/P1 | Neon indexer, OHLCV charts, explorer, APIs/SDK, mobile UI and opt-in profiles |
| **F — Public test rollout** | P0 | Security testing, hosted uptime, reset policies, user cohorts and honest usage metrics |

**Phase P0 definition of done:** External tester connects to a *separate* EVM test chain, claims free demo tokens, completes an actual chain swap, creates/adds liquidity, and withdraws LP shares with verifiable demo-chain receipts. No real token transfer, deposit, mainnet gas or withdrawal is required.

**Deferred:** Previously written Milestones 8 and 9 include **future real-funds/mainnet launch planning**. They are kept as historical reference, but they are not the current testnet delivery gates. Advanced modules must each work independently before their UI is described as live.

---

## Milestone 9 — DEFERRED real-value public launch (20 stages, 140 detailed tasks)

> **NOT LIVE · NOT APPROVED.** Milestone 9 is a public-launch plan, **not an authorization to bypass Milestone 8**. Independent audit, canonical WVERY, production liquidity/swap/LP exit receipts, Neon operations, reviewed security findings and a separate M09 signoff remain required.

**[Read the full root Milestone 9 master plan: 20 stages, 140 specific tasks, acceptance evidence and stop conditions](MILESTONE-09.md)** · [Operator execution and release runbook](docs/MILESTONE-09-EXECUTION.md).

The public-launch plan explicitly covers: external security and M08 exit, qualified legal/regulatory advice, domain/DNS and secure deployments, audited contract addresses, token/pool eligibility, live swaps and LP exits, wallet UX, user transaction history, Neon indexing and verified analytics, monitoring and resilience, user docs and support, treasury governance, compliant community communications, gradual release, and a separate Milestone 10 handover.

**Current scope:** That historical mainnet/public-funds plan is on hold. Right now, the product track is an isolated, valueless **user test network**, not a real-asset or mainnet release.

## Milestone 8 — DEFERRED mainnet beta planning (historical)

> **MAINNET HISTORICAL PLANNING ONLY · STATUS: NO-GO FOR REAL FUNDS.** Contracts and local tests exist; **no independent audit, verified canonical WVERY, authorized deployed AMM, funded pool or live transaction proof exists**. Lidde's Factory, Router and WVERY production addresses remain **null**, and wallet writes remain disabled.

**[Open the full root Milestone 8 master checklist — 18 stages, 90 itemized tasks, owners, evidence and stop conditions](MILESTONE-08.md).** For implementation detail and audit handoff, also see [M08 deep engineering runbook](docs/MILESTONE-08-EXECUTION.md), [security finding triage](docs/SLITHER-FINDINGS-TRIAGE.md) and [external audit brief](docs/INDEPENDENT-AUDIT-BRIEF.md).

**Critical external blockers:** [#9 Independent auditor](https://github.com/mushee-io/lidde-dex/issues/9) · [#10 Official WVERY provenance](https://github.com/mushee-io/lidde-dex/issues/10) · [#11 Slither/npm remediation](https://github.com/mushee-io/lidde-dex/issues/11). Completing documentation or clicking a release flag does not satisfy these gates.

| Stage | Detailed build/release task | Current evidence |
| --- | --- | --- |
| **8.1** | Confirm official WVERY, bytecode, backing and native redemption | External verification |
| **8.2** | Commission and remediate independent audit of frozen Solidity | External auditor |
| **8.3** | Prove compiler, source hash, pair/router ABI and bytecode identity | Evidence missing |
| **8.4** | Assign multisig signers, treasury caps and security authority | Not assigned |
| **8.5** | Verify eligible ERC-20s and publish reviewed token registry | No reviewed list |
| **8.6** | Test local mint, swaps, LP burn, adversarial inputs and invariants | Local baseline passed |
| **8.7** | Reproduce VERY EVM integration on a safe pinned fork | Fork proof missing |
| **8.8** | Deploy audited contracts and small initial LP only after approval | No mainnet deployment |
| **8.9** | Run authorized native/ERC-20 swap tests with real receipts | No mainnet swaps |
| **8.10** | Prove partial and full LP redemption on-chain | No mainnet exits |
| **8.11** | Test wallet signatures, chain switching, errors and approvals | Browser QA pending |
| **8.12** | Provision Neon, index canonical logs, replay reorgs and reconcile | Source only |
| **8.13** | Set up capped beta onboarding and transparent risk disclosures | Beta not launched |
| **8.14** | Implement live alerting, assigned responders and incident drills | No live drills |
| **8.15** | Verify source and audited contract identity publicly on VeryScan | Undeployed |
| **8.16** | Report only verified swaps, wallets, reserves and trusted USD TVL | No live metrics |
| **8.17** | Require human independent audit/funding/signing release approval | NO-GO |
| **8.18** | Produce actual beta closeout and separate Milestone 9 signoff | Not started |

**Mainnet roadmap is deferred.** Its external audit and canonical mainnet WVERY work remain relevant only to a later, separately authorized real-value launch. Milestone 10's current user testing uses independently identified demo-chain contracts and valueless faucet tokens.

**Commands (developer-only; never authorize funding):** `npm test`, `npm run typecheck`, `npm run build`, `forge test -vv`, `npm run beta:preflight`, `npm run beta:gate:ci`.

---

## Milestone 1: Foundation

- Official VERY Mainnet configuration (chain ID 4613)
- Next.js app shell with Swap, Pools, Explore and Portfolio pages
- Connect an injected EVM wallet, switch/add VERY Mainnet, view **real** native balance
- Explicit deployment/release gate (defaults to closed)
- Read-only RPC chain ID / block-number verification script
- Automated config and release-gate tests, and GitHub CI
- Security and architecture documentation

## Run

Requires Node.js 22+.

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
npm run check:rpc
```

Visit http://localhost:3000. **`check:rpc` is optional and uses the public live RPC; it never signs or sends a transaction.**

## Network

**Historical source configuration below is VERY MAINNET and deliberately disabled. Do NOT use chain ID 4613 for the Lidde testnet.** The testnet network ID, RPC, explorer, faucet and deployed addresses will be filled only after verification and isolated provisioning; see [testnet template](config/networks.testnet.template.json).


| Field | Value |
| --- | --- |
| Network | VERY Mainnet |
| Chain ID | 4613 (0x1205) |
| RPC | https://rpc.verylabs.io |
| Native currency | VERY |
| Explorer | https://veryscan.io |

Source: [VERY official developer guide](https://verylabs.io/whitepaper/en/developers/). The network is mainnet; do not treat test tokens or contracts on mainnet as a public testnet.

## Roadmap

See [docs/MILESTONES.md](docs/MILESTONES.md), [docs/NETWORK.md](docs/NETWORK.md), and [docs/SECURITY.md](docs/SECURITY.md).

No private key, mnemonic, live contract address, token address, or claimed liquidity value is bundled with this application. Liquidity and swaps will be enabled only after verified deployments and a security signoff.

**License:** [MIT](LICENSE) for original Lidde code. All new Solidity contracts carry SPDX-License-Identifier: MIT; third-party dependencies retain their own licenses.

## Milestone 3 — Wallets, tokens and approvals

Implemented on branch `build/milestone-03-wallets-tokens`:
- Multi-wallet injected EIP-6963 discovery with Wagmi; wallet account switch, disconnect and VERY chain switching.
- Optional WalletConnect QR connection: set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in Vercel and local `.env.local`. Obtain your own ID from [Reown Cloud](https://cloud.reown.com/); without it injected wallets still work.
- Native VERY and ERC-20 balance readouts via chain RPC; available in Portfolio and Explore.
- Import a token by its exact contract address after bytecode and `name/symbol/decimals` verification; metadata does not imply an asset is safe. Imported addresses are saved in browser localStorage only.
- `config/verified-tokens.json` is **empty** until each address is independently reviewed. A user's imported token can never mark itself verified.
- Router allowance management and exact amount/revoke flow are written but **locked** until valid reviewed production deployment configuration exists. No unlimited token approvals.
- Swap screen supports asset selection for UI preview only; no swap quote or live swap is available.

**Wallet limitations:** WalletConnect requires your own project ID. Injected-wallet support depends on an installed browser extension. No WalletConnect identifier, wallet seed phrase, private key, or mainnet deployment addresses are committed.

**Risk boundaries:** a valid ERC-20 contract may be malicious, pausable, blocklisted, fee-on-transfer, honeypot or illiquid. Imported token balances should not be interpreted as tradable or priced assets. Approval write support is inactive while `config/deployments.json` uses null router and false review flags.

Read [docs/MILESTONE-03.md](docs/MILESTONE-03.md) for technical acceptance and human smoke tests.

## Milestone 4 — Quote and guarded swap engine

This work adds:

- Constant-product AMM calculations using bigint integer arithmetic and the **actual documented fee rate** of a verified deployment (unconfigured until contracts are reviewed).
- Factory/pair bytecode and reserve reads on chain 4613; direct routes and up to two hops through independently verified wrapped VERY.
- Swap direction, live query refresh, slippage settings, minimum received, price impact (including fees), and transaction deadlines.
- A transaction pipeline that revalidates latest pool reserves, enforces the original minimum output, checks allowance/balances and gas, simulates the contract call, signs through the connected wallet, and checks the receipt.
- Read-only and fail-closed behaviour if no approved factory, router, WVERY, fee and reviewed ERC-20 addresses exist. **No trading can occur against the current empty deployment registry.**

**Important:** Milestone 2 has not deployed any AMM or canonical wrapped VERY for Lidde. Execution is untested on live contracts and cannot be treated as production-ready merely because the UI compiles. See [docs/MILESTONE-04.md](docs/MILESTONE-04.md).

## Milestone 5 — Liquidity pools and LP portfolio

Source implemented in `build/milestone-05-liquidity`:
- `/pools`: verified factory pool discovery, paginated snapshots and on-chain reserve reads.
- `/pools/create`: create an initial market through the V2 add-liquidity router, or add to an existing pool.
- `/pools/[pair]`: factory-verified pair details and add/remove liquidity controls.
- `/portfolio`: LP token holdings and pool share for reviewed pools on the current page.
- On-chain checks for pool authenticity, router factory/WVERY binding, reviewed assets, explicit wallet allowances, minimum outputs, transaction expiry, simulation and gas coverage.
- Exact integer math for first mint, ratio deposits, LP supply/ownership and partial/full withdrawals.
- Read-only optional Neon event indexer schema and script for confirmed Mint, Burn, Swap, Sync and Transfer history.

**Milestone 2 is still outstanding.** No AMM is deployed in this repository, verified token list is empty and all liquidity transaction controls remain disabled. The supplied event indexer does not run or write data unless an operator explicitly configures it.

See [Milestone 5 implementation and remaining release requirements](docs/MILESTONE-05.md).

## Milestone 6A/6B — Canonical market indexer and Neon storage

- New deterministic canonical-block indexer under `services/indexer/`, with verified factory PairCreated discovery, strict log decoding, address/chain validation, bounded replay and on-chain reserve reconciliation.
- Versioned Neon migration `db/migrations/006a_006b_indexing.sql` adds canonical blocks, factory-verified pairs, raw and normalized swap/liquidity/LP transfer data, checkpoints and audit checks.
- Atomic Neon transactions use a chain-wide transaction advisory lock and an optimistic checkpoint lease to prevent concurrent workers from committing stale cursors.
- Fork handling locates the most recent canonical stored ancestor, cascades deletion of orphaned events/pairs and replays replacement blocks. If no ancestor is found within 128 blocks, indexing stops for manual recovery.
- No live mainnet write operations, tokens, swaps or balances are generated by the indexer. M02 contract deployment, verified deployment starting block and operator-provisioned Neon are still prerequisites.

See [M06A/B operator and technical guide](docs/MILESTONE-06AB.md) for migrations, scripts, limitations and safety checks.

## Milestone 7 — Root Solidity + MIT security foundation

- Root [LICENSE](LICENSE) is MIT; Foundry is configured in [foundry.toml](foundry.toml).
- Original Solidity contracts are in [contracts/src](contracts/src): LP/ERC-20, experimental wrapped VERY, factory, pair and router.
- Solidity tests live in [contracts/test](contracts/test): pool creation, swaps, native VERY paths, LP mint/burn, adversarial callback, randomized fuzz and stateful invariants.
- [Solidity CI](.github/workflows/solidity-security.yml) compiles, runs tests and invokes Slither; the existing Next.js test/build pipeline remains separate.
- [Security reporting](SECURITY.md), [threat model](docs/THREAT-MODEL.md), [incident procedures](docs/INCIDENT-RESPONSE.md), [audit deliverables](docs/MILESTONE-07.md) and [deployment manifest template](docs/DEPLOYMENT-MANIFEST.template.json).

Run from repository root with installed [Foundry](https://getfoundry.sh/):

    forge build --sizes
    forge test -vv

**Experimental Solidity is NOT an audited production protocol.** It uses a fixed 30 bps swap fee with no protocol fee switch or pause. LiddeWrappedVery is a **local wrapped-native asset reference, not a verified official WVERY**. No new deployment address is added to the release registry. Source-code tests, an MIT license and automatic scanning are not substitutes for independent third-party audit.

## Security hardening and Milestone 8 preparation (pre-launch)

- [Read-only wrapped VERY candidate inspector](scripts/inspect-wvery.mjs): verify chain 4613, deployed bytecode, ERC-20 metadata and on-chain native backing with a pinned block. A passing probe **does not prove canonical issuance**. See [wrapped-token investigation](docs/WRAPPED-VERY-REVIEW.md).
- [Slither triage](docs/SLITHER-FINDINGS-TRIAGE.md): security scanner findings require case-by-case review; a green Slither job is **not an audit**. GitHub CI dependency installation previously reported 14 high and 15 moderate npm advisories requiring review.
- Solidity hardening: reject low-level ERC-20 transfers sent to non-contract addresses, and record factory pair state before initializer call.
- [Controlled local deployment test](contracts/test/LiddeLocalDeploymentDryRun.t.sol): multi-actor local bootstrap, liquidity, swap, withdrawal, reserve/supply reconciliation and failed first-mint rollback. **No mainnet broadcast.**
- [External auditor request brief](docs/INDEPENDENT-AUDIT-BRIEF.md): prepared scope and acceptance criteria; no independent firm engaged or certificate issued.
- [Milestone 8 detailed beta roadmap](docs/MILESTONE-08.md): 18 tasks with strict signoff, real receipt and funding gates; not live.

For an operator-only candidate probe (never a wallet transaction): `LIDDE_WVERY_CANDIDATE=<address> npm run inspect:wvery`. No candidate is trusted by default. Mainnet `config/deployments.json` remains deliberately disabled.

## Milestone 8 execution and safety gate

See [the deep 18-stage implementation and external-audit runbook](docs/MILESTONE-08-EXECUTION.md) and [Milestone 8 plan](docs/MILESTONE-08.md). Use `npm run beta:preflight` for a read-only machine-generated blocker report and `npm run beta:gate:ci` to prove release settings are still disabled. Those commands do **not** verify audit independence, confer spending authority, or broadcast transactions. External audit, canonical WVERY attestation and dependency remediation remain tracked in GitHub Issues #9, #10 and #11.
