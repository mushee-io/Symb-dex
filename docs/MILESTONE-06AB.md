# Lidde Milestone 6A and 6B — Canonical chain indexer and durable market database

**Status: source implementation only.** The AMM from M02 remains undeployed and the factory address in `config/deployments.json` is null. No real mainnet events, swaps, candles, volumes or TVL are claimed. No Neon migration has been applied to the user's projects by this implementation.

## 6A architecture

`services/indexer/worker.mjs` indexes confirmed blocks from a user-specified verified factory deployment height with a durable cursor. It:
1. Reads the configured chain's RPC and rejects any chain other than VERY (4613).
2. Verifies bytecode at the configured factory address; no guessed factory or token addresses.
3. Derives a conservative confirmed head with an adjustable confirmation buffer (default 12; NOT a guarantee of finality).
4. Reads canonical headers for every scanned block with strict parent-hash continuity.
5. On subsequent runs, compares stored checkpoint hashes with canonical RPC data; if a fork happened, discovers the last retained matching ancestor (maximum 128 blocks by default) or halts.
6. Queries factory `PairCreated` events for each bounded window, confirms pair code, token0/token1 and factory getPair registration at the window's ending block.
7. Reads events from all registered pairs including pairs created within the same scanned window; recognizes Swap, Mint, Burn, Sync and LP Transfer.
8. Requires each log's block hash to match the downloaded canonical header and writes amounts as exact decimal strings.
9. Re-checks the scanned tip for a reorg before committing.
10. Saves the segment, newly verified pairs, raw logs, normalized values and checkpoint in ONE Neon transaction.
11. Uses a chain-wide PostgreSQL transaction advisory lock and optimistic cursor assertion to reject a stale concurrent worker.

The worker is bounded to 100 blocks per invocation window, 400 verified pairs, 2,500 fetched logs and RPC batches of 20 pair addresses. Defaults are 50 blocks and one window per CLI invocation. This is a cautious initial implementation, **not** high-throughput production infrastructure.

Unknown pair event topics (e.g., Approval) are ignored; any recognized but malformed pair event aborts the batch instead of dropping data. Contract/pair mismatches, incorrect chain, reorgs during scanning, truncated data and database exceptions all halt progression.

## 6B schema and consistency

`db/migrations/006a_006b_indexing.sql` is the new v6 canonical model. The M05 legacy tables and script remain in the repository for backwards compatibility; do not operate both indexers for the same factory or treat their records as merged.

- `m06_blocks`: every indexed block's hash, parent hash and timestamp.
- `m06_pairs`: verified factory PairCreated provenance and token metadata.
- `m06_events`: raw decoded pair logs with idempotent identity `(chain_id, transaction_hash, log_index)`.
- `m06_swaps`: exact bigint-compatible input/output columns (PostgreSQL NUMERIC(78,0)).
- `m06_liquidity_actions`: normalized mint/burn amounts and recipients.
- `m06_syncs`: canonical reserves after pool actions.
- `m06_lp_transfers`: LP ownership movement, including mint/burn transfers.
- `m06_cursors`: durable per-factory checkpoint with hash.
- `m06_reconciliation_checks`: on-chain vs indexed reserve comparisons and status.

Normalized tables have foreign keys to the canonical raw events, which have foreign keys to canonical block and pool rows. A reorganization deletes orphaned block rows and cascades their dependent events, liquidity positions and reserve snapshots; affected newly created pools are removed as well. The checkpoint is then replaced inside the same transaction.

### Database race safety

Inside each transaction: acquire an advisory lock for chain 4613; assert the previously read cursor still matches; prune orphan blocks on fork; insert canonical headers, pools and events; advance checkpoint. Any exception aborts the transaction. Concurrent workers with stale cursors fail rather than silently overwriting progress.

### Bootstrap a database (explicit operator action)

Prerequisites: a real audited M02 factory deployed on VERY Mainnet, its verified address in `config/deployments.json`, known accurate factory deployment block, separately provisioned Neon database and an appropriate DB user.

Execute the checked migration through your database's SQL console or with an operator-installed `psql`:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/006a_006b_indexing.sql
```

Then set these variables **only in the operator's environment**, never in browser/public variables:

```bash
DATABASE_URL=postgresql://your-private-connection
LIDDE_INDEXER_START_BLOCK=<verified-factory-deployment-block>
LIDDE_INDEXER_BATCH_SIZE=50
LIDDE_INDEXER_CONFIRMATIONS=12
LIDDE_INDEXER_MAX_WINDOWS=1
```

For actual shell use, replace the bracketed start-block placeholder with an integer; never commit a DATABASE_URL.

Run manually:

```bash
npm install
npm test
npm run typecheck
npm run build
npm run index:market
npm run reconcile:market
```

The indexer processes at most the configured windows each invocation, so invoke it repeatedly or place it in a **single-writer, owner-authorized** scheduler after verifying head/lag. It does not run automatically as part of the Next.js app or GitHub Actions. Both commands fail safely while the M02 factory remains unconfigured.

### Reconciliation

`scripts/reconcile-market.mjs` compares the latest indexed Sync reserve amounts with `getReserves()` at the **indexed checkpoint block**, persisting `match`, `mismatch` or `uninitialized` results. It fails the command when any mismatch exists. Because pool reserves may legitimately be zero before first Mint, zero-reserve pools without prior Sync are marked uninitialized.

### Recovery / integrity runbook

- **RPC failed / DB failed:** retry with same checkpoint; since commit is atomic, no partial progress should occur.
- **Concurrent worker race:** the second writer receives a stale-cursor exception; refresh its cursor and retry.
- **Shallow reorg:** find the canonical ancestor in the last 128 stored blocks, delete orphan rows and replay replacement headers and events atomically.
- **Deep reorg (or no ancestor retained):** stop, reconcile manually with chain source and obtain explicit approval before resetting any cursor.
- **Reserved price/fee metrics:** do not infer a USD price, trading volume or LP APR from raw reserves; those belong to M06C.
- **Deployment changed:** factory provenance must be re-reviewed and historical event routing designed before migrating to a replacement factory; do not silently merge chains or unrelated factories.

## Known limitations and acceptance work remaining

1. RPC replay and Neon atomicity have unit/fixture coverage; no real Neon staging transactions or live blockchain replay have been executed yet.
2. The worker uses one address-factory and a bounded pair-list; large protocols need partitioned pool scanning, RPC backpressure, and performance tuning.
3. The 12-block confirmation policy is configurable and should be validated for VERY's finality model.
4. On-chain pool provenance is checked for each new pool; existing pairs rely on stored verification metadata and can be revalidated during operations.
5. Receipt-level or transaction-directed user-history grouping is out of scope until M06D.
6. Aggregate volume, USD TVL, candles, fee attribution, portfolio charts and APIs remain M06C–F.
7. There are no cron schedules, API keys, private keys, automatic on-chain transactions or public funding actions in this milestone.
8. An independent staging database and a local/forked AMM fixture are still required before declaring this indexer production-ready.

## Acceptance evidence expected for operational completion

- Fresh database migration succeeds.
- Factory PairCreated and pool event logs match verified on-chain transaction receipts.
- Worker restart from persisted cursor produces no duplicate rows.
- Concurrent indexer processes cannot both advance a stale cursor.
- Reorg simulation cascades removal of orphan events and replays canonical replacements.
- Latest indexed reserves match `getReserves()` at the same block for all known pools.
- RPC errors leave the checkpoint unchanged.
- Process liveness, indexing lag and reconciliation alarms are configured before autonomous operation.
