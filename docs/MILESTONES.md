# Lidde delivery milestones

All code is developed milestone-by-milestone. Checkmarks here represent delivered source code only; no feature is production-ready until its acceptance criteria pass.

## M01 — VERY network and foundation (this PR)
- [x] Document official chain ID, RPC, currency and explorer.
- [x] Implement a read-only chain ID + latest block RPC check (run separately).
- [x] Create Next.js app shell and page navigation.
- [x] Integrate injected wallet connection and real native balance lookup.
- [x] Add a fail-closed deployment configuration.
- [x] Add unit tests and CI definitions.
- [ ] Confirm actual RPC responses from an external network-enabled environment.
- [ ] Verify canonical wrapped VERY contract and issuer/ownership.
- [ ] Obtain and review trusted production token addresses.
- [ ] Confirm CI build is green.

## M02 — AMM architecture and Foundry project
- [ ] Choose and document audited, license-compatible constant-product AMM base.
- [ ] Scaffold Foundry contracts and pinned dependency versions.
- [ ] Implement factory, pairs, router, fee accounting and WVERY adapter.
- [ ] Write swap, liquidity, fuzz and invariant tests.
- [ ] Complete internal review; do not deploy to mainnet yet.

## M03 — Wallet and token flows
- [ ] WalletConnect and multiple wallets.
- [ ] ERC-20 balances, approvals and network mismatch handling.
- [ ] Token import, verified token registry and risk warnings.

## M04 — Quotes and real swaps
- [ ] Pool reserve reads and gas / output quotes.
- [ ] Slippage and transaction deadline protections.
- [ ] Allow verified swaps after review and deployment.
- [ ] Test low-value real swaps and independently verify receipts.

## M05 — Pool management
- [ ] Create pools, add/remove liquidity, track ownership and fees.
- [ ] Test withdrawal and adverse-token behaviour.

## M06 — Indexing and market data
- [ ] On-chain event indexer, API, candles, TVL and volume.
- [ ] Handle reorgs and reconcile chain state.

## M07 — Security readiness
- [ ] Threat model, fuzz/invariants, dependency review, external audit.
- [ ] Resolve critical findings and publish limitations.
- [ ] Multisig key governance and incident playbooks.

## M08 — Capped mainnet beta
- [ ] Verify contract source and metadata on VeryScan.
- [ ] Seed small, disclosed liquidity with funding approval.
- [ ] End-to-end swap/add/remove tests, receipts, monitoring.

## M09 — Public launch
- [ ] Production interface, accessible documentation and monitoring.
- [ ] Publish contract addresses, fees and risks.

## M10–M16 — Expansion
- [ ] Rewards and farming, launchpad, advanced routing, limit orders,
      ecosystem integrations, governance and higher-risk DeFi features.

The exchange must not report fabricated trading volume, liquidity or wallet metrics.
