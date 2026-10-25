# Symb Dex rebrand: testnet-first

**Brand:** Symb Dex (formerly Lidde DEX). This GitHub repository is the maintained source of the Symb Dex application.

- Symb Dex is the UI and protocol identity for this exchange going forward.
- Solidity sources, class names, deployment artifact identifiers, testnet token symbol **tSYMB**, LP token label **SYMB-LP**, operator environment prefix `SYMB_`, documentation and application titles now use Symb.
- Underlying network **VERY Mainnet (4613)** and its locked release policy are unchanged. The isolated public demo EVM chain is still not configured or publicly live.
- **Data continuity:** Existing Neon faucet claim ledger persists under its historical physical `lidde_test_faucet_claims` table. `db/migrations/012_symb_faucet_compat.sql` adds a **non-destructive** public Symb-named view and wrapper function, preserving existing claims/cooldowns and keeping the new application SQL working. Do not reapply the historical initial migration to a live database or drop old tables.
- **Deployment compatibility:** The Solidity rename changes compiled artifact labels/codehashes and the deployment parser. New deployments must use a fresh, verified testnet manifest; never pretend historical Lidde contract hashes automatically match renamed Symb bytecode.
- **Repository URL:** The existing GitHub slug `mushee-io/lidde-dex` is retained for old links and GitHub/Vercel integrations. Rename the repository or production domain only as a coordinated hosting update, once redirects and deployments are ready.
- **Connected data projects:** Display names of Neon projects are now `symb-dex-testnet` and `symb-dex-quests`; this renames the projects without changing project IDs or connection strings.
- **External Vercel projects/domains:** Existing deployments must be reconnected/rebranded by a Vercel account with write permissions. Renaming source does not automatically rename Vercel project names or URLs.

No public mainnet, real-value exchange, or new blockchain deployment is implied by this rebrand.
