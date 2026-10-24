# Testnet faucet server — security and operational prerequisites

The faucet is valueless-test-asset only. A first wallet with zero gas cannot call Solidity `claim()` by itself. The optional server endpoint `POST /api/testnet/faucet` sponsors `claimFor(address)` using an **operator-only testnet key** and never accepts user private keys.

It is **disabled by default**. Before enabling on a protected testnet environment:

1. Provision an **entirely separate Neon test database** and apply `db/migrations/010_testnet_faucet.sql` with an operator migration role. Do not apply it to a real-funds ledger.
2. Verify contract owner and all deployed code/chain IDs. Configure `config/networks.testnet.json` and `config/deployments.testnet.json` with exact on-chain contract metadata.
3. Fund the on-chain faucet with test gas and synthetic ERC20 inventory; fund its signer with native test gas to sponsor claims.
4. Set **server-only**, secret-managed `TESTNET_FAUCET_DATABASE_URL`, `TESTNET_FAUCET_OPERATOR_PRIVATE_KEY` (never reuse a real-value signing key) and `TESTNET_FAUCET_IP_PEPPER` (random, >=32 characters).
5. Deploy behind a trusted Vercel network proxy that sets `x-vercel-forwarded-for` itself. Requests without that header are rejected rather than accepting client-supplied IP addresses. Confirm provider behaviour before enabling.
6. Set `TESTNET_FAUCET_SPONSOR_ENABLED=true` only after operator authorizes a test-gas budget, checks abuse controls and verifies the chain.
7. Browser signs fixed `Lidde testnet faucet claim` message bound to chain, wallet and current UTC day. No user gas for this signature. Backend recovers/verifies signer before reserving a claim.
8. Database function serializes claim reservations per chain/day and caps 3 per trusted IP and 250 overall daily, plus unique wallet per UTC day. Contract separately enforces 24-hour wallet cooldown.
9. If tx broadcast outcome is uncertain, a claim stays **reserved** for human reconciliation. Never automatically delete claim rows and re-send, which risks duplicate payouts.
10. Monitor owner balance, on-chain faucet balances, total pending reservations, RPC latency, nonce concurrency, malicious wallets and trusted-proxy reliability. A production-scale operator should serialize nonce submission through a real queue/nonce manager; disable sponsorship if multiple server instances can submit concurrently from one key.

**Limitations:** Wallet/IP caps do not fully prevent Sybil attacks. Network headers must be verified as truly inserted by the hosting provider. Multiple concurrent server instances using one signer can collide on nonces; start with a single instance/queue. A successful server response returns a tx hash, not a final confirmation. All tokens have zero monetary value.

Do not describe sponsored gas faucet as operational until these requirements are deployed, independently tested, and configured in the environment.
