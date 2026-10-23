# VERY Chain integration and verification

Official documentation: https://verylabs.io/whitepaper/en/developers/

Mainnet configuration:
- Name: VERY Mainnet
- Decimal chain ID: 4613; hex: 0x1205
- RPC: https://rpc.verylabs.io
- Native asset: VERY, 18 decimals for wallet display
- Explorer: https://veryscan.io

Run `npm run check:rpc` from an internet-enabled environment. It sends only `eth_chainId` and `eth_blockNumber` JSON-RPC requests, verifies returned chain ID and does not transact. The CI app job intentionally avoids depending on live RPC uptime.

Public testnet information is not established in the current public developer guide; use local development and controlled mainnet testing only after security gates pass.

## Unverified deployment assumptions

- An ERC-20 labelled WVERY on VeryScan is **not automatically a canonical wrapper**. Verify source code, deposit/withdraw methods, operators and consistency before the app imports it.
- An in-app USDT balance in VeryChat is **not automatically** an on-chain ERC-20 on chain ID 4613.
- `config/deployments.json` contains null addresses by design.
- Never auto-approve user tokens or enable trading due only to a change in UI state.

## Verification checklist

1. `eth_chainId` returns `0x1205`.
2. `eth_blockNumber` returns a parseable hex number.
3. `eth_getCode` for a prospective token or router shows deployed bytecode.
4. Compare token symbol, decimals, code, ownership and verified source.
5. Review AMM contracts and deploy with a multisig operator.
6. Reconcile transactions on VeryScan before allowing public swaps.
