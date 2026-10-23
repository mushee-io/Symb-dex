# Milestone 4 — Real reserve quotes and guarded swap integration

## Scope

This is a functional foundation for real swaps once M02 contracts are deployed and independently verified. No swap transactions have occurred and the swap button remains disabled while `config/deployments.json` has null addresses, null fee and release flags false. **Do not market Lidde as a working live DEX yet.**

### M04.1 — Chain and contract discovery
- V2-style `getPair(tokenIn, tokenOut)` from configured factory.
- Contract code checks on the factory and every candidate liquidity pair.
- Reads `token0`, `token1`, `getReserves` and verifies the expected pair address's token identities.
- Accepts only RPC chain ID 4613. Pair addresses and quotes are not from a local simulation.
- Only verified token registry entries can receive executable quotes.

### M04.2 — Router math and routing
- Reads direct routes and up to one wrapped VERY intermediate hop.
- Configured fee in basis points **must match the audited AMM implementation**; config defaults to null.
- Uses bigint integer operations and floor rounding matching a constant-product V2 AMM.
- Compares executable output amount per candidate route and chooses the maximum estimated output (gas-inclusive route selection is not yet implemented).
- Does not quote if pool reserves are zero or the route is missing.
- Price impact is approximate and includes swap fees; fee-free spot comparison is a user-facing warning only.

### M04.3 — User protection
- 0.01% to 5% slippage bounds; presets 0.1%, 0.5%, 1%.
- Minimum received is integer-floor output after slippage; zero-dust rejects.
- Transaction deadline between 1 and 60 minutes.
- Verifies the current connected wallet, deployed chain, reviewed token, factory/router/WVERY, and all release flags.
- Requotes at execution time and refuses changed path, pair set, or output below the original minimum.
- No token import, UI state change or local storage edit can enable trading without release configuration.

### M04.4 — Swap execution sequence (currently locked)

1. Validate user request, reviewed token, chain and quote.
2. Check router and WVERY deployed code on VERY.
3. Recalculate best route from fresh reserves.
4. Check ERC-20 balance and router allowance for token sales; show explicit approval instructions if insufficient.
5. Construct V2-style `swapExactETHForTokens` or `swapExactTokensForETH` call (the ABI must be confirmed against the final router); supply `amountOutMin`, recipient, path and deadline.
6. Simulate the call (any error is a blocker).
7. Estimate on-chain gas, buffer 20% and ensure user's native VERY covers gas plus native input.
8. Submit from the user-controlled wallet; observe transaction hash.
9. Wait for receipt; only a successful receipt means completed. If waiting times out, use VeryScan and treat status as unknown until verified.

**No automatic unlimited approvals.** Use the guarded Approvals screen from M03 after reviewer authorization and router deployment.

### Limitations and next prerequisites

- **M02 needed:** reviewed factory/pair/router/WVERY contracts; verify actual router ABI and fee algorithm.
- Token standard variations (fee-on-transfer, rebasing, malicious callbacks, blocklists) are not supported without explicit reviews.
- Reserve reads are not snapshot-atomic across multihop pools: price drift is mitigated by re-quoting and minimum-output enforcement. Batching/multicall is a future improvement.
- Quotes do **not** optimize net-of-gas value between routes yet. Gas is estimated as part of the mandatory preflight but not displayed before a user starts the execution process.
- Post-receipt balance reconciliation is via react-query invalidation; a dedicated event indexer and transfer-level receipt reconciliation are later milestones.
- A successful unit test and build do not replace deployed-contract tests or audits.
- UI-only restrictions do not protect against a malicious or compromised contract. Release keys and deployment configuration must be reviewed independently.

## Automated acceptance
Run `npm test`, `npm run typecheck`, and `npm run build`. GitHub Actions runs these on each push/PR.

## Human acceptance (must complete before live release)
- Deploy and verify M02 contracts in a controlled environment.
- Confirm official wrapped VERY address and verified token contracts.
- Verify fee basis points and every router function signature.
- Seed a minimal liquidity pool, check direct and token0/token1 reversed quotes.
- Compare client output to actual router results; test token decimals.
- Confirm fresh requote refuses stale price, incorrect route, deadline expiry and excessive impact.
- Verify approval and gas failure UX.
- Execute tiny real transactions on VERY Mainnet only after signoff; compare event logs, asset balances and transaction receipts to VeryScan.
- Repeat in mobile injected and WalletConnect wallets.
