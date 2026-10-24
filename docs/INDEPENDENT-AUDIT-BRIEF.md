# External audit request — Lidde on VERY Mainnet (DRAFT)

## Requested engagement

Commission an **independent third-party smart contract audit** of the final frozen Lidde AMM and native-wrapping dependencies. The maintainer must authorize the auditor, commercial terms, budget and disclosure policy. Writing this brief or internally reviewing the code does **not** constitute an independent audit.

## Scope
- Immutable Factory and pair creation / CREATE2 provenance, token ordering and duplicate pool prevention.
- LiddePair constant-product invariant with 30 bps fee, reserves, minimum LP lock, price manipulation, donation/sync behaviour, mint/burn and reentrancy.
- LiddeRouter direct and two-hop swaps, approvals, deadline/slippage, recipient flows, wrapping/unwrapping and native refunds.
- LiddeERC20 LP allowances, transfers, approval front-running, initial LP to zero address.
- LiddeWrappedVery **local-only fixture**; verify and replace or explicitly authorize the separately documented canonical token contract.
- Frontend ABI and routing consistency, wallet signer integration and trusted-token list.
- Deployment artefacts and very-chain EVM idiosyncrasies.

## Evidence to provide
- Frozen SHA, source archive, MIT license and compiler settings in foundry.toml.
- Explicit 30 bps fee model, accepted token types, lack of admin/pause/upgradeability and economic assumptions.
- Foundry unit/fuzz/invariant/gas reports, Slither SARIF and human triage of every flagged category.
- Local bootstrap lifecycle test traces; controlled mainnet-fork scenario proof after an approved wrapper is known.
- Reproducible deployment manifest (codehash and bytecode) and read-only chain provenance evidence.

## Minimum deliverables
1. Signed report identifying firm/auditors, exact source commit and scope, methodology, dated severity-ranked findings and PoCs.
2. Remediation PR references with regression tests.
3. Auditor retest/delta review after fixes; tracked residual risks and operator/user mitigation.
4. Final public disclosure summary, plus an agreed private handling path for unresolved exploitable bugs.

## Independent acceptance criteria
No unresolved Critical or High findings. Medium findings require documented auditor-reviewed dispositions, mitigation and governance acceptance. Source compiled after remediation must exactly match audited deployable artifacts. Multisig/incident readiness, wrapped token provenance and integration tests remain independent release gates.

## Not included as established facts
No auditor is hired by this document, no audit date or quote has been obtained, and no production or test contract is claimed to exist on VERY.
