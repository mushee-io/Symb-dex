-- Symb M10 testnet faucet: permanent, server-only claims. Apply ONLY to a
-- separate testnet Neon DB, not real-value production funds.
CREATE TABLE IF NOT EXISTS symb_test_faucet_claims (
  chain_id bigint NOT NULL CHECK (chain_id > 1000 AND chain_id <> 4613),
  wallet text NOT NULL CHECK (wallet ~* '^0x[0-9a-f]{40}$'),
  day_utc bigint NOT NULL,
  ip_hash text NOT NULL,
  request_id text NOT NULL,
  status text NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved','submitted','confirmed','needs_reconciliation')),
  tx_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(chain_id,wallet,day_utc),
  UNIQUE(chain_id,request_id)
);
CREATE INDEX IF NOT EXISTS idx_test_faucet_ip ON symb_test_faucet_claims(chain_id,day_utc,ip_hash);
CREATE INDEX IF NOT EXISTS idx_test_faucet_status ON symb_test_faucet_claims(status,created_at);

-- A PostgreSQL transaction advisory lock makes concurrent reservations from
-- the same or different IP serialize within a UTC day; no race can bypass
-- the per-IP or total daily limits.
CREATE OR REPLACE FUNCTION symb_reserve_faucet_claim(
 p_chain_id bigint,p_wallet text,p_day bigint,p_ip_hash text,p_request_id text
) RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
 IF p_chain_id<=1000 OR p_chain_id=4613
    OR p_wallet !~* '^0x[0-9a-f]{40}$'
    OR length(p_ip_hash)!=64 OR length(p_request_id)!=64 THEN
  RAISE EXCEPTION 'INVALID_FAUCET_RESERVATION';
 END IF;
 PERFORM pg_advisory_xact_lock(10010,hashtext(p_chain_id::text||'|'||p_day::text));
 IF (SELECT count(*) FROM symb_test_faucet_claims
     WHERE chain_id=p_chain_id AND day_utc=p_day)>=250 THEN RETURN FALSE; END IF;
 IF (SELECT count(*) FROM symb_test_faucet_claims
     WHERE chain_id=p_chain_id AND day_utc=p_day AND ip_hash=p_ip_hash)>=3 THEN RETURN FALSE; END IF;
 INSERT INTO symb_test_faucet_claims(chain_id,wallet,day_utc,ip_hash,request_id)
 VALUES (p_chain_id,lower(p_wallet),p_day,p_ip_hash,p_request_id)
 ON CONFLICT DO NOTHING;
 RETURN FOUND;
END
$$;
