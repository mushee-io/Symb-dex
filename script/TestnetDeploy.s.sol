// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {SymbFactory} from "contracts/src/SymbFactory.sol";
import {SymbRouter} from "contracts/src/SymbRouter.sol";
import {SymbWrappedVery} from "contracts/src/SymbWrappedVery.sol";
import {SymbTestToken} from "contracts/src/testnet/SymbTestToken.sol";
import {SymbTestFaucet} from "contracts/src/testnet/SymbTestFaucet.sol";
import {SymbDemoTokenFactory} from "contracts/src/testnet/SymbDemoTokenFactory.sol";
import {SymbDemoLimitBook} from "contracts/src/testnet/SymbDemoLimitBook.sol";

interface VmDeploy {
    function envUint(string calldata name) external returns(uint256);
    function addr(uint256 privateKey) external returns(address);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
}

/// @notice Only for a separate, funded-with-TEST-GAS EVM network (e.g. local Anvil).
/// @dev Source code cannot deploy to VERY Mainnet (chain ID 4613) or Ethereum mainnet (1).
///      Requires explicit TESTNET_EXPECTED_CHAIN_ID and TESTNET_DEPLOYER_PRIVATE_KEY.
contract TestnetDeploy {
    VmDeploy constant vm = VmDeploy(address(uint160(uint256(keccak256("hevm cheat code")))));
    event TestnetDeployed(
        uint256 indexed chainId,address factory,address router,address wrapped,
        address faucet,address tUSD,address tUSDC,address tBTC,address tETH,
        address tUSDT,address tSYMB,address pool
    );

    event AdvancedTestnetDeployed(address indexed tokenCreator,address indexed limitBook);

    function run() external {
        uint256 expected = vm.envUint("TESTNET_EXPECTED_CHAIN_ID");
        uint256 signer = vm.envUint("TESTNET_DEPLOYER_PRIVATE_KEY");
        require(expected != 1 && expected != 4613 && expected > 1000 && block.chainid == expected, "REFUSE_MAINNET_OR_MISMATCH");
        require(signer != 0, "MISSING_SIGNER");
        address deployer=vm.addr(signer);
        vm.startBroadcast(signer);
        SymbFactory factory = new SymbFactory();
        SymbWrappedVery wrapper = new SymbWrappedVery();
        SymbRouter router = new SymbRouter(address(factory),address(wrapper));
        SymbDemoTokenFactory tokenCreator = new SymbDemoTokenFactory();

        SymbTestToken tUSD = new SymbTestToken("Symb test USD","tUSD",6,1_000_000_000e6);
        SymbTestToken tUSDC = new SymbTestToken("Symb test USDC","tUSDC",6,1_000_000_000e6);
        SymbTestToken tUSDT = new SymbTestToken("Symb test USDT","tUSDT",6,1_000_000_000e6);
        SymbTestToken tBTC = new SymbTestToken("Symb test BTC","tBTC",8,21_000_000e8);
        SymbTestToken tETH = new SymbTestToken("Symb test ETH","tETH",18,100_000_000e18);
        SymbTestToken tSYMB = new SymbTestToken("Symb test governance","tSYMB",18,100_000_000e18);
        address[] memory trustedOrderAssets=new address[](6);
        trustedOrderAssets[0]=address(tUSD);trustedOrderAssets[1]=address(tUSDC);
        trustedOrderAssets[2]=address(tUSDT);trustedOrderAssets[3]=address(tBTC);
        trustedOrderAssets[4]=address(tETH);trustedOrderAssets[5]=address(tSYMB);
        SymbDemoLimitBook limitBook = new SymbDemoLimitBook(trustedOrderAssets);

        address[] memory assets = new address[](6);
        assets[0]=address(tUSD);assets[1]=address(tUSDC);assets[2]=address(tUSDT);
        assets[3]=address(tBTC);assets[4]=address(tETH);assets[5]=address(tSYMB);
        uint256[] memory amounts=new uint256[](6);
        amounts[0]=1_000e6;amounts[1]=1_000e6;amounts[2]=1_000e6;
        amounts[3]=1e7;amounts[4]=1e18;amounts[5]=100e18;
        SymbTestFaucet faucet=new SymbTestFaucet(assets,amounts,0.01 ether,1 days);

        // Nonredeemable, valueless demo inventories; initial amount is 1000x claim size.
        tUSD.mint(address(faucet),1_000_000e6);
        tUSDC.mint(address(faucet),1_000_000e6);
        tUSDT.mint(address(faucet),1_000_000e6);
        tBTC.mint(address(faucet),100e8);
        tETH.mint(address(faucet),1000e18);
        tSYMB.mint(address(faucet),100_000e18);

        // Fund faucet native TEST GAS only; must come from this separate EVM test chain.
        (bool funded,) = payable(address(faucet)).call{value:10 ether}("");
        require(funded, "TEST_GAS_FUNDING_FAILED");

        // Seed one verified tUSD/tBTC pool to make first swaps demonstrably functional.
        tUSD.mint(deployer,100_000e6);
        tBTC.mint(deployer,10e8);
        tUSD.approve(address(router),100_000e6);
        tBTC.approve(address(router),10e8);
        router.addLiquidity(address(tUSD),address(tBTC),10_000e6,1e8,1,1,deployer,block.timestamp+30 minutes);
        // A second pool enables the live native test-gas → tUSD swap path.
        router.addLiquidityETH{value:10 ether}(address(tUSD),10_000e6,1,1,deployer,block.timestamp+30 minutes);
        address pool=factory.getPair(address(tUSD),address(tBTC));

        emit TestnetDeployed(block.chainid,address(factory),address(router),address(wrapper),
            address(faucet),address(tUSD),address(tUSDC),address(tBTC),address(tETH),
            address(tUSDT),address(tSYMB),pool);
        emit AdvancedTestnetDeployed(address(tokenCreator),address(limitBook));
        vm.stopBroadcast();
    }
}
