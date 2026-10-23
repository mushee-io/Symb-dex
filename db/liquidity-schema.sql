-- Lidde VERY Chain read-only event indexer schema (not wallet custody).
-- Apply to an isolated Neon Postgres database after operator review.
CREATE TABLE IF NOT EXISTS liquidity_pools (
  chain_id INTEGER NOT NULL CHECK (chain_id = 4613),
  pair_address TEXT NOT NULL,
  factory_address TEXT NOT NULL,
  token0 TEXT NOT NULL,
  token1 TEXT NOT NULL,
  first_seen_block BIGINT NOT NULL,
  PRIMARY KEY (chain_id, pair_address),
  CHECK (pair_address ~ '^0x[0-9a-f]{40}$')
);
CREATE TABLE IF NOT EXISTS liquidity_events (
  chain_id INTEGER NOT NULL CHECK (chain_id = 4613),
  pair_address TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  block_hash TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  log_index INTEGER NOT NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('Mint','Burn','Swap','Sync','Transfer')),
  args JSONB NOT NULL,
  PRIMARY KEY (chain_id, transaction_hash, log_index),
  FOREIGN KEY (chain_id,pair_address) REFERENCES liquidity_pools (chain_id,pair_address)
);
CREATE INDEX IF NOT EXISTS liquidity_events_pair_block ON liquidity_events (chain_id,pair_address,block_number);
CREATE INDEX IF NOT EXISTS liquidity_events_block ON liquidity_events (chain_id,block_number);
CREATE TABLE IF NOT EXISTS liquidity_indexer_checkpoints (
  chain_id INTEGER NOT NULL CHECK (chain_id=4613),
  factory_address TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  block_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (chain_id, factory_address)
);
-- LP ownership shown to users must be re-read from blockchain.
