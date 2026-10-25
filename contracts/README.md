# Symb Solidity — Original MIT reference implementation

All original Solidity source in contracts/src and tests in contracts/test carry SPDX-License-Identifier: MIT. A standard MIT LICENSE is located in the repository root.

These are experimental contracts written for Symb. They are NOT externally audited, reviewed versions of Uniswap, nor authorized production deployments. No GPL-licensed implementation source is vendored here.

| Contract | Purpose |
| --- | --- |
| SymbFactory.sol | Permissionless CREATE2 pair creation, no owner or admin |
| SymbPair.sol | Constant-product pools, 0.30% trading fee, LP shares, 1000 minimum locked LP |
| SymbRouter.sol | Swap, add/remove liquidity; native VERY selectors share conventional ETH ABI names |
| SymbWrappedVery.sol | Local wrapped-native token reference, NOT an official canonical WVERY |
| SymbERC20.sol | ERC-20 underlying LP and wrapped token accounting |

Run from the repository root:

    forge build --sizes
    forge test -vv
    FOUNDRY_PROFILE=ci forge test -vv

Foundry settings: pinned Solidity compiler 0.8.26, Paris EVM target, optimizer 200, via IR, dependency-free solidity tests. The Solidity CI workflow also invokes Slither to block high-impact static-analysis findings.

Notes: no upgradeability, no feeTo protocol fee switch, no flash callbacks, no pause mechanism, no token-tax / rebasing support. The 30 bps fee remains inside pool reserves. Do not deploy or enable user funds without external audit, native-chain integration testing, confirmed canonical wrapped-VERY provenance, token allowlisting and authorized security release.

## M10 Foundry deployment-script size warning

`script/TestnetDeploy.s.sol` embeds creation bytecode for multiple separate test contracts, so its *script runtime* exceeds the usual deployed-contract EIP-170 size. The script itself is run by Foundry's deployment engine and is **never deployed as a live contract**. The actual Factory, Pair, Router, token, wrapper and faucet deployed runtimes are all comfortably below the 24,576-byte EIP-170 limit. Therefore CI checks **real contract size** with `forge build --sizes contracts/src` and separately compiles, broadcasts and exercises the script against local Anvil. Do not treat the deployment script as a production contract or suppress runtime code size limits for deployed contracts.
