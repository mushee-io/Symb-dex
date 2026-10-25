# M10.1–10.6 — Real Testnet Network and Contract Provisioning

**Current status: source implemented and tested on disposable local Anvil, but NO persistent public EVM test network has been provisioned.** VERY Mainnet chain ID 4613 remains locked. Test tokens represent no cash value.

## To reproduce a local-only end-to-end deployment

1. Install Foundry, Node.js 22+, and project packages (`npm install`). Do not use a real-value wallet or mainnet key.
2. Start **separate temporary chain**: `anvil --chain-id 31337 --host 127.0.0.1 --port 8545`. This network disappears when Anvil terminates and is not suitable for external public testers.
3. In a separate shell, obtain a DISPOSABLE Anvil-only private key from its startup banner. Set `TESTNET_EXPECTED_CHAIN_ID=31337` and `TESTNET_DEPLOYER_PRIVATE_KEY=<disposable-key>` in your shell/secret manager.
4. Run: `forge build --sizes contracts/src` to verify the actual deployable contracts are under EIP-170, followed by `forge test --match-contract SymbTestnetTest -vv`. The deploy script is not an on-chain contract.
5. Run: `forge script script/TestnetDeploy.s.sol:TestnetDeploy --rpc-url http://127.0.0.1:8545 --broadcast -vv`.
6. Inspect the generated Foundry receipts in `broadcast/TestnetDeploy.s.sol/31337/run-latest.json`. Verify Factory, Router, wrapped local gas token, six synthetic ERC-20s, native/token and ERC-20/ERC-20 liquidity, and faucet are deployed. No mainnet chain can pass the deploy script checks.
7. Run `TESTNET_EXPECTED_CHAIN_ID=31337 npm run testnet:verify` to verify actual RPC chain, bytecode, token symbols/decimals, Factory/Router/wrapper addresses and both seeded pools without writing files.
8. To enable your frontend **locally**, set `TESTNET_EXPECTED_CHAIN_ID=31337 TESTNET_CONFIG_APPROVE=yes-local-test-only npm run testnet:configure`. This writes only separate testnet JSON registries. It does not change `config/deployments.json`.
9. Restart `npm run dev` and open `/testnet`. Connect a wallet, switch to local demo chain, sign a test trade, then inspect real testnet balances.
10. Use `claim()` from a funded test wallet, or the operator's `claimFor(wallet)` to provide test gas for a brand-new account. Optional gasless API sponsorship requires [this operator procedure](M10-FAUCET-OPERATOR.md).

If using a **persistent** public test EVM network later, replace localhost RPC/explorer with actual verified HTTPS endpoints, use a distinct chain ID, provision an independent explorer, secure test signer and durable faucet service, and publish reset/maintenance notices. Do not claim an isolated Symb devnet is officially provided by VERY without a verified operator statement.

## Security conditions

- Source MIT, tested in Foundry, not externally audited. Test only, no real assets.
- Network must not be VERY Mainnet (4613), Ethereum Mainnet (1) or a mismatched RPC.
- `SymbWrappedVery` is a **test wrapper**, not verified as official canonical WVERY.
- Server-signed faucet, if enabled, uses separate operator secrets and Neon claim limits.
- Frontend stays unavailable when configuration is incomplete. No fake exchange volumes or receipt links.
- Never commit `TESTNET_DEPLOYER_PRIVATE_KEY`, faucet sponsor keys or user seed phrases.
