# M11 P0 — Operator deployment and external-wallet release

**Current date: 24 October 2026. STATUS: SOURCE READY FOR OPERATOR TESTING, NOT PUBLICLY LIVE.** Test assets have zero real value. VERY chain ID 4613 is mainnet and must NEVER be used for this test environment.

## Deployed resources
- A separate Neon project named **symb-testnet** (EU-West/London) exists. Its schema includes testnet faucet claims, canonical blocks, factory-created pairs, events, swaps, Mint/Burn actions, Sync reserves, LP transfers, checkpoints and reconciliations.
- No database passwords or signer keys are in GitHub.
- CI runs the full demo chain locally on disposable Anvil; successful CI receipts are NOT persistent/public-chain receipts.

## Hosted blockchain and RPC — not provisioned
1. Obtain an operator-funded VPS or an existing independently controlled host, DNS and SSL. Review costs and secure access.
2. Deploy infra/devnet/docker-compose.yml with a unique non-4613 chain ID. Keep Anvil's unrestricted/admin RPC internal only, exposing only the restricted gateway over HTTPS. Review image versions and rate limiting.
3. Record real genesis hash, RPC chain ID and confirmed blocks. Test persistence through node restart; back up the Docker state volume. Publish a transparent reset policy.
4. Use a disposable test-only signer funded with valueless gas to broadcast script/TestnetDeploy.s.sol. Obtain real Factory/Router/wrapper/faucet/token and pair receipts.
5. Run npm run testnet:verify against the actual verified RPC, then npm run testnet:configure with explicit approval. This generates separate testnet registries without altering locked mainnet config.
6. Deploy Symb's frontend with these real testnet contract addresses; use the built-in minimal read-only transaction viewer at /testnet/explorer. A complete indexed public explorer is still further infrastructure work.

## Neon indexer
1. Use the separately provisioned symb-testnet project credentials only in server-side secrets named TESTNET_DATABASE_URL. Never expose them in NEXT_PUBLIC variables.
2. The testnet schema is in db/migrations/011_testnet_indexer.sql and faucet claims schema in db/migrations/010_testnet_faucet.sql. Both are already installed in the dedicated project.
3. Set TESTNET_INDEXER_START_BLOCK from the actual Factory deployment receipt (not guessed). Run npm run index:testnet continuously through a single serialized scheduler.
4. Run npm run reconcile:testnet against the same RPC/Neon project and compare actual pair getReserves to indexed confirmed Sync state.
5. Monitor checkpoint lags and reorg results; keep mainnet indexes/database separated.

## Free gasless faucet
1. Provision TESTNET_FAUCET_DATABASE_URL and dedicated TESTNET_FAUCET_OPERATOR_PRIVATE_KEY in secure server settings. Never use mainnet signers.
2. Confirm contract faucet owner, funded fake native gas reserve, synthetic ERC20 reserves, trusted proxy IP headers and persistent rate limits.
3. Serialize operator nonces, reconcile unknown broadcast outcomes and test race conditions before enabling TESTNET_FAUCET_SPONSOR_ENABLED.
4. A new zero-balance wallet must receive gas and test ERC20s via wallet-signed sponsored claim. No real VERY or seed phrase should ever be needed.

## Dev-only transaction rehearsal

Commands on an isolated Anvil chain (not mainnet):
- anvil --chain-id 31337 --host 127.0.0.1 --port 8545
- Set TESTNET_EXPECTED_CHAIN_ID=31337 and TESTNET_DEPLOYER_PRIVATE_KEY to a disposable, LOCAL-ANVIL-ONLY key.
- forge script script/TestnetDeploy.s.sol:TestnetDeploy --rpc-url http://127.0.0.1:8545 --broadcast
- npm run testnet:verify
- npm run smoke:testnet

The smoke script sponsors a new wallet, executes token/token and native/token swaps, creates a distinct ERC20 pool and withdraws all redeemable LP. GitHub CI proves this locally.

## Required external acceptance before announcing public testnet
- Independent wallets connect to the genuine hosted separate EVM chain over HTTPS.
- A wallet with zero gas receives free assets from the public sponsored faucet.
- External tester conducts swaps, creates a pool, deposits LP and withdraws fully with publicly viewable actual transaction receipts.
- Indexed history is complete/reorg-safe, pool reserves reconcile and no key/credential leakage occurs.
- Restart recovery and RPC rate limiting are observed in real deployed infrastructure.

**No public launch is implied by passing local Foundry/Anvil tests or creating the Neon project.**
