# LIDDE DEX — MILESTONE 9 PUBLIC LAUNCH MASTER PLAN

> **FUTURE PHASE · NOT AUTHORIZED FOR PUBLIC LAUNCH · VERY CHAIN ID 4613 · MIT LICENSE**
>
> Lidde currently has an experimental Solidity AMM and locally tested application source, **not a production-launched DEX**. No independent final audit, canonically verified WVERY contract, production AMM deployment, approved initial liquidity or completed Milestone 8 evidence has been established. Milestone 9 must NOT circumvent the Milestone 8 release gates.

**Source of truth:** [Milestone 8 current-priority checklist](MILESTONE-08.md), [M08 execution runbook](docs/MILESTONE-08-EXECUTION.md), [M09 full implementation runbook](docs/MILESTONE-09-EXECUTION.md), [main roadmap](docs/MILESTONES.md), and the [experimentally implemented contracts](contracts/src).

## Release dependencies inherited from M08

- [ ] **Independent auditor / real audit report:** [Issue #9](https://github.com/mushee-io/lidde-dex/issues/9) — audit scope, frozen source, remediation, retest and signoff.
- [ ] **Authentic canonical wrapped VERY:** [Issue #10](https://github.com/mushee-io/lidde-dex/issues/10) — official provenance, codehash, redemption and wrapper-router ABI match.
- [ ] **Security finding remediation:** [Issue #11](https://github.com/mushee-io/lidde-dex/issues/11) — package advisories and complete Slither triage.
- [ ] **Milestone 8 acceptance:** approved funds, audited deployable bytecode, real capped liquidity/swap/LP exit receipts, user wallet QA, Neon reconciliation, monitoring and independent M08 go/no-go.
- [ ] **Jurisdictional launch-law assessment:** UK financial promotions and 2026 emerging cryptoasset regulatory regime, plus other markets where the service is actually marketed; independent specialist legal counsel needed.

## Key distinction: source versus reality

| Product area | Current source status | Requirement for public release |
|---|---|---|
| Factory, Pair, Router, experimental wrapped native currency | MIT Solidity exists and compiles | Independent audit, canonical wrapper verification, verified deployed bytecode |
| Wallet, swap, pools and portfolio | Source implemented with gated transactions | Actual validated user wallet transactions and LP redemptions |
| Neon indexed data | M06A/B worker and migration code implemented | Operator-provisioned DB, reliable live event replay and reconciliation |
| On-chain analytics | M06C–F not proven operational | Actual sources, volume methodology, trustworthy pricing and honest unknown states |
| Security operations | Findings, preflight and runbook source exist | Independent final signoff, resolved risks, monitored real operations |
| Public launch and user marketing | Not started | Approved legal route, launch campaign reviews, safe infrastructure and genuine metrics |

## Milestone 9: 20 major stages / 140 individually checkable work items

| Stage | Primary workstream | Production status |
|---|---|---|
| **9.1** | M08 handover and independent public-release authorization | Not launched |
| **9.2** | Regulatory perimeter, legal entity, jurisdiction and communications | Not launched |
| **9.3** | Production hosting, domains, DNS, TLS and CI/CD | Not launched |
| **9.4** | Verified Factory, Router, Pair and WVERY contract registry | Not launched |
| **9.5** | Trading market admission, token verification and pool standards | Not launched |
| **9.6** | Swap launch, routing and execution lifecycle | Not launched |
| **9.7** | Liquidity pool creation, deposits, withdrawals and LP positions | Not launched |
| **9.8** | Wallet onboarding, permissions, security and accessibility | Not launched |
| **9.9** | Portfolio, LP history and activity provenance | Not launched |
| **9.10** | Indexer ingestion, Neon production operations and data correctness | Not launched |
| **9.11** | Transparent market analytics and trading charts | Not launched |
| **9.12** | Security monitoring, incident response and responsible disclosure | Not launched |
| **9.13** | Performance, scalability and resilience under public traffic | Not launched |
| **9.14** | Product UX, launch pages, content and navigation | Not launched |
| **9.15** | Public documentation, explorer evidence and self-service support | Not launched |
| **9.16** | Operations governance, treasury accounting and fee transparency | Not launched |
| **9.17** | Community, user support, phishing protection and service operations | Not launched |
| **9.18** | Marketing, ecosystem partnerships and measured launch distribution | Not launched |
| **9.19** | Staged public rollout, release-day command and reversible website changes | Not launched |
| **9.20** | Post-launch scorecard, audits and Milestone 10 handover | Not launched |

## Full implementation checklist — each stage includes exactly 7 testable tasks

### 9.1 — M08 handover and independent public-release authorization

**Owner:** Release owner, independent auditor, treasury signers  
**Gate:** SIGNED M08 exit docket and no live unresolved security incident  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Verify Milestone 8 ended with audited immutable source, canonical WVERY attestation, approved assets, authentic deployed bytecode and real swap/liquidity/redemption receipts.
- [ ] Collect an external auditor's final report and auditor-reviewed remediation/delta report matching the exact production commit and constructor inputs.
- [ ] Review all Critical/High findings, medium-risk dispositions, Slither triage, npm runtime advisory remediation and event-indexer reconciliation evidence.
- [ ] Reconfirm authorized treasury signers, production funding ceilings, no-pause limitations, live incident response and user communications.
- [ ] Obtain a *new*, independently attributable M09 public-launch go/no-go resolution; an M08 beta approval is not automatically a public-launch approval.
- [ ] Publish a dated signed release manifest that links contracts, chain ID 4613, verification blocks, public audit statements and operator contacts.
- [ ] Reject launch if any mandatory reviewer, approval, security evidence or production rollback communication capability is missing.

**Acceptance evidence:** Attributable signed M09 launch approval + independently reviewed audit, funding and beta exit records.  
**Stop / release blocker:** NO-GO until Milestone 8 is independently signed off.

### 9.2 — Regulatory perimeter, legal entity, jurisdiction and communications

**Owner:** Qualified legal counsel, compliance lead  
**Gate:** Completed jurisdiction/product legal analysis before marketing or offering trading  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Identify the responsible company/operators, supported countries, customer categories, server jurisdiction, financial control and actual functions performed.
- [ ] Obtain counsel's assessment of UK cryptoasset financial promotions, including lawful communication routes and whether website/social posts constitute an invitation or inducement.
- [ ] Review the FCA's 2026 cryptoasset regulatory framework, transition timelines and whether an identifiable controlling entity triggers present/future obligations for DeFi.
- [ ] Determine each offered asset's legal classification; treat derivatives, lending, tokenized securities and yield products as separate higher-risk approvals, not implied AMM features.
- [ ] Document sanctions/AML, consumer protection, tax, privacy/data handling, advertising standards and complaints/recordkeeping obligations for served markets.
- [ ] Produce approved risk text, Terms, Privacy Notice, restricted-country policy and geo-eligibility checks where advised by counsel, with limitations clearly described.
- [ ] Block all public onboarding/advertising for jurisdictions where required authorizations, promotion approvals, notices or product restrictions have not been established.

**Acceptance evidence:** Written specialist legal advice, approved jurisdiction matrix, compliant marketing texts, assigned compliance owner.  
**Stop / release blocker:** Unresolved promotions, regulatory authorization, sanctions or product-classification risk.

### 9.3 — Production hosting, domains, DNS, TLS and CI/CD

**Owner:** Infrastructure/SRE and security reviewers  
**Gate:** Reproducible tagged production build and secure domain release  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Select and verify Lidde's official domain, register DNS with MFA, registrar lock and recovery contacts; do not invent or assume the launch URL.
- [ ] Separate staging and production Vercel/project environments, environment variables, RBAC and deploy permissions.
- [ ] Configure TLS/HTTPS, CSP/security headers, dependency locking, restricted CORS as appropriate, safe redirects and image/url input validation.
- [ ] Pin build dependencies and GitHub Actions permissions; enforce code-owner approvals, branch protection and CI contract/app test gates.
- [ ] Store RPC and database credentials only in secrets management with rotation policy; prevent NEXT_PUBLIC exposure of sensitive keys.
- [ ] Deploy immutable artifact tied to Git commit/build attestation, test rollback to a known-good frontend build and verify no chain permissions change inadvertently.
- [ ] Run external uptime, synthetic read-only health probes and an incident drill before the first public traffic.

**Acceptance evidence:** Verified HTTPS/domain, successful staging/production build and rollback transcript, protected pipeline.  
**Stop / release blocker:** Uncontrolled DNS, leaked secrets, broken staging isolation or unapproved source.

### 9.4 — Verified Factory, Router, Pair and WVERY contract registry

**Owner:** Solidity lead and independent contract reviewer  
**Gate:** Actual verified addresses matching frozen audited bytecode  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Pin and publish Lidde Factory, Router, officially verified wrapped VERY, and reviewed pair contract addresses with chain ID and verification block.
- [ ] Compare deployed codehash, constructor args and compiler settings against externally audited, reproducible artifacts.
- [ ] Read `router.factory()`, `router.WETH()` and `factory.getPair(tokenA,tokenB)` directly from chain with immutable code provenance.
- [ ] Ensure the UI does not accept arbitrary router/Factory/Pool addresses from user input, external metadata or a mutable unreviewed API.
- [ ] Publish the exact 30 bps trading fee per hop and explain fee retention in reserves rather than an invented separate LP claim.
- [ ] Define an address/codehash change policy: freeze writes immediately pending independent review and new public notice.
- [ ] Confirm direct on-chain interaction remains possible even when Lidde's frontend is unavailable; disclose immutable/no-pause limitations.

**Acceptance evidence:** VeryScan-verified source, immutable audited commit, read-only on-chain matching proofs.  
**Stop / release blocker:** Any unverified contract, ABI/config or codehash mismatch.

### 9.5 — Trading market admission, token verification and pool standards

**Owner:** Asset risk reviewer and protocol security  
**Gate:** Restricted, reviewed first-market set with transparent data  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Specify eligible token categories and exclusions; do not automatically list everything a permissionless Factory can create.
- [ ] Verify each token's address, source, decimals, ERC-20 approval/transfer mechanics, proxy powers, blacklist rules, fee-on-transfer and rebasing behaviour.
- [ ] Require independently reviewed initial liquidity and verify each pool's `token0/token1`, reserves, balances, LP supply and token metadata.
- [ ] Define minimum data quality for visible pair rankings; separate reviewed/unsupported/unpriced markets.
- [ ] Display malicious-token and extreme-slippage warnings with accurate but non-promissory language.
- [ ] Establish token delisting/suspension criteria for the official UI and emergency review for proxy upgrades or compromised issuers.
- [ ] Publish token listing criteria, objective review history and conflict-of-interest declaration for teams/funds supplying liquidity.

**Acceptance evidence:** Versioned reviewed-token registry, audit trail, legitimate first pools and verified token disclosures.  
**Stop / release blocker:** Unsafe token represented as reviewed; data/issuer changes without approval.

### 9.6 — Swap launch, routing and execution lifecycle

**Owner:** Trading engine owner and wallet QA  
**Gate:** Successful real swap matrix on approved contracts/markets  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Enable router usage only after verified audited deployment registry and independent M09 release approval; avoid a single editable `releaseApproved` flag as proof.
- [ ] Calculate quotes from pinned or fresh reserves with exact BigInt decimals and verified 30 bps fee, direct routes or reviewed two-hop routing.
- [ ] Before wallet signature validate network 4613, spender/router code, user recipient, token eligibility, balance, allowance, gas, minimum output and deadline.
- [ ] Mandatory simulateContract and gas/price-impact display must fail closed when RPC, pool state or ABI binding cannot be verified.
- [ ] Show explicit state transitions: awaiting signature, signed hash, pending, confirmed, reverted, replaced or unknown after timeout.
- [ ] Record real token/token, native VERY/token and token/native small-value swap receipts and reconcile expected vs actual amounts.
- [ ] Instrument failed/reverted swaps without collecting seeds or signing data; add pause-on-anomaly front-end policy while recognizing immutable contract limits.

**Acceptance evidence:** Signed real swap test matrix, transaction hashes, traceable reserves/fees and successful wallet QA.  
**Stop / release blocker:** Wrong network/spender, stale quote bypass, unexplained token loss or invalid fee.

### 9.7 — Liquidity pool creation, deposits, withdrawals and LP positions

**Owner:** Liquidity engineer, risk and LP QA  
**Gate:** Approved real pools and redeemable LP positions  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] List verified Factory pools on `/pools` with reserve/supply/owner reads, sane pagination and honest empty states.
- [ ] On first deposits, display initial price selection, minimum locked LP, slippage and arbitrage risks clearly.
- [ ] Use reviewed token and exact-allowance controls for ERC-20/ERC-20 and native VERY/ERC-20 liquidity add paths.
- [ ] Show current wallet LP shares and underlying assets from on-chain reserves/supply at consistent block; do not invent historical yield.
- [ ] Support 25/50/75/100/custom removal with exact LP allowance, simulated router write, deadline and minimum returned.
- [ ] Test partial and full real redemption for approved positions including native wrapper flow and receipt links.
- [ ] Provide an independent smart-contract exit guide if the official frontend or data APIs are offline.

**Acceptance evidence:** On-chain add/mint/burn/withdraw receipts, reserve/supply/LP reconciliation and self-custodial exit evidence.  
**Stop / release blocker:** LP stuck, first pool price manipulation unmitigated or incompatible token.

### 9.8 — Wallet onboarding, permissions, security and accessibility

**Owner:** Frontend, wallet QA and security  
**Gate:** Reliable supported wallet experience without key custody  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Test injected EIP-6963 providers and optional WalletConnect QR on desktop and targeted mobile browsers.
- [ ] Ensure chain 4613 is confirmed before balances, approvals or trades; warn about switching accounts or chains mid-signature.
- [ ] Make spender, token, exact approval, minimum output, estimated gas and destination human-readable before signing.
- [ ] Support rejected signature, wallet disconnect, replacement/cancellation, receipt timeout, pending confirmation and insufficient gas.
- [ ] Never ask for seed phrases, private keys or custodial deposits; document self-custody and irreversible transaction risk.
- [ ] Test keyboard use, screen readers, labels, focus, contrast, locale number formatting and responsive transaction dialogs.
- [ ] Publish a tested wallet compatibility matrix and safe troubleshooting guides with verified links.

**Acceptance evidence:** Cross-wallet/browser accessibility and signing matrix, validated screenshots with sensitive data redacted.  
**Stop / release blocker:** Unsafe prompt, missing security checks or inaccessible critical confirmation.

### 9.9 — Portfolio, LP history and activity provenance

**Owner:** Wallet/data engineering  
**Gate:** Wallet history sourced from confirmed indexed logs, not fake data  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Read current ERC-20, native VERY and LP balances directly from reviewed chain contracts.
- [ ] Display user swaps, liquidity additions/removals and LP transfers grouped by actual transaction identity.
- [ ] Link every historical event to an actual explorer receipt and indicate indexed-through block and status.
- [ ] Handle multihop swaps, multiple events per transaction, LP transferred to a different owner and reorg changes.
- [ ] Display position underlying token amounts and share with exact decimal handling and nil/unknown state distinction.
- [ ] Do not calculate trading gains, user APY, fee earnings or fiat portfolio value unless verified accounting and price data supports them.
- [ ] Test wallet privacy controls, API rate limiting and clear cache/reset behaviour for non-sensitive view data.

**Acceptance evidence:** Real confirmed wallet/event reconciliation and transparent stale data messaging.  
**Stop / release blocker:** Fake balances, incorrect LP positions or privacy leakage.

### 9.10 — Indexer ingestion, Neon production operations and data correctness

**Owner:** Data/SRE operator  
**Gate:** Idempotent, reorg-safe confirmed event ingestion with alertable lag  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Apply M06 schema migrations to approved Neon production project and record migration checksum/rollback strategy.
- [ ] Run single-writer or safe coordinated indexer with separate DB roles; backfill from actual Factory PairCreated deployment block.
- [ ] Store canonical block hash, log index, tx hash and normalized exact decimals for Swap/Mint/Burn/Sync/Transfer.
- [ ] Verify checkpoint recovery after database/RPC outage, duplicate replays, concurrent workers and shallow reorganization rollback.
- [ ] Reconcile `Sync` reserves, LP totalSupply and event logs against on-chain contract values at same block.
- [ ] Monitor confirmation lag, RPC rate limits and schema growth, scale bounded RPC calls and alert on backlog.
- [ ] Define explicit degradation: hide derived charts/market rankings if indexer is stale or inconsistent, while preserving safe chain-only wallet views.

**Acceptance evidence:** Backfill/reorg/restart drill logs, reserve reconciliation and operational indexer runbook.  
**Stop / release blocker:** Missing block, duplicate event, stale checkpoint or mismatched reserves.

### 9.11 — Transparent market analytics and trading charts

**Owner:** Analytics owner and data reviewer  
**Gate:** Actual priced/unpriced pool metrics with independently reproducible methodology  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Compute verified 24h/7d/30d token-denominated pool trading volume and swap counts using confirmed canonical logs.
- [ ] Compute USD valuation only with reliable historical pricing; mark unpriced assets and coverage rather than fabricate TVL.
- [ ] Build reproducible OHLCV candles from swap execution prices with token ordering and decimal normalization.
- [ ] Explain TVL, trading volume, multi-hop pool-volume vs unique user trades, fee accrual and missing market data.
- [ ] Rank supported pools by genuine liquidity, activity or volume without pretending empty/new pools have history.
- [ ] Add metadata per metric (source chain, block, timestamp, lag, pricing source and freshness status).
- [ ] Crosscheck dashboard against explorer samples; automatically suppress data when reconciliation/price confidence fails.

**Acceptance evidence:** Reproducible indexed figures and price provenance; UI demonstrates accurate zero/unavailable states.  
**Stop / release blocker:** Misleading prices, fabricated volume or unpriced TVL counted as USD.

### 9.12 — Security monitoring, incident response and responsible disclosure

**Owner:** Incident commander and independent reviewer  
**Gate:** Real monitoring, tested recovery plans and known immutable contract constraints  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Operate contract codehash checks, reserve surveillance, anomalous price impacts, abnormal withdrawals, tx error and RPC health monitors.
- [ ] Configure paging, severity tiers, explicit responder roles and public communication channels that operators can actually access.
- [ ] Conduct simulated compromised deployer, malicious token, wallet phishing, outdated frontend and indexer reorg incident drills.
- [ ] Practice disabling Lidde-owned UI write actions and rollback; clearly state this does not pause immutable contracts.
- [ ] Maintain SECURITY.md private vulnerability intake, reproducible PoC triage and remediation/retest process.
- [ ] Set a public status channel and postmortem policy that distinguishes blockchain outages from Lidde-managed frontend/data issues.
- [ ] Close all actionable high/critical security, supply-chain and audit findings before public promotion.

**Acceptance evidence:** Incident drills, alert history, independent security signoff and active response rota.  
**Stop / release blocker:** No responders or exploitable severity-blocking findings.

### 9.13 — Performance, scalability and resilience under public traffic

**Owner:** Infrastructure lead / QA  
**Gate:** Capacity-tested frontend and backend within approved resource budget  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Test realistic concurrency for swap quotes, pool reads, wallet refreshes, API requests and indexer ingestion.
- [ ] Instrument p50/p95 latency, page load, error rates, 429s, connection limits and on-chain RPC capacity.
- [ ] Configure safe rate limiting, caching, request bounds and timeouts; do not cache spendable balances as authoritative.
- [ ] Test degraded RPC, partial Neon outage, stale market metrics and explorer downtime with visible fallback states.
- [ ] Implement health dashboards, logs and safe redeploy/rollback while preventing UI from reverting to unverified contract config.
- [ ] Document scaling cost limits and protect against abusive clients or data scraping without blocking basic safety disclosures.
- [ ] Run a rehearsed release smoke test after deploy and compare metrics to prelaunch baseline.

**Acceptance evidence:** Load test trace, performance objectives, uptime alerts and reproducible rollback proof.  
**Stop / release blocker:** Unbounded resource use, error spikes or misleading stale quotes.

### 9.14 — Product UX, launch pages, content and navigation

**Owner:** Design, frontend and accessibility owner  
**Gate:** Complete, truthful product experience on official domain  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Publish clearly differentiated Swap, Pools, Create Liquidity, Portfolio, Explore, Docs, Security and Support entry points.
- [ ] Ensure primary trading CTA never appears enabled if audited contract or approved token requirements are missing.
- [ ] Display wallet connection, current network, verified pair identities, slippage, price impact, liquidity and transaction state.
- [ ] Build explicit onboarding flow explaining no custody, irreversible blockchain transfers and unsupported assets.
- [ ] Remove placeholder stats/stock logos/testnet balances and all mock trading volume before public release.
- [ ] Test responsive page flow, keyboard navigation, accessible error text, browser caching and link safety.
- [ ] Use only verified project brand profiles and contract links; do not imply foundation endorsement without confirmed partnership.

**Acceptance evidence:** User acceptance test, complete accessibility checks and public content review.  
**Stop / release blocker:** False live claims, placeholder stats or broken user exit links.

### 9.15 — Public documentation, explorer evidence and self-service support

**Owner:** Documentation + support owner  
**Gate:** Open documentation and clearly attributable project/protocol evidence  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Publish audited Factory/Router/wrapper addresses and codehash, transaction verifier guide and canonical chain settings.
- [ ] Explain 30 bps fixed LP swap fee model, minimum-locked LP, risks of slippage/IL, no guaranteed yield and absence of protocol pause.
- [ ] Provide swap, add/remove LP, token verification, wrong-network and stuck-pending-transaction user guides.
- [ ] Link full source code under MIT, independent audit report, source commit, residual findings and unsupported token policy.
- [ ] Document wallet approval/revocation using actual spender addresses and external explorer references.
- [ ] Publish SECURITY.md private vulnerability reporting, support channel verification and phishing-prevention instructions.
- [ ] Require legal and security review of all claims, FAQs and community moderator canned responses.

**Acceptance evidence:** Complete reviewed public docs, real verified explorer links and support rehearsal.  
**Stop / release blocker:** Unverified addresses, claims of audits not obtained or missing warning content.

### 9.16 — Operations governance, treasury accounting and fee transparency

**Owner:** Treasury/governance owner  
**Gate:** Approved management of operator privileges, treasury and support expenses  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Record all foundation/project treasury wallets, signers, thresholds, deployment cost and operating runway without exposing secrets.
- [ ] Confirm Solidity contracts have no feeTo protocol switch or hidden admin revenue; no protocol treasury fee should be claimed.
- [ ] Account separately for gas, LP-owned fee growth, market-making inventory and any externally funded incentives.
- [ ] Establish on-chain and fiat bookkeeping procedures appropriate for jurisdiction and project legal obligations.
- [ ] Define treasury payments, vendor engagements, grant receipts and code deployment approval paths.
- [ ] Publish governance and conflict disclosures proportionate to product, distinguishing future token/governance plans from launch features.
- [ ] Reconcile month-end treasury balances and incident financial exposure against verified receipts.

**Acceptance evidence:** Treasury operating policy, approved controls, periodic reconciliations.  
**Stop / release blocker:** Unapproved spending, misrepresented fee revenue, unknown owner.

### 9.17 — Community, user support, phishing protection and service operations

**Owner:** Community/support and security  
**Gate:** Trustworthy public channels and usable support without custodial access  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Verify official website, GitHub, Telegram, X and Discord links that project operators actually control; avoid invented accounts.
- [ ] Pin warnings that moderators and support will never ask for private keys, mnemonic words, remote control or transaction authorizations.
- [ ] Set issue intake for failed trades, approvals, LP withdrawals, suspicious links, fake pools and transaction support.
- [ ] Define support prioritization for stuck LP exits, wrong-token approvals, account compromise and incident reports.
- [ ] Publish service status, supported languages/time zones and realistic staffing rather than invented 24/7 coverage.
- [ ] Build a feedback and analytics loop that respects user privacy and avoids unnecessary identifiable wallet profiling.
- [ ] Practice community incident alerts with correct chain explorer links and conservative wording.

**Acceptance evidence:** Verified communications, ticket/incident owner and tested escalation response.  
**Stop / release blocker:** Unverified channels, scam impersonation or missing user exit guidance.

### 9.18 — Marketing, ecosystem partnerships and measured launch distribution

**Owner:** Growth + compliance  
**Gate:** Lawful, truthful and evidence-grounded launch communications  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Review all X/Telegram/Discord, website, community advertising and exchange promotions against applicable UK and target-market rules.
- [ ] Use the permitted legal route to communicate any qualifying cryptoasset promotions; obtain approvals where required before publishing inducements.
- [ ] Do not advertise guaranteed APY, risk-free trades, foundation backing, audited status, public liquidity or metrics unless evidence exists.
- [ ] Verify chain/ecosystem integration claims and distinguish organic integration from formal VERY Foundation partnership.
- [ ] Plan controlled organic education, developer guides, wallet tutorials and community events after legal/security approval.
- [ ] Measure genuine visits, connected wallets, successful swaps and user retention with consent/privacy constraints.
- [ ] Include explicit geographic restrictions and standardized risk statements where counsel determines required.

**Acceptance evidence:** Lawyer-approved promotion checklist, signed claims evidence and verified campaign metrics.  
**Stop / release blocker:** Illegal/unapproved promotions, fake partnership or exaggerated numbers.

### 9.19 — Staged public rollout, release-day command and reversible website changes

**Owner:** Release commander / SRE / treasury  
**Gate:** Public deployment with monitored staged exposure and defined abort threshold  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Run final go/no-go meeting with real signed source/audit, M08 exit, legal review, chain/wrapper contracts and financial controls.
- [ ] Record frontend commit, deploy logs, configuration checksums, monitoring dashboards and official release URLs.
- [ ] Introduce traffic in controlled waves as operationally possible, but be clear immutable contracts remain globally callable.
- [ ] Test the real public site's wallet flow, data freshness, pool metadata, external explorer links and support pages after each wave.
- [ ] Watch reverts, reserve divergence, exploit signals, quote latency, complaints and gas spikes; stop official UI writes when threshold hit.
- [ ] Communicate launch status and incidents accurately; retain rapid frontend rollback, hide unverified assets and handle partial outages.
- [ ] Require a written incident-free observation period and final operator review before broad promotion.

**Acceptance evidence:** Dated signed launch log, monitoring evidence, live smoke results and response actions.  
**Stop / release blocker:** Failure to meet release criteria, critical incident or unsafe trading UI.

### 9.20 — Post-launch scorecard, audits and Milestone 10 handover

**Owner:** Protocol lead, analytics, risk committee  
**Gate:** Dated production review with real evidence and safe roadmap decisions  
**Present status:** Not production-verified; dependent on M08 handover unless explicitly stated.

- [ ] Measure actual trade volume, unique wallets, active pools, liquidity depth, LP redemption, uptime and confirmed failed/reverted transactions.
- [ ] Reconcile financial/token reports and true pool events at explicit canonical chain blocks; publish coverage and missing-pricing limitations.
- [ ] Review real user issues, phishing events, contract/ABI faults, indexer reorgs, operational cost and liquidity health.
- [ ] Run recurrent independent security reviews after material changes, security patches and newly admitted token types.
- [ ] Evaluate protocol sustainability realistically: AMM trading fees accrue to LPs; treasury revenue needs a separate deployed audited mechanism.
- [ ] Propose M10 expansion (only after independent risk/legal review) such as farming, routing, incentives or launchpad without claiming built functions.
- [ ] Publish a signed post-launch retrospective and separate authorization for each high-risk M10 feature.

**Acceptance evidence:** Real reconciled metric report and signed M10 project charter.  
**Stop / release blocker:** Unreconciled funds, unresolved exploits, misleading public metrics or unsupported feature expansion.

## Cross-functional public launch gating

The following criteria MUST all have separately verified evidence before broad public trading is authorized:

- [ ] M08 independent audit, official canonical WVERY verification, immutable audited bytecode, fixed 30 bps per-hop fee and fund approvals.
- [ ] Deployed token list, trading paths, liquidity creation/removal and independent LP exits verified with transaction receipts.
- [ ] Safe domain, production CI/CD controls, actual incident-response staff, frontend rollback and monitoring.
- [ ] Token governance, self-custody disclosures and actual user-support mechanisms.
- [ ] Counsel-led legal/regulatory assessment of UK financial promotions and served jurisdictions before consumer marketing.
- [ ] Verified source, honest audit report publication, known residual risk and official VeryScan links.
- [ ] Real Neon/indexer reconciliation and data quality, no fabricated volume or USD TVL.
- [ ] Dated attributable separate M09 release approvals and explicit abort thresholds.

## Developer proof commands from repository root

```bash
npm test
npm run typecheck
npm run build
forge build --sizes
forge test -vv
npm run beta:preflight
npm run beta:gate:ci
```

**These commands are development evidence, not independent authorization or an audit certificate.**

## Regulator guidance consulted for jurisdictional review

- [FCA: cryptoasset financial promotions and fiat on/off ramp](https://www.fca.org.uk/firms/cryptoasset-financial-promotions-and-fiat-crypto-ramp-services) — UK promotions can fall within the rules even if a website is based overseas or the technology is non-custodial.
- [FCA: cryptoasset regime policy overview (2026)](https://www.fca.org.uk/publications/policy-statements/cryptoasset-regime) — expanding regulatory scope (including identifiable DeFi controllers case-by-case) and transition preparations for 25 October 2027.
- [FCA: marketing to UK consumers](https://www.fca.org.uk/firms/cryptoassets/marketing-uk-consumers) — financial promotions channels and communications rules.

**This planning document is not legal advice; counsel must determine whether and how the specific Lidde activities can be offered or promoted in each target market.**
