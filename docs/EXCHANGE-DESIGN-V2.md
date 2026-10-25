# Symb Dex — homepage and exchange application V2

## Purpose

This update implements a two-mode visual experience directly in the existing Next.js repository.

- **Public site `/`:** warm ivory/forest-green editorial landing page with a continuously animated and draggable ten-card *curved* product carousel, handwritten annotations, oversized headline, and direct **Launch Symb Dex** action.
- **Exchange `/app/*`:** dark-slate/yellow original Symb application inspired by the supplied reference screenshots. Fixed 282px desktop sidebar, token search of reviewed assets, VERY chain selection, connected wallet control, trading workspace, order history and responsive mobile navigation.
- **Existing modules preserved:** blockchain quote/execution guards, liquidity reads/writes and independent /testnet routes. The new pages reuse these components instead of simulating financial execution.

## Routes

- `/app/swap`: existing VERY swap terminal presented inside dark exchange chrome, plus order-history empty state.
- `/app/limit`: editable amount, price, expiry and pair direction **preview**; execution disabled until a verified order contract is operational.
- `/app/pools`, `/app/pools/create`, `/app/pools/[address]`: reuses verified pool directory, liquidity form and pool details, all gated by the existing deployment registry.
- `/app/mining`, `/app/mining/create`: usable filter tabs and honest not-yet-deployed state; no claimable rewards, fictitious APR or live programme creation.
- `/app/launchpad`, `/app/launchpad/crowdpooling`, `/app/launchpad/create`: verified-programme empty states and explicit delegation to the separate demo token factory. Separate Lidde Fun launchpad remains independent.
- `/app/portfolio`: actual onchain VERY balances and imported ERC-20 watchlist, via the existing account components.
- `/app/orders`: explicitly unavailable canonical order history until indexed.
- `/app/settings`: actual VERY chain facts, testnet configuration state, existing wallet connector and navigation.
- `/testnet/*`: old real-local-test-only modules remain in place and inactive until network deployment.

## Truthfulness and security

- VERY Mainnet is chain ID **4613** with RPC `https://rpc.verylabs.io`. Its factory/router/token registry are **not deployed/approved** in this repository. No source or UI change overrides the existing release gate.
- The independent testnet remains marked `not-configured`; no explorer, address or faucet is invented.
- Homepage carousel panels are **illustrations**, not price screenshots, volume charts, APR data or live positions.
- No mainnet contract deployment, approvals, payment transactions, wallet auto-switches or seed handling are performed as part of these UI changes.
- Empty and unsupported features must become real only after suitable source, deployed contracts, event indexing, independent user receipts and security review.
- Design uses original Symb icons, shapes and presentation. Do not use DODO graphics or brands in the application.

## Verification

- `npm test`: Node source, network, Solidity-guard and UI routing checks.
- `npm run typecheck`: TypeScript compilation.
- `npm run build`: Next.js production build for Vercel.
- Manual acceptance: visit `/` at desktop and mobile widths; verify curved carousel drag and reduced-motion; launch `/app/swap`; verify each sidebar link, empty states, wallet dialog and network selection; confirm unsupported actions remain disabled; run regression against `/testnet` and old protected mainnet pages.

## Outstanding before real public launch

Persistent independent devnet with HTTPS RPC, real testnet contract receipts, configured testnet manifest and explorer, operator-funded fake gas faucet, continuous indexer, external-wallet swap/pool creation/full LP withdrawal receipts, security and restart/backup checks. VERY mainnet trading also requires independently verified and audited deployments plus explicit release authorization.
