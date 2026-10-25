# Symb persistent developer blockchain — self-host deployment recipe

> **Not deployed by GitHub commits.** The compose stack is intended for a separately funded test infrastructure host with a DNS name and Docker Compose. It is a Symb-operated independent EVM development network, NOT an official VERY testnet. All balances are fake. Never send real assets.

## What is included
- Persistent **Anvil** dev EVM, with its state saved to the Docker named volume `anvil-state` every 10 seconds; 2-second blocks.
- Non-public admin RPC inside Docker and a Node gateway that only permits read-only `eth_*` and `eth_sendRawTransaction`. It rejects privileged `anvil_*`, `hardhat_*`, personal/signing, impersonation and `eth_sendTransaction` RPC methods.
- Caddy front door with automatic public HTTPS (requires correctly configured domain, DNS and open ports).
- A bounded global request rate and request-size cap. In production, supplement with an upstream DDoS gateway and proper observability.

## Deployment on a designated host

1. Install Docker Compose, set a REAL DNS hostname to point at the host, ensure HTTPS certificates can be issued and public ingress reaches ports 80/443. Review hosting charges and operator budget.
2. Copy `.env.example` to `.env`. Replace placeholder `SYMB_RPC_DOMAIN` with actual owned DNS, choose unique chain ID **not 4613**, and limit CORS to frontend origin where compatible.
3. Run `docker compose up -d`; inspect `docker compose logs -f`, and check `https://$SYMB_RPC_DOMAIN` responds to `eth_chainId` and `eth_getBlockByNumber`.
4. Do not publish internal Docker Anvil port 8545. The gateway intentionally blocks administrative and key-holding methods.
5. Before contract deployment, have a disposable test-only key funded with fake gas from the internal Anvil (or use a dedicated ephemeral Anvil test account, **never a real-value key**). Run the guarded Foundry deployment script against HTTPS RPC.
6. Save actual Factory/Router/wrapper/faucet and pool receipts, verify all code on-chain and set an HTTPS explorer URL. The Symb website includes a minimal read-only tx viewer at `/testnet/explorer`, but it does not replace a full production block explorer.
7. Run `npm run testnet:verify` (with `TESTNET_EXPECTED_CHAIN_ID`, `TESTNET_RPC_URL`, `TESTNET_EXPLORER_URL`) and explicitly authorize `npm run testnet:configure`. See `docs/M10-DEPLOYMENT.md`.
8. Apply dedicated Neon migrations, enable the sponsored faucet only after single-signer nonce and rate-limit controls are tested, and schedule external wallet smoke tests.
9. Back up `anvil-state`; **verify restart and recovery**. Announce resets; contract addresses and user histories will be invalidated if the chain is wiped.

### Security and limitations
- Anvil is a **development EVM**, not a hardened public consensus blockchain. Common development private keys can be publicly known, so no sensitive roles/funds belong on this chain.
- The example gateway is deliberately minimal: it has an in-memory global throttle, no geographic mitigation and no high-availability consensus. Before inviting unrestricted public traffic, review with infra/security team or use a managed, authenticated test EVM provider.
- Pin/review image versions for a real deployment, monitor chain state, use trusted backups and rotate dedicated operator credentials.
- Mainnet release configuration remains locked and is not affected by the devnet stack.
