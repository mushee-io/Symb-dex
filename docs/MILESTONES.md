# Lidde delivery milestones

All code is developed milestone-by-milestone. Checkmarks here represent delivered source code only; no feature is production-ready until its acceptance criteria pass.

## M01 — VERY network and foundation (merged)
- [x] Document official chain ID, RPC, currency and explorer.
- [x] Implement a read-only chain ID + latest block RPC check (run separately).
- [x] Create Next.js app shell and page navigation.
- [x] Integrate injected wallet connection and real native balance lookup.
- [x] Add a fail-closed deployment configuration.
- [x] Add unit tests and CI definitions.
- [ ] Confirm actual RPC responses from an external network-enabled environment.
- [ ] Verify canonical wrapped VERY contract and issuer/ownership.
- [ ] Obtain and review trusted production token addresses.
- [x] Confirm M01 CI build is green.

## M02 — AMM architecture and Foundry project
- [ ] Choose and document audited, license-compatible constant-product AMM base.
- [ ] Scaffold Foundry contracts and pinned dependency versions.
- [ ] Implement factory, pairs, router, fee accounting and WVERY adapter.
- [ ] Write swap, liquidity, fuzz and invariant tests.
- [ ] Complete internal review; do not deploy to mainnet yet.

## M03 — Wallet and token flows (implemented, awaiting human chain smoke test)
- [x] EIP-6963 multi-injected wallet detection, optional WalletConnect and disconnect UI.
- [x] ERC-20 real balance reads and network mismatch handling.
- [x] Router allowance reads and exact approve/revoke flows **fail closed** without reviewed deployment.
- [x] On-chain token metadata import, local watchlist and explicit unverified risk warnings.
- [x] Automated token validation and allowance security-gate tests.
- [ ] Verify EIP-6963 multi-wallet and WalletConnect QR flow against real wallets.
- [ ] Verify an ERC-20 balance read with a legitimately deployed VERY token.
- [ ] Enable live approval flow only after M02 deployed and M07 reviewed.


## M04 — Quotes and real swaps (code implemented; deployment and live tests pending)
- [x] Factory/pair reserve reads, direct/WVERY multihop routing and integer-safe output quotes.
- [x] Slippage presets/custom limits, min-output calculation and 1–60-minute deadlines.
- [x] Mandatory fresh requote, route equality and quote-bound slippage checks before execution.
- [x] Mandatory on-chain simulation, allowance checks, balance/gas buffer validation, wallet signature and receipt monitoring.
- [x] Swap UI: direction, reviewed tokens, output, route, impact, fee settings, refresh, transaction hash.
- [x] Unit tests for math, paths, failure cases and execution gates.
- [ ] Finish M02 audited AMM, verify factory/router/WVERY and approved fee configuration.
- [ ] Verify independent chain code, approved token list, deploy reviewer signoff.
- [ ] Perform browser/wallet smoke tests and small-value confirmed mainnet trades.
- [ ] Validate native gas estimation, router ABI compatibility and behaviour against deployed contracts.

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
