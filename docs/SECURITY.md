# Security policy and release gates

**Development software, not a live exchange.** Symb does not hold users' private keys. Never paste or commit a seed phrase, private key, RPC credential or production secret. `NEXT_PUBLIC_*` variables are public in the client bundle.

Milestone 1 intentionally supports only injected-wallet connection, chain switching and native balance reads. Trading buttons do not send transactions. User balances come from the connected wallet provider, never from a fabricated database.

Before any production deployment:
- Select reviewed and properly licensed AMM contracts.
- Test pricing invariants, liquidity accounting, unusual token behaviours and swap failures.
- Test reentrancy, fee-on-transfer tokens, token decimals, precision and malicious contracts.
- Independently audit contracts and deployment/configuration changes.
- Verify contracts on VeryScan and protect operator roles using multisig.
- Validate addresses and official status of wrapped VERY and other traded tokens.
- Seed only approved limited liquidity, then conduct small-value tests.
- Publish fees, risks and responsible disclosure contact information.

`lib/release-gate.mjs` only controls frontend feature presentation; it must **never** be treated as authorization or as a substitute for secure on-chain contracts. `config/deployments.json` starts with `releaseApproved: false` and `auditReviewed: false`.

Do not deploy contracts or provision liquidity automatically in CI. Mainnet writes require separately approved execution and signer handling.
