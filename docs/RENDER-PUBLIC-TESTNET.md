# Symb independent public testnet — Render hosting handoff

**Status: hosting blueprint prepared, not deployed.** This is NOT a VERY-operated public testnet. VERY mainnet chain ID 4613, its native VERY token, https://rpc.verylabs.io and https://www.veryscan.io are exclusively MAINNET and must never be written into Symb testnet configuration.

## Selected isolated chain

- Proposed test chain ID: **31338** (already used by the repo's self-hosted Compose example; not globally reserved).
- Native valueless test gas symbol: **tVERY**.
- Network name: **Symb Isolated Development Network**.
- Public RPC: **unknown until the Render web service actually deploys** (the resulting `https://...onrender.com` URL).
- Public transaction viewer: the Symb frontend's **/testnet/explorer** once configured; this is a minimal transaction viewer, not a full block explorer.
- Smart contract addresses: **unknown until real broadcasts and confirmed chain receipts exist**.

## Deploy only after reviewing charges and security

1. Connect Render and your GitHub repo `mushee-io/Symb-dex`. Review any recurring costs **before** applying `render.yaml`. The private blockchain service needs a **paid** persistent disk; free/ephemeral hosting is not acceptable for stateful testing.
2. In Render, create a Blueprint from this repository's `render.yaml`. It defines a persistent **private** Anvil (port 8545, not public), and a separate **public** restricted Ethereum JSON-RPC gateway with Render-managed HTTPS. Keep the services in the same region. Do not deploy VERY mainnet.
3. Confirm the public HTTPS RPC URL and read-only chain ID `31338`. Run:
   `TESTNET_RPC_URL=https://<actual-render-host> TESTNET_EXPECTED_CHAIN_ID=31338 node scripts/check-public-rpc.mjs`.
4. Confirm persistence by restarting the private chain and showing the same genesis hash and latest committed transactions. Back up the persistent disk and document a reset policy.
5. Use a **disposable test-only signer** and a bounded fake-gas allocation. NEVER use any production seed phrase, real funds, or mainnet operator credentials. The example chain's default dev accounts are publicly known; treat them as untrusted. The minimal gateway is NOT hardened against sustained hostile traffic. Review rate limits, image pinning and safeguards before untrusted public beta.
6. Install Foundry in a trusted operator environment, fund your disposable signer **only with valueless devnet native gas**, and broadcast `script/TestnetDeploy.s.sol:TestnetDeploy` to the verified public isolated RPC using `TESTNET_EXPECTED_CHAIN_ID=31338`. Save the real `broadcast/TestnetDeploy.s.sol/31338/run-latest.json` and transaction receipts.
7. Set actual `TESTNET_RPC_URL`, `TESTNET_EXPLORER_URL` (your real published /testnet/explorer URL), and `TESTNET_EXPECTED_CHAIN_ID=31338`. Run `npm run testnet:verify`. Only after success, explicitly authorize `TESTNET_CONFIG_APPROVE=yes-local-test-only npm run testnet:configure`; carefully review generated `config/networks.testnet.json` and `config/deployments.testnet.json`.
8. Merge verified settings, deploy the existing Vercel frontend and confirm independent wallets can connect, claim fake assets, swap, create a pool, add LP and **fully withdraw liquidity**.
9. Set up the existing isolated Neon schema and continuous `npm run index:testnet` plus `npm run reconcile:testnet`; configure the separate sponsored faucet operator and its rate limits. Record real transaction hashes and repeat independent wallet tests. Validate network restarts, RPC quotas and monitor incidents.

### What this blueprint does NOT deliver by itself

No external cloud account was connected or charged; no paid Render services were created; no public RPC address exists until Render deploys; no smart contracts have been broadcast on a public blockchain; no mainnet funds are used. This blueprint is a **deployment prerequisite**, not evidence that the public testnet is live.
