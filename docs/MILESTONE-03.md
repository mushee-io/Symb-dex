# Milestone 3 — Wallets, token imports, balances and approvals

## Overview

This milestone is intentionally independent of Milestone 2. It adds live **read-only** account and ERC-20 operations on VERY Mainnet; the transaction-writing approval flow is implemented but strictly disabled by the deployment gate until a verified factory/router/wrapped VERY, review and release signoff exist. Trading remains disabled.

### 1. Wallet connections

- Wagmi + Viem with injected multi-wallet discovery (EIP-6963).
- Supports different installed injected providers, wallet connection/disconnection and account/network change tracking.
- WalletConnect v2 only when `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is supplied at build time. Obtain the project ID from Reown Cloud; don't commit it in code.
- Shows native VERY using `eth_getBalance` via `useBalance`.
- Wrong-chain state prompts user to switch to 4613; reads do not display the balance from another chain.

### 2. Token registry

- `config/verified-tokens.json`: curated, independently reviewed addresses only; currently empty.
- Explore import performs checksum/address validation, deployed contract bytecode check and ERC-20 `name`, `symbol`, `decimals` calls.
- Names and symbols are length checked; decimals limited to 0–36 for display.
- Imports are **never verified**, even if localStorage is tampered with.
- Browser watchlist is bounded to 30 assets, deduplicated case-insensitively, and is local to the browser.
- No external logo loading, server custody, secret collection or assumed USD prices.
- A token with valid metadata may still be malicious, nontransferable, illiquid, maliciously upgradeable or have misleading metadata. Imports require explicit risk acknowledgement.

### 3. Balances and portfolio

- ERC-20 `balanceOf(wallet)` via RPC on chain 4613, with loading and error states.
- Native VERY balance also read from chain; no synthetic holdings or fabricated USD price.
- Token list and approval rows refresh across tabs where storage events fire.
- View direct token contract links on VeryScan.

### 4. Allowances and signing policy

- `lib/approval-policy.mjs` must approve a deployment's factory, router and wrapped VERY addresses plus auditReviewed/releaseApproved flags on chain 4613, and a real wallet/token address.
- The approvals screen can read allowances and request only an **exact user-supplied amount**, not infinite approval, if the release gate ever opens.
- Existing nonzero allowances must be revoked before a new positive approval request; exact allowance state is fetched on-chain.
- Receipt is monitored, and only the wallet can authorize the transaction.
- `config/deployments.json` is intentionally still fail-closed with null router, so approvals are blocked in this milestone.
- Lidde cannot arbitrarily revoke approvals to unrelated third-party spenders with this screen. Users should use an established revoke tool for that purpose.
- The UI gate alone is **not** a replacement for contract audits, verified source, independently checked addresses, or permission management.

### 5. Human smoke-test checklist (required before claiming end-to-end readiness)

1. Install MetaMask and optionally a second EIP-6963-compatible extension.
2. Connect each provider, check account switch, disconnect and reconnect.
3. Connect on wrong network and click Switch to VERY.
4. Confirm native VERY balance against VeryScan.
5. Import a real ERC-20 VERY contract address; verify symbol, name and decimals against explorer.
6. Check token `balanceOf` in Portfolio and Explore and compare against explorer for same account.
7. Reload the tab and verify local import persists, then remove the token.
8. Tamper with local storage by inserting `verified:true`; UI must still show unverified.
9. Check that no enabled trade or approve button exists with the present deployment config.
10. Set a WalletConnect Project ID in a staging environment and test QR linking on mobile.

### 6. Automated validation

`npm test`, `npm run typecheck`, `npm run build`; GitHub Actions runs these on each PR. `npm run check:rpc` verifies live chain ID and block height when the RPC is available.

## Limitations

No deployed AMM, canonical WVERY, audited router or certified tokens exist in this repository yet. Token import is discovery and balance monitoring, not proof of token safety. WalletConnect requires a project ID, and availability depends on device/wallet support. Full mobile and real-token smoke tests still require a real wallet, network and token.
