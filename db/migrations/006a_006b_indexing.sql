-- Milestone 6A/B. New canonical schema alongside M05 legacy tables.
-- The earlier one-off indexer remains unchanged for backwards compatibility, but MUST NOT
-- run concurrently with the new worker against the same factory. Backfill from verified deployment block.
BEGIN;

CREATE TABLE IF NOT EXISTS m06_blocks (
  chain_id INTEGER NOT NULL CHECK (chain_id = 4613),
  block_number BIGINT NOT NULL CHECK (block_number >= 0),
  block_hash TEXT NOT NULL CHECK (block_hash ~ '^0x[0-9a-f]{64}$'),
  parent_hash TEXT NOT NULL CHECK (parent_hash ~ '^0x[0-9a-f]{64}$'),
  timestamp_seconds BIGINT NOT NULL CHECK (timestamp_seconds >= 0),
  PRIMARY KEY (chain_id, block_number)
);

CREATE TABLE IF NOT EXISTS m06_pairs (
  chain_id INTEGER NOT NULL CHECK (chain_id = 4613),
  factory_address TEXT NOT NULL,
  pair_address TEXT NOT NULL,
  token0 TEXT NOT NULL,
  token1 TEXT NOT NULL,
  created_block BIGINT NOT NULL,
  created_tx TEXT NOT NULL,
  created_log_index INTEGER NOT NULL,
  PRIMARY KEY (chain_id, pair_address),
  UNIQUE (chain_id, created_tx, created_log_index),
  FOREIGN KEY (chain_id, created_block) REFERENCES m06_blocks(chain_id, block_number) ON DELETE CASCADE,
  CHECK (pair_address ~ '^0x[0-9a-f]{40}$'),
  CHECK (token0 <> token1)
);
CREATE INDEX IF NOT EXISTS m06_pairs_creation ON m06_pairs(chain_id, created_block);

CREATE TABLE IF NOT EXISTS m06_events (
  chain_id INTEGER NOT NULL CHECK (chain_id = 4613),
  pair_address TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  block_hash TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  log_index INTEGER NOT NULL CHECK (log_index >= 0),
  event_name TEXT NOT NULL CHECK (event_name IN ('Mint','Burn','Swap','Sync','Transfer')),
  args JSONB NOT NULL,
  PRIMARY KEY (chain_id, transaction_hash, log_index),
  FOREIGN KEY (chain_id, pair_address) REFERENCES m06_pairs(chain_id,pair_address) ON DELETE CASCADE,
  FOREIGN KEY (chain_id, block_number) REFERENCES m06_blocks(chain_id, block_number) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS m06_events_pair_block ON m06_events(chain_id,pair_address,block_number,log_index);
CREATE INDEX IF NOT EXISTS m06_events_block ON m06_events(chain_id,block_number);

CREATE TABLE IF NOT EXISTS m06_swaps (
  chain_id INTEGER NOT NULL,
  transaction_hash TEXT NOT NULL,
  log_index INTEGER NOT NULL,
  amount0_in NUMERIC(78,0) NOT NULL,
  amount1_in NUMERIC(78,0) NOT NULL,
  amount0_out NUMERIC(78,0) NOT NULL,
  amount1_out NUMERIC(78,0) NOT NULL,
  sender TEXT NOT NULL, recipient TEXT NOT NULL,
  PRIMARY KEY(chain_id,transaction_hash,log_index),
  FOREIGN KEY(chain_id,transaction_hash,log_index)
    REFERENCES m06_events(chain_id,transaction_hash,log_index) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS m06_liquidity_actions (
  chain_id INTEGER NOT NULL,
  transaction_hash TEXT NOT NULL,
  log_index INTEGER NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('mint','burn')),
  amount0 NUMERIC(78,0) NOT NULL,
  amount1 NUMERIC(78,0) NOT NULL,
  sender TEXT NOT NULL,
  recipient TEXT,
  PRIMARY KEY(chain_id,transaction_hash,log_index),
  FOREIGN KEY(chain_id,transaction_hash,log_index)
    REFERENCES m06_events(chain_id,transaction_hash,log_index) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS m06_syncs (
  chain_id INTEGER NOT NULL,
  transaction_hash TEXT NOT NULL,
  log_index INTEGER NOT NULL,
  reserve0 NUMERIC(78,0) NOT NULL,
  reserve1 NUMERIC(78,0) NOT NULL,
  PRIMARY KEY(chain_id,transaction_hash,log_index),
  FOREIGN KEY(chain_id,transaction_hash,log_index)
    REFERENCES m06_events(chain_id,transaction_hash,log_index) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS m06_lp_transfers (
  chain_id INTEGER NOT NULL,
  transaction_hash TEXT NOT NULL,
  log_index INTEGER NOT NULL,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  amount NUMERIC(78,0) NOT NULL,
  PRIMARY KEY(chain_id,transaction_hash,log_index),
  FOREIGN KEY(chain_id,transaction_hash,log_index)
    REFERENCES m06_events(chain_id,transaction_hash,log_index) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS m06_cursors (
  chain_id INTEGER NOT NULL CHECK (chain_id = 4613),
  factory_address TEXT NOT NULL,
  block_number BIGINT NOT NULL,
  block_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (chain_id,factory_address),
  FOREIGN KEY (chain_id,block_number) REFERENCES m06_blocks(chain_id,block_number)
);

CREATE TABLE IF NOT EXISTS m06_reconciliation_checks (
  chain_id INTEGER NOT NULL CHECK (chain_id = 4613),
  pair_address TEXT NOT NULL,
  at_block BIGINT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('match','mismatch','uninitialized','rpc_error')),
  indexed_reserve0 NUMERIC(78,0),
  indexed_reserve1 NUMERIC(78,0),
  chain_reserve0 NUMERIC(78,0),
  chain_reserve1 NUMERIC(78,0),
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(chain_id,pair_address,at_block),
  FOREIGN KEY(chain_id,pair_address) REFERENCES m06_pairs(chain_id,pair_address) ON DELETE CASCADE,
  FOREIGN KEY(chain_id,at_block) REFERENCES m06_blocks(chain_id,block_number) ON DELETE CASCADE
);

-- Compare cursor INSIDE the same transaction AFTER acquiring a chain-wide advisory lock.
-- A concurrent runner with an obsolete cursor triggers a database exception and rolls back.
CREATE OR REPLACE FUNCTION m06_assert_cursor(
  p_chain INTEGER,p_factory TEXT,p_block BIGINT,p_hash TEXT
) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE actual RECORD;
BEGIN
  SELECT block_number,block_hash INTO actual FROM m06_cursors
    WHERE chain_id=p_chain AND factory_address=p_factory;
  IF NOT FOUND THEN
    IF p_block IS NOT NULL OR p_hash IS NOT NULL THEN
      RAISE EXCEPTION 'M06 stale cursor: expected checkpoint missing';
    END IF;
  ELSIF p_block IS NULL OR actual.block_number <> p_block
      OR LOWER(actual.block_hash) <> LOWER(COALESCE(p_hash,'')) THEN
    RAISE EXCEPTION 'M06 stale cursor: another indexer already committed';
  END IF;
END;
$$;

COMMIT;
