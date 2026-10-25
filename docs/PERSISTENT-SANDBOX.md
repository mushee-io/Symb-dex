# Persistent valueless Lidde sandbox deployment

**Source is ready. This repository has NOT deployed a persistent public RPC, chain, explorer or the contracts.** No external VM, domain or credentials have been supplied to the deployment.

## What the new infrastructure contains

The file infra/docker-compose.sandbox.yml defines a single-host Anvil development chain whose state is periodically persisted to a Docker volume, a restricted public RPC gateway, TLS ingress via Caddy, and an optional continuously polling canonical indexer. The Anvil node is never bound to a host port. Only TLS ingress on TCP 80/443 is public.

This is a centralized, single-operator, valueless EVM *developer test chain*, not decentralized validator consensus or the official VERY testnet. Never use real-value tokens or wallet keys. Persistent state still requires independent host-disk backups.

## Required operator resources

Provide a Linux Docker host that stays online, a public DNS hostname under your control, inbound ports 80/443, protected test-only deployer and attestor keys, and deploy authorization for the actual website (Vercel or another trusted host). Existing Neon database lidde-testnet already contains the indexer schema but is not connected to a live worker.

## Procedure

1. Clone mushee-io/lidde-dex onto the VM, review the exact commit, install Docker Engine and Docker Compose v2.
2. Copy infra/sandbox.env.example to a private infra/.env. Replace its example SANDBOX_CHAIN_ID, RPC_HOSTNAME and RPC_ALLOWED_ORIGINS with actual values. Never commit infra/.env.
3. Validate with: docker compose --env-file infra/.env -f infra/docker-compose.sandbox.yml config --quiet
4. Start: docker compose --env-file infra/.env -f infra/docker-compose.sandbox.yml up --build -d anvil gateway caddy
5. Confirm that the DNS and TLS certificate are genuine; then use curl against HTTPS public RPC with JSON-RPC eth_chainId. External Anvil cheat endpoints, eth_sendTransaction and admin/debug requests must be rejected by the gateway. Do NOT publish raw port 8545.
6. Fund a newly generated **valueless test-only deployer address** using an isolated initial development allocation on the VM; for example send test gas from an account seeded on the local node, never a valuable wallet. Protect keys and audit the deployer balance.
7. Deploy DEX with existing Foundry script TestnetDeploy.s.sol:TestnetDeploy, after verifying TESTNET_EXPECTED_CHAIN_ID and TESTNET_DEPLOYER_PRIVATE_KEY. Save independent creation transaction receipts and actual contract codehashes.
8. Set TESTNET_RPC_URL and the actual HTTPS explorer URL. Run npm run testnet:verify and the existing scripts/configure-testnet.mjs --verify-only, then use its explicit writing approval. The RPC gateway is **not** a blockchain explorer; the built-in DEX explorer must separately be deployed as a working HTTPS site.
9. Set the dedicated Neon TESTNET_DATABASE_URL and Factory deployment starting block in private infra/.env. Start the optional indexer: docker compose --env-file infra/.env -f infra/docker-compose.sandbox.yml --profile indexer up --build -d indexer. Monitor worker logs, cursor block and reserve reconciliation. The indexer needs a real configured chain manifest, and will correctly refuse to start before one exists.
10. Deploy the QuestEscrow contract on the **same** sandbox via the Lidde Fun Foundry source, record address and runtime keccak256 hash and provision a dedicated protected test-only EIP-712 attestor.
11. Publish the DEX Next.js explorer and API with configured network and database connection. Require that /api/testnet/markets has status indexed and canonicalBlockHash matches the RPC.
12. Run node scripts/export-fun-manifest.mjs with genuine QuestEscrow address and indexer API URL. It outputs only verified non-secret fields for Lidde Fun, with writes still disabled. Add the separate Neon QUEST_DATABASE_URL, QUEST_PUBLIC_ORIGIN and attestor secret in the frontend's protected server settings.
13. Publish Lidde Fun via an authorized deployment account. Independently run at least two external wallets through faucet, token creation, swaps, LP mint/full exit, quest creation/funding/claim and XP import. Capture transaction hashes and audit any failures before changing the default emergency-stop flags.

## Known blockers as of 25 October 2026

- No VM has been provisioned or started.
- No actual RPC/DNS/explorer origin is available. Example hostname values are placeholders.
- The DEX network and deployed-contract manifests remain marked not-configured until verifiable receipts exist.
- No public testnet indexer is running.
- Vercel project creation for Lidde Fun returns HTTP 403 for the connected team, requiring project-creation rights. This repository cannot bypass that authorization.
- No independent public-wallet acceptance receipts or external contract audit exist.

The node is intended for **valueless testing only** and its centralization, failure/reorg semantics and public RPC safety must be independently assessed before inviting real outside users.
