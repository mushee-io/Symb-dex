# Lidde — preliminary Slither finding triage (internal, NOT an external audit)

Scope: original MIT Solidity sources in contracts/src as of 24 October 2026. Source: GitHub Actions Solidity Security Slither job from merged M07 commit f6218ff. This is an internal review, not independent security attestation.

**Observed:** Slither analyzed 9 contracts with 102 detectors and reported 31 findings in one M07 run. The job used `fail-on: high` and exited successfully, but this must not be interpreted as a finding-free security review. Foundry fuzz/invariant tests passed but do not cover every external interaction.

| Finding pattern | Example | Initial reasoning and action | Status |
| --- | --- | --- | --- |
| reentrancy-no-eth | LiddeFactory.createPair calls known LiddePair.initialize before recording mapping | All of that initializer's code is controlled and has no external untrusted calls, but recording mapping first is clearer checks-effects-interactions ordering. | **Changed** in hardening branch; rerun static checks |
| reentrancy-no-eth / reentrancy-events | LiddePair.swap / burn transfer tokens and then sync/emit | Pair has an explicit lock around mint/burn/swap/sync, plus adversarial callback regression. Other read-only and cross-contract interactions still require external review. | **Mitigated by existing lock; open for external review** |
| low-level-calls | Router and Pair use raw ERC-20 transfer and transferFrom | Optional-return support is intentional; EOA token calls can incorrectly return success without token code. Require token.code.length > 0 before low-level ERC-20 sends. | **Changed** in hardening branch |
| incorrect-equality | Strict comparisons in token-return check and sqrt | Zero and exact boolean-return comparisons are intended. These are not treated as independent exploit findings without a proof. | **Preliminary false-positive classification; external review** |
| calls-loop | Router multihop swaps | getAmountsOut bounds paths to 2 or 3 hops; nested loops are bounded, but gas profiling and fork execution are still necessary. | **Open: gas profiling** |
| timestamp | Block timestamps used for LP accounting timestamps and tx deadlines | Deadline uses chain timestamp as a freshness bound, not trusted as an oracle. Window and L2/VERY consensus effects need documented limits. | **Open: chain-specific assessment** |
| token behaviour | Rebasing, fee-on-transfer, callback, counterfeit address | Unsupported arbitrary token behaviour can break LP economics and assumptions even when Solidity transfer returns success. Restrict production token registry to independently reviewed contracts. | **Release blocker** |
| npm dependency advisories | GitHub CI Slither action npm install reported 29 dependency advisories (14 high, 15 moderate) | Those advisories concern the JavaScript/npm dependency tree used in workflow installation, not proof of 14 critical Solidity flaws. Capture an application dependency audit with package-specific IDs and owners; remediate before public release. | **Untriaged release blocker** |
| canonical WVERY | Explorer token list shows candidate but official source is unconfirmed | Verify bytecode, backing, deposit/withdraw and operator provenance; never trust name or symbol alone. | **Release blocker** |

## Why a green Slither job is insufficient

The current threshold blocks findings detected as high by Slither. Medium/low/informational reports can still remain, false negatives exist, and economic vulnerabilities may be outside static-analysis scope. We must store findings and request independent severity review before deployment.

## Audit actions still required

- Re-run after every changed Solidity commit and track full SARIF artifact, not only the job success badge.
- Obtain full dependency advisory evidence (CVE/GHSA identifier, package, reachable runtime or dev-only, fix/version, mitigation, owner).
- Get an external audit of a frozen source commit with a detailed issue list and retesting report.
- Test native wrapped token and external token behaviour on a realistic fork; independently verify the chain's EVM implementation.
- Verify functional and economic invariants with adversarial recipients, very small reserves, large gas use, reserve donations, and mev scenarios.
- Never claim this document is an audit or a guarantee of funds safety.
