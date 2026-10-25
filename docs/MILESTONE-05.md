# Milestone 5 — Liquidity Deep Integration (source implemented)

## Implementation map

- `lib/liquidity/math.mjs`: integer sqrt, initial/minimum LP, reserve-ratio matching, LP ownership, minimum outputs, withdrawal amount math.
- `lib/liquidity/abi.ts`: V2 factory, pair and router signatures; require independent ABI review before release.
- `lib/liquidity/policy.mjs`: release gate, verified asset pair checks, native VERY and ERC-20 add/remove calldata builders, slippage and deadlines.
- `lib/liquidity/discovery.ts`: verified factory pair discovery, real pool data, block-consistent LP ownership.
- `hooks/use-liquidity-pools.ts`: paginated read-only polling, wallet LP positions.
- `hooks/use-liquidity-execution.ts`: reviewed contract relationship checks, exact ERC-20 and LP approvals, mandatory wallet simulation, gas checks, submission, receipt status, unknown-state preservation.
- `components/liquidity/*`: pool explorer, deposit/withdrawal control, contract detail, LP portfolio.
- `app/pools`, `/pools/create`, `/pools/[pair]`, `/portfolio`: integrated UI routes.
- `db/liquidity-schema.sql`: Neon schema for pair metadata, indexed historical receipts and durable checkpoints.
- `scripts/index-liquidity.mjs`: opt-in, bounded confirmed-block event scanner.

## Release state

**Source implementation is not a deployed liquidity protocol.** At the time of this milestone:
- `config/deployments.json` has null factory, router, wrappedVery and fee.
- The verified token registry is empty, so no assets are enabled for writes.
- There is no deployed production AMM in this repository and no liquidity pool or user deposits.
- No real wallet, mainnet transaction or operational Neon ingestion has been tested.
- Milestone 2's independently reviewed factory, pair, router and canonical WVERY must be delivered first, with Milestone 7 security review.

Users must not be induced to send funds or approve arbitrary contracts. No contracts are deployed and no transactions are automatically sent by CI.

## Run and inspect

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Browse `/pools`, `/pools/create`, `/portfolio`; currently they show honest empty/not-deployed states.

## Verified deployment checklist (future)

1. Verify VERY RPC chain 4613 and check factory/router/wrapped VERY source and bytecode on VeryScan.
2. Confirm `router.factory()` and `router.WETH()` match the approved addresses and ABI.
3. Verify pool pair token ordering, reserve math, LP supply and initialization parameters.
4. Independently review which ERC-20 tokens are eligible; never auto-promote imported tokens to reviewed.
5. Confirm ERC-20 nonstandard behaviour policy, exact approvals, deadline and slippage protections.
6. Sign off multi-sig owner/operator roles and publish contract addresses with provenance.
7. Complete fork/local simulation tests before using approved capped-value VERY Mainnet tests.
8. Verify PairCreated, Mint, Swap, Burn and Transfer logs, pool reserves, and the account's final balance against VeryScan.
9. Confirm source tests, CI and independent security review before enabling frontend release flags.

## Database and indexing

Apply `db/liquidity-schema.sql` to a separate Neon database. Once a verified factory is set, configure `DATABASE_URL` and `SYMB_INDEXER_START_BLOCK` as operator-only environment variables. Run `npm run index:liquidity` manually or via a separately authorized scheduler.

Indexer safety boundaries:
- Reads only, chain ID and factory bytecode checked; ingests only logs from registered factory pools.
- Bounded to 300 pools and 250 blocks per invocation; additional scale-out required for larger protocols.
- Indexes blocks with 12+ confirmations, maintains per-factory checkpoint block hash and halts on historical mismatch.
- Writes all event rows plus checkpoint in one database transaction. Idempotency keys include chain, transaction hash and log index.
- Does not support automated deep chain-reorg recovery, live volume/APY calculation, or trading history APIs yet. Those require Milestone 6 production indexing and monitoring.
- Historical LP earnings cannot be derived reliably from the current pool reserves alone. No fabricated earnings are displayed.
- Never expose the database URL in browser code or commit it.

## Known limitations

- `/pools` and Portfolio paginate 12 pools at a time. Portfolio displays LP holdings in the selected page only; not a chain-wide full history.
- Pool creation is implicit through V2 `addLiquidity` when a pair does not exist, subject to the final router.
- Token eligibility requires an independently curated token list. Unreviewed pairs may be discoverable in the factory but are hidden from trading UI.
- Native VERY support depends on the verified wrapped VERY address.
- UI and executable code still require contract ABI and gas/simulation testing against the actual deployed implementation.
- Dollar-value TVL, swap history and fee APR are intentionally withheld until a reliable indexer/oracle is integrated.

## Definition of done for mainnet release (not yet met)

Factory/pair/router/WVERY deployed and verified, sufficient reviewed token lists and genuine liquidity,
successful bounded first mint, add, partial remove and full withdraw, receipt/balance reconciliation,
audited code, multisig configuration, reliable event ingestion and operational alerting.
