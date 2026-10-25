# VERY Chain wrapped native token — provenance review (24 October 2026)

**Finding:** No canonical WVERY address independently verified. DO NOT add one to config/deployments.json.

VERY official network docs confirm mainnet chain ID 4613 and native coin VERY, but the developer guide does **not** attest a canonical WVERY deployment address:
- https://www.verylabs.io/whitepaper/en/developers/
- https://www.verylabs.io/whitepaper/en/verychain/

The VeryScan tokens directory lists a token named Wrapped VERY (WVERY) at:
0x9c928F9cD5F7AAa5d933B63d7E2f511223A9fC98
- https://www.veryscan.io/tokens
- https://www.veryscan.io/token/0x9c928F9cD5F7AAa5d933B63d7E2f511223A9fC98

**Conflicting evidence:** A publicly indexed explorer address view rendered the same address as an EOA, not a verified contract:
https://www.veryscan.io/address/0x9c928F9cD5F7AAa5d933B63d7E2f511223A9fC98
The explorer pages can be stale or inconsistently indexed; neither an explorer label nor an EOA label replaces a block-pinned RPC code check.

A token can have symbol WVERY without offering native wrapping/redemption. Token metadata, ERC-20 supply or holder count never prove that a contract is canonical, secure, collateralized or endorsed by chain operators. There is no chain-level guarantee of a unique wrapped native currency.

## Deterministic read-only inspection

Run in an operator environment with outbound access to the configured RPC:

```bash
SYMB_WVERY_CANDIDATE=0x9c928F9cD5F7AAa5d933B63d7E2f511223A9fC98 npm run inspect:wvery
```

The probe checks chain ID, existence of deployed bytecode at a single block, ERC-20 name, symbol, decimals, positive totalSupply and that native VERY balance covers reported supply. If any required evidence is missing or an RPC call fails, it reports failure. No wallet, seed phrase, signature, token allowance, gas or transaction submission is involved.

**Important:** Even if every probe passes, it returns `canonicalVerified=false`. Governance/issuer provenance, code review, native deposit/withdraw semantics and independent audit remain outstanding. Zero-supply wrappers require additional manual assessment; the current probe deliberately fails them.

## Requirements before configuration

1. A project-maintainer/VERY Foundation documented address announcement, ideally referenced from official domain and versioned release.
2. Matching deployed contract bytecode, verified source and ownership/upgradeability assessment.
3. Deposit/withdraw function compatibility with the frozen SymbRouter and local controlled tests against a fork.
4. Native reserve backing and external redemption behaviour under adverse recipients.
5. Review of administrative powers, emergency pause / mint privileges and legal/operational risk.
6. Independent security approval and archived evidence before adding to any production deployment manifest.

No unverified address must be included in trusted-token lists or release config.
