# Lidde M09 — Public Launch Operations and Handover Runbook

**Status: development plan only.** Public release has NOT been authorized. This runbook complements [the root 20-stage / 140-task checklist](../MILESTONE-09.md). Milestone 8 is the current dependency and must be independently completed first.

## 1. Release planning workstreams

| Workstream | Milestone references | Responsibility | Evidence |
|---|---|---|---|
| Security and formal readiness | 9.1, 9.4, 9.12 | Independent security reviewer + protocol owner | Final audit, codehash, approved release docket |
| Compliance and eligible jurisdictions | 9.2, 9.18 | Qualified legal counsel | Written perimeter and financial-promotion advice |
| Hosting and infrastructure | 9.3, 9.13, 9.19 | SRE/security | Production build, secrets controls, rollback, alerts |
| Asset and market integrity | 9.5, 9.6, 9.7 | DeFi execution, liquidity risk | Verified tokens, authorized swaps and LP exits |
| User experience and self-custody | 9.8, 9.9, 9.14, 9.15 | Frontend and support | Wallet/browser matrix, documentation, honest balances |
| Analytics and data | 9.10, 9.11 | Indexer, database and analytics | Reorg/restart tests, block-matched metrics |
| Operations, finances and growth | 9.16, 9.17, 9.18, 9.20 | Treasury/product/community | Approved fund policy, compliant campaigns and closeout |

## 2. Establish launch readiness without circulating real funds

A prelaunch meeting must compare the exact source SHA, auditor's final scope, immutable bytecode, pair metadata, official native wrapper, full LP redemption evidence and signed M08 closeout record. Record the independent reviewer decision as an attributable document, not an editable field.

Confirm an operational legal entity or accountable operator. Obtain advice from qualified counsel for the target jurisdictions, marketing channels, AML/sanctions and privacy. In the United Kingdom, FCA financial promotions rules may apply even to websites available from outside the UK, and the 2026 regime anticipates wider cryptoasset permissions from 25 October 2027. The particular Lidde legal obligations are **not determined by this software plan**.

Launch preparation can continue with deterministic unit tests, privacy review, source verification, legal documentation and simulations. None of those independently authorizes creating or funding a public pool.

## 3. Deployment rehearsal

1. Build exactly the frozen reviewed SHA with Foundry and Next.js; retain artifact hashes, runtime version and source attestations.
2. Compare production config and underlying Factory/Router/WVERY/pair bytecode through read-only RPC against the signed manifest. Reject null or mismatched addresses without auto-correcting.
3. Test the staging-to-production website process with a mocked chain/fork, HTTPS, official domain, content-security policy and kill switch for UI write actions.
4. Simulate wallet account/chain switches, exact approvals, gas estimation, quote change, slippage reverts, LP withdrawal and frontend outage recovery.
5. Confirm no deployment/funding scripts run on CI from unreviewed pull requests. Review access to GitHub, Vercel and database roles.
6. Validate monitoring, notification routes and stakeholder ownership; rehearse rollback of site only, never claim that immutable pair contracts are paused.

## 4. Real-chain and customer evidence (conditional on M08 authorization)

Every claim must be linked to a real on-chain receipt with network ID, block/hash, signer account (redacted when necessary), contract address, actual asset amounts and confirmation status.

Use the separately authorized test wallet and budget to verify swap paths and LP exit. Ensure that both direct contract and official UI withdraw mechanisms are represented honestly. Review the amount of native VERY locked in gas and wrapping operations.

Capture operating metrics from Neon with the same canonical block number as pair reserve reads; do not publish USD TVL without reliable prices. A browser balance displayed from cached or stale off-chain data cannot be used as a spendable wallet balance.

## 5. Legal/compliance review for launch communications

The legal review must expressly cover website copy, X posts, Telegram/Discord messages, paid promotions and any wallet referral campaigns that invite cryptoasset activity. Obtain the lawful communication route where an FCA-regulated qualifying promotion would be made to UK consumers. Do not assume a permissionless non-custodial AMM is categorically outside existing or emerging rules.

Other applicable country sanctions, consumer protection, privacy, financial crime, tax and asset-class restrictions must be reviewed separately with legal counsel. If counsel requires limits, impose appropriate controls on the operator-managed website/marketing; disclose that these cannot necessarily restrict immutable permissionless on-chain interactions.

References checked:
- https://www.fca.org.uk/firms/cryptoasset-financial-promotions-and-fiat-crypto-ramp-services
- https://www.fca.org.uk/firms/cryptoassets/marketing-uk-consumers
- https://www.fca.org.uk/publications/policy-statements/cryptoasset-regime

## 6. Day-of-public-launch command

The release commander should not begin until the independent go/no-go decision and related legal/security/financial approvals are attached. During each deployment wave, record:

- Exact release commit and build artifact.
- Site URL, deployment timestamp, domain and DNS verified ownership.
- Chain ID and read-only codehash verification results.
- Swap/LP wallet smoke tests with reviewed assets and permitted test amounts.
- HTTP health, RPC and Neon indexer lag, wallet error rate and support queue.
- On-call responders, abort criteria and user communication templates.

**Abort immediately** for any exploit signal, compromised keys, wrong contract identity, reserve mismatch, inability to withdraw, illegal promotional content or missing operator authorization. Disabling site-based writes does not disable the immutable Factory/Pair contract.

## 7. Public transparency and operations

Publish verified contract addresses, docs, actual independent audit report and residual findings, supported token rules, gas/fees, liquidity risks, status page, incident reporting and anti-phishing instructions.

Clearly state that swap fees are retained inside LP pools for the implemented V2-style model; protocol treasury revenue is not supported by the current contracts. New farm rewards, token launchpad, derivatives or governance assets should not be advertised as current exchange functions.

## 8. Post-launch and M10

Record 24-hour, 7-day and 30-day operational/financial metrics only when real verified data exists. Review user issues, failed swaps, liquidity health, protocol code/proxy changes, cost, incident response and data reconciliation. Assign owners to any unresolved risks, including legal compliance or unsupported market data.

Only submit Milestone 10 proposals through a new scope, audit, legal and funding review. Do not automatically enable high-risk expansion after M09.

## Developer commands (safe and currently relevant)

```bash
npm test
npm run typecheck
npm run build
forge build --sizes
forge test -vv
npm run beta:preflight
npm run beta:gate:ci
```

These checks verify source behaviour and that configuration remains locked. They do not perform an independent audit, complete legal analysis, deploy a contract or authorize spending.

**Required present conclusion:** NO-GO for public launch until M08 and all independent M09 release gates have been met.
