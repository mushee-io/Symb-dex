# Lidde — Security Policy

**Status: experimental source code, NOT audited, NOT deployed and NOT safe to use with real funds.**

## Private vulnerability reporting

Please use [GitHub private vulnerability reporting](https://github.com/mushee-io/lidde-dex/security/advisories/new) for suspected contract, frontend, wallet or indexing vulnerabilities. Do **not** publish exploit steps, private keys, wallet recovery phrases or affected user information in public issues.

If private reporting is unavailable, ask maintainers to enable it without sharing an exploit in the public issue.

## Supported deployments

There is **no supported production smart-contract deployment** at this stage. Only the default fail-closed configuration in `config/deployments.json` is authorized. No smart contract in this repository has been externally audited. The Solidity code under `contracts/src/` is a new MIT-licensed experimental reference implementation and is not an independently reviewed fork of a deployed protocol.

## Scope

Report security issues affecting Factory, Pair, Router, wrapped native token, ERC-20 / LP approvals, wallet transactions, reserve accounting, input/output or slippage protections, Neon indexer, database or deployment controls.

## Policy

- No authorization to exploit deployed third-party networks or user funds is granted.
- Avoid interacting with real user's funds or accessing data not owned by you.
- Confidentiality is requested until a fix and coordinated disclosure schedule are agreed.
- Maintainers should acknowledge credible reports and document severity, scope, affected versions, mitigation and follow-up regression tests.

## Production release criteria

No launch merely based on an MIT license, successful compilation, a green CI badge or an editable release flag. A third-party audit of the frozen deployable code, remediation/retest, verified addresses, governance review, fork tests, incident plan and explicit controlled beta authorization are required.

See `docs/MILESTONE-07.md` and `docs/SECURITY.md`.
