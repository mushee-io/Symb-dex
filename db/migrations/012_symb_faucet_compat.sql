-- Symb Dex compatibility layer: preserves all previous test-faucet claim records.
-- Historical internal ledger stays under its original physical table/function name.
-- Do not drop, truncate, or rename historical state during visual product rebrands.
CREATE OR REPLACE VIEW symb_test_faucet_claims AS
 SELECT chain_id,wallet,day_utc,ip_hash,request_id,status,tx_hash,created_at,updated_at
 FROM lidde_test_faucet_claims;
CREATE OR REPLACE FUNCTION symb_reserve_faucet_claim(
 p_chain_id bigint,p_wallet text,p_day bigint,p_ip_hash text,p_request_id text
) RETURNS boolean LANGUAGE SQL AS $$
 SELECT lidde_reserve_faucet_claim(p_chain_id,p_wallet,p_day,p_ip_hash,p_request_id);
$$;
