# Lidde Solidity — Original MIT reference implementation

All original Solidity source in contracts/src and tests in contracts/test carry SPDX-License-Identifier: MIT. A standard MIT LICENSE is located in the repository root.

These are experimental contracts written for Lidde. They are NOT externally audited, reviewed versions of Uniswap, nor authorized production deployments. No GPL-licensed implementation source is vendored here.

| Contract | Purpose |
| --- | --- |
| LiddeFactory.sol | Permissionless CREATE2 pair creation, no owner or admin |
| LiddePair.sol | Constant-product pools, 0.30% trading fee, LP shares, 1000 minimum locked LP |
| LiddeRouter.sol | Swap, add/remove liquidity; native VERY selectors share conventional ETH ABI names |
| LiddeWrappedVery.sol | Local wrapped-native token reference, NOT an official canonical WVERY |
| LiddeERC20.sol | ERC-20 underlying LP and wrapped token accounting |

Run from the repository root:

    forge build --sizes
    forge test -vv
    FOUNDRY_PROFILE=ci forge test -vv

Foundry settings: pinned Solidity compiler 0.8.26, Paris EVM target, optimizer 200, via IR, dependency-free solidity tests. The Solidity CI workflow also invokes Slither to block high-impact static-analysis findings.

Notes: no upgradeability, no feeTo protocol fee switch, no flash callbacks, no pause mechanism, no token-tax / rebasing support. The 30 bps fee remains inside pool reserves. Do not deploy or enable user funds without external audit, native-chain integration testing, confirmed canonical wrapped-VERY provenance, token allowlisting and authorized security release.
