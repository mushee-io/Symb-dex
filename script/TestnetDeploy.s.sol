// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {LiddeFactory} from "../contracts/src/LiddeFactory.sol";
import {LiddeRouter} from "../contracts/src/LiddeRouter.sol";
import {LiddeWrappedVery} from "../contracts/src/LiddeWrappedVery.sol";
import {LiddeTestToken} from "../contracts/src/testnet/LiddeTestToken.sol";
import {LiddeTestFaucet} from "../contracts/src/testnet/LiddeTestFaucet.sol";
import {LiddeDemoTokenFactory} from "../contracts/src/testnet/LiddeDemoTokenFactory.sol";
import {LiddeDemoLimitBook} from "../contracts/src/testnet/LiddeDemoLimitBook.sol";

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
        address tUSDT,address tLIDDE,address pool
    );

    event AdvancedTestnetDeployed(address indexed tokenCreator,address indexed limitBook);

    function run() external {
        uint256 expected = vm.envUint("TESTNET_EXPECTED_CHAIN_ID");
        uint256 signer = vm.envUint("TESTNET_DEPLOYER_PRIVATE_KEY");
        require(expected != 1 && expected != 4613 && expected > 1000 && block.chainid == expected, "REFUSE_MAINNET_OR_MISMATCH");
        require(signer != 0, "MISSING_SIGNER");
        address deployer=vm.addr(signer);
        vm.startBroadcast(signer);
        LiddeFactory factory = new LiddeFactory();
        LiddeWrappedVery wrapper = new LiddeWrappedVery();
        LiddeRouter router = new LiddeRouter(address(factory),address(wrapper));
        LiddeDemoTokenFactory tokenCreator = new LiddeDemoTokenFactory();
        LiddeDemoLimitBook limitBook = new LiddeDemoLimitBook();

        LiddeTestToken tUSD = new LiddeTestToken("Lidde test USD","tUSD",6,1_000_000_000e6);
        LiddeTestToken tUSDC = new LiddeTestToken("Lidde test USDC","tUSDC",6,1_000_000_000e6);
        LiddeTestToken tUSDT = new LiddeTestToken("Lidde test USDT","tUSDT",6,1_000_000_000e6);
        LiddeTestToken tBTC = new LiddeTestToken("Lidde test BTC","tBTC",8,21_000_000e8);
        LiddeTestToken tETH = new LiddeTestToken("Lidde test ETH","tETH",18,100_000_000e18);
        LiddeTestToken tLIDDE = new LiddeTestToken("Lidde test governance","tLIDDE",18,100_000_000e18);

        address[] memory assets = new address[](6);
        assets[0]=address(tUSD);assets[1]=address(tUSDC);assets[2]=address(tUSDT);
        assets[3]=address(tBTC);assets[4]=address(tETH);assets[5]=address(tLIDDE);
        uint256[] memory amounts=new uint256[](6);
        amounts[0]=1_000e6;amounts[1]=1_000e6;amounts[2]=1_000e6;
        amounts[3]=1e7;amounts[4]=1e18;amounts[5]=100e18;
        LiddeTestFaucet faucet=new LiddeTestFaucet(assets,amounts,0.01 ether,1 days);

        // Nonredeemable, valueless demo inventories; initial amount is 1000x claim size.
        tUSD.mint(address(faucet),1_000_000e6);
        tUSDC.mint(address(faucet),1_000_000e6);
        tUSDT.mint(address(faucet),1_000_000e6);
        tBTC.mint(address(faucet),100e8);
        tETH.mint(address(faucet),1000e18);
        tLIDDE.mint(address(faucet),100_000e18);

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
            address(tUSDT),address(tLIDDE),pool);
        emit AdvancedTestnetDeployed(address(tokenCreator),address(limitBook));
        vm.stopBroadcast();
    }
}
