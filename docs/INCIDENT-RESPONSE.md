# Symb incident response — pre-launch draft

Raise an incident for unexpected reserve divergence, abnormal withdrawals, token/LP accounting errors, fake router address, suspicious wallet prompts, credential theft, mismatched indexed blocks or confirmed exploit reports.

1. Validate contract address, chain ID, latest block, transaction hashes and reporter evidence.
2. Disable site-controlled signing flows and publish a scoped advisory. THIS DOES NOT PAUSE IMMUTABLE CONTRACTS.
3. Escalate to security reviewers and independently authorized Mushee operators. Never request seed phrases.
4. Determine if a documented emergency on-chain control exists; Symb factory/pair currently have no pause or admin.
5. Preserve RPC logs, traces, database snapshots, deployed bytecode and source commit references.
6. Coordinate mitigation, auditor analysis, vulnerability disclosure and community updates.
7. Re-enable frontend flows only after documented root-cause resolution, retesting and independent approval.

Before any launch, nominate incident commander, backup, multisig signers, communications owner and recovery procedure. This draft does not appoint these roles.
