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
