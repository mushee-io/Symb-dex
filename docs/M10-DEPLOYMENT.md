# Milestone 10.1–10.6 — Testnet deployment and operator guide

**Status:** Source foundations only until deployed to a persistent independent EVM test network. No public VERY testnet RPC/chain ID was verified. VERY Mainnet chain 4613 is NOT a testnet.

## Isolated testnet setup

1. Provision a persistent EVM chain with a **new distinct chain ID** and funded (valueless) native test gas. For development use local Anvil at `http://127.0.0.1:8545`, default chain 31337. This is **not** persistent public infrastructure.
2. `anvil --chain-id 31337 --host 127.0.0.1 --port 8545` in a separate terminal.
3. Use a **disposable development-only account**, never a mainnet key. Set `TESTNET_EXPECTED_CHAIN_ID=31337` and `TESTNET_DEPLOYER_PRIVATE_KEY` outside source.
4. `forge script script/TestnetDeploy.s.sol:TestnetDeploy --rpc-url http://127.0.0.1:8545 --broadcast` after tests pass. The script refuses chain IDs 1 and 4613 or a mismatched expected ID.
5. Review actual Foundry broadcast transaction receipts for Factory, Router, wrapped TEST native, faucet and six test tokens. Confirm code and `router.factory()`, `router.WETH()`, and mock token decimals at deployed addresses. Do not guess addresses.
6. Only then set `config/networks.testnet.json` and `config/deployments.testnet.json` to the verified separate chain metadata and actual addresses (see examples below); mark both configured. Rebuild the app to add the optional testnet wallet chain.
7. Test external wallet account switching, faucet and swap from a wallet funded with fake native gas; P0 UI should display unavailable until manifest is validated.

### Configuration example (NOT deployed addresses)

```json
{
  "status":"configured",
  "chainId":31337,
  "name":"Lidde Local Development Network",
  "rpcUrl":"http://127.0.0.1:8545",
  "explorerUrl":"http://127.0.0.1:8545",
  "nativeCurrency":{"name":"Test Gas Token","symbol":"tVERY","decimals":18},
  "isOfficialVeryTestnet":false,
  "officialVerificationReference":null,
  "realFundsAllowed":false
}
```

The second config must have the same chain ID, feeBps=30, a deployed Factory, Router, test wrapped-native and faucet, plus all six demo token entries. A raw RPC URL is not an explorer UI: for persistent public launch provision a genuine explorer and replace the placeholder. Only loopback HTTP is accepted; public RPC/explorer must be HTTPS.

### Faucet security model

The Solidity faucet has 24-hour cooldown, native payout capped to 1 fake unit per claim, per-wallet claim tracking, bounded ERC20 list and owner-only gasless **`claimFor(wallet)`**. A wallet already holding test gas can invoke `claim()` itself. **A wallet with zero gas cannot make an ordinary `claim()` transaction.** The operator may sponsor it using a backend, but that backend needs a real durable rate limiter, owner-only signing key, abuse controls, gas/reserve ceilings and a review before public availability. No signing key is committed and there is currently no public gas-sponsorship API.

### Test swap

The Router, Pair, tokens and initial pool are deployed on the sandbox chain. Approve demo token amount, simulate using correct router/chain, sign with the connected demo wallet, and confirm balances/reserves change. The source includes local tests that exercise the faucet → swap → LP add/remove path.

### Remaining for full public Milestone 10
- Long-lived hosted RPC, actual explorer frontend, hosted gas-sponsored rate-limited faucet with persistence, owner/operator seed funding.
- Separate mainnet-locked swap and liquidity UI contexts are being added on dedicated testnet routes.
- Repeat full external-wallet testing on persistent test network, secure signing environment, real test receipts, chain reset notices.

Mainnet `config/deployments.json` is intentionally untouched, at chain 4613 with every production address null.
