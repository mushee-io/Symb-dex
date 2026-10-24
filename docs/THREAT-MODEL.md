# Lidde protocol threat model — M07 preliminary, not an external audit

## Assets / invariants
- Pair reserves must match ERC-20 balance after each successful mint/burn/swap/sync.
- Fee-adjusted constant-product invariant must hold on swaps with standard ERC-20 assets.
- LP total supply equals the sum of minted less burned positions; initial 1,000 LP is permanently locked at address(0).
- Wallet funds move only through explicitly authorized, correctly scoped ERC-20 allowances and wallet signatures.
- Factory creates at most one pair per unordered token combination.
- Router has no privileged withdrawal method; caller supplies explicit recipient, deadline and min outputs.
- Indexer is untrusted for spendable balances; database histories remain consistent with canonical chain.

## Attack surfaces
1. **Malicious token:** return false, return no data, reenter during a transfer, rebasing, fee-on-transfer, arbitrary mint/burn, blacklist, proxy upgrade, inflated token metadata. M07 scope: reject/guard known unsupported behaviours, whitelist assets for the frontend. Not a universal token safety proof.
2. **Pair reserve theft:** zero-input swaps, malicious callbacks, arithmetic overflows, callback reentrancy, donations/sync manipulations, rounding, first-LP dust, fake pair registration, flash-loan manipulation.
3. **Router:** unauthorized spender, wrong WVERY, mismatched factory, wrong path, recipient spoof, deadline expiry, minimum output bypass, gas estimate / pending timeout, native refund side effects.
4. **Wallet/frontend:** chain switching, injected provider spoofing, extension compromise, malicious imported contract metadata, phishing signature content, infinite approvals, stale quotes and MEV sandwiches.
5. **Factory/governance:** permissionless pool creation, no admin upgradeability in this experimental factory; deployment selection and frontend allowlist become critical trusted controls. Non-upgradeable pair cannot be unilaterally paused.
6. **Indexer/database:** competing writers, stale cursors, forked blocks, malformed logs, RPC equivocation, checkpoint replay, historical volume double counting, database credentials.
7. **Supply chain:** npm vulnerabilities, compromised build action, Solidity compiler compatibility, deploy key leakage, license provenance.

## Trust boundaries
- Smart-contract balances, reserves and receipts are authoritative.
- Browser, RPC, price feeds, backend indexer and analytics APIs are individually untrusted.
- M07 uses a fixed 0.30% LP fee with no privileged feeTo; frontend `feeBps` may only be set to 30 after audit and on-chain contract identity verification.
- The demo L-WVERY is NOT the chain's verified canonical WVERY. No assumption that its address is known or should be deployed to mainnet.
- A compiled source version != an audited, deployed, operating protocol.

## Explicit exclusions / open findings
- No full support for fee-on-transfer, rebasing, deflationary or callback tokens.
- No TWAP oracle or external price protection. MEV/sandwich attack risk persists beyond slippage constraints.
- No smart-contract pause method, no admin multisig on immutable pair/factory: emergency action is UI disablement and community warning, NOT freezing immutable pool funds.
- No flash swaps or feeTo protocol revenue.
- Pair mint/burn use token.balanceOf and thus assume ERC-20 conventions; users should not interact with unreviewed tokens or contracts.
- Gas use and CREATE2 pair bytecode should be measured under the exact VERY EVM version.
- Before any deployment: externally audit entire source, review bytecode, run fuzz/invariants and fault injection with adversarial tokens.
