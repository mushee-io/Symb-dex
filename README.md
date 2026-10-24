# Lidde DEX

Lidde is a **non-custodial decentralized exchange under development** for VERY Chain.

> **Not live.** This repository does not deploy an AMM, router, liquidity pool or canonical WVERY token. Swap execution is deliberately disabled until contract verification, tests, external review and a release decision are complete. Never send funds to an unverified address.

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

Copyright (c) Mushee contributors. License pending.

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
