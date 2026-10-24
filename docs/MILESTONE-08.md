> Deep engineering and evidence-level breakdown: [Milestone 08 Execution Runbook](MILESTONE-08-EXECUTION.md). Run `npm run beta:preflight` for a read-only report or `npm run beta:gate:ci` to assert the repository remains deliberately unlaunched. These tools do not authorize deployment.

# Milestone 08 — Capped VERY Mainnet Beta (Detailed Plan)

**Status: NOT STARTED as a live deployment.** This is a build-and-release specification, not authorization to transfer native VERY, issue trading contracts or onboard liquidity providers.

## M08.1 — Verified chain and wrapped-native token
- Confirm VERY chain ID 4613, chain client's EVM compatibility and finality policy.
- Obtain official issuer-backed WVERY provenance, deployment bytecode, redeemability, backing and source verification.
- Validate router WETH() selector / deposit() / withdraw() behaviour against the selected verified wrapper.
- Block release if token source, address, codehash or withdrawal mechanism remains unverified.

## M08.2 — Freeze the audited Solidity release
- Select a single immutable source SHA, compiler version, optimizer settings, EVM target and source license.
- Require independent full-scope audit, severity-ranked report and documented fixes/retests.
- Repeat Foundry fuzz/invariants, Slither finding triage, deployment scripts and fork tests against the frozen artifacts.
- Reject any material post-audit source change without independent delta review.

## M08.3 — Reproducible deployment manifest
- Produce Factory, Router, canonical WVERY and Pair implementation addresses only after real verified receipts exist.
- Record deployer, transaction hashes, deployed bytecode hashes, verified sources, constructor args and pair-code provenance.
- Confirm factory.getPair symmetry and router.factory()/router.WETH() against the manifest at a pinned block.
- Ensure the release registry is not enabled by a hand-edited boolean alone.

## M08.4 — Safe account custody and governance
- Establish separate multisig treasury, deployer and operational authorities as appropriate to actual contract roles.
- No single operator may unilaterally approve deployment and public funding.
- Use bounded initial amounts, separate test wallets and no shared mnemonic or plaintext signing secrets.
- Since current original Factory/Pair are immutable without pause, document that frontend disable does not stop direct on-chain swaps.

## M08.5 — Approved launch assets
- Explicit token eligibility list with address, verified bytecode, supply/transfer behaviour, decimals and governance signoff.
- Exclude nonstandard, rebasing, tax-on-transfer, upgradeable, restricted or unaudited tokens pending compatibility review.
- Publish clear unsupported-token warnings and trusted-token provenance.

## M08.6 — Deployment rehearsal in local ephemeral chain
- Deploy fresh local Factory, Router, wrapper fixture and mock ERC-20s; never broadcast to chain 4613.
- Test first LP mint, ERC20/ERC20 and VERY/ERC20 liquidity, token/native swaps, LP approvals and partial/full withdrawals.
- Assert event logs, reserve and supply reconciliation, locked initial LP and gas consumption within caps.
- A failed rehearsal blocks the beta.

## M08.7 — VERY fork / RPC simulation
- Use real verified contract bytecode on a local fork without signing real mainnet transactions.
- Pin the fork block, compare implementation-specific EVM behaviour and simulate wrapping, approvals and funding.
- Verify gas estimation, transaction decoding and reorg handling against VERY client characteristics.
- Store sanitized reproducible transcripts, block height and source hashes.

## M08.8 — Operator-approved tiny first liquidity
- Define an explicit funding cap **before** spending. No cap amount is assumed in code.
- Review market price/initial liquidity ratio and attack exposure before first mint.
- Require multisig-approved transaction review and documented risk acknowledgement.
- Seed only reviewed pairs with pre-approved treasury funds and capture immutable receipts.

## M08.9 — Small on-chain swaps
- On mainnet only after all external security gates pass: perform the smallest useful native→token and token→native swaps.
- Compare quote, minOutput, event logs, balances, contract reserves and gas charge for every receipt.
- Test quote expiry and deliberate slippage failure using no-risk simulation first.

## M08.10 — LP redemption and emergency exits
- Approve LP exact amount, withdraw 25%, then redeem the rest, confirming balances and locked minimum LP.
- Verify refund/claim behaviour and unsupported token failure handling.
- Confirm provider exit is possible without a proprietary admin or frontend.

## M08.11 — Browser and wallet compatibility
- Test EIP-6963 injected wallets and optional WalletConnect sessions with verified transactions.
- Verify account change, wrong network, rejected signatures, disconnected wallet and transaction replacement.
- Confirm mobile layout, accessibility and user-facing transaction provenance.

## M08.12 — Indexer and Neon operationalization
- Migrate approved Neon staging/production databases with locked-down DB roles.
- Ingest actual PairCreated, Swap, Mint, Burn, Sync and LP Transfer logs; replay from deployment block.
- Test atomic restart, reorg rollback, cursor races, on-chain reserve reconciliation and indexer lag.
- Do not publish volume, TVL or APR until raw and derived data reconcile.

## M08.13 — Capped beta rollout
- Create explicit wallet invitation/allowlist and funding restrictions where possible.
- Understand immutable permissionless pair/router cannot cryptographically enforce frontend access restrictions.
- No promise of risk-free trading, guaranteed price or APY.
- Limit exposure through treasury funding, deployment configuration and audited guardrails actually implemented.

## M08.14 — Monitoring, alerts and incident drills
- Watch reserve invariants, suspicious swaps, abnormal price impact, contracts and indexer/DB health.
- Have designated responders, public notices, wallet remediation text and escalation matrix.
- Practice site-write shutdown and community notification; do not falsely claim on-chain emergency pausing.

## M08.15 — Explorer and public verification
- Verify source on VeryScan and show exact contract addresses, fee (30 bps per hop) and codehash evidence.
- Publish security reports, deployment manifest, team disclosure and known limitations.
- Every significant mainnet result must link to an actual transaction receipt; no invented metrics.

## M08.16 — Beta metrics with data integrity
- Report only actual unique wallets, submitted/confirmed/reverted trades, live TVL, reliable price coverage and LP positions.
- Include block numbers, timestamps, indexing lag and explicit unpriced assets.
- Separate multi-hop pool trading volume from unique end-user order flow.

## M08.17 — Beta risk signoff and kill criteria
- Before launch, require external audit signoff, reviewed tokens, verified wrapper and router, approved funds, readiness drill and defined operator roles.
- Stop if exploit signal, reserve mismatch, invalid codehash, serious indexer divergence, fraud/spoofing or lost signing control occurs.
- 'Disable writes' for UI only; direct pair transfers remain possible unless the AMM design is changed.

## M08.18 — M09 handover decision
- Require dated review of real on-chain receipts, incident history, fee economics and high-severity findings.
- Publish both achieved results and limitations; do not extrapolate test results into promised launch volume.
- Permit public release only through a separate documented approval process.

## Exit tests
1. A verified canonical wrapped VERY contract and independently audited Lidde bytecode are documented.
2. Real tiny first mint, token/native swap, partial LP withdrawal and full LP redemption succeed under capped funds.
3. Explorer events, user balances and indexer records reconcile at explicit confirmed blocks.
4. Incident procedures, funding limits, signers and monitoring are tested.
5. No unresolved critical/high findings and no undisclosed high-risk npm/runtime advisories remain.
6. M08 approval is separately signed by authorized operators and security reviewers.

**None of these mainnet exit tests are satisfied by local Foundry tests alone.**
