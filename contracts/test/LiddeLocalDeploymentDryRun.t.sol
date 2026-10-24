// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {LiddeFactory} from "../src/LiddeFactory.sol";
import {LiddeRouter} from "../src/LiddeRouter.sol";
import {LiddePair} from "../src/LiddePair.sol";
import {LiddeWrappedVery} from "../src/LiddeWrappedVery.sol";
import {MockToken} from "./MockToken.sol";

interface VmLocal {
    function deal(address who, uint256 amount) external;
    function prank(address caller) external;
}

/// @notice Controlled deployment-like tests on Foundry's LOCAL ephemeral EVM.
/// @dev No broadcast, external RPC, private key, real VERY or public liquidity.
contract LiddeLocalDeploymentDryRunTest {
    VmLocal private constant vm = VmLocal(address(uint160(uint256(keccak256("hevm cheat code")))));
    address private constant ALICE = address(0xA11CE);
    address private constant BOB = address(0xB0B);
    LiddeFactory private factory;
    LiddeRouter private router;
    LiddeWrappedVery private wrapper;
    MockToken private alpha;
    MockToken private beta;

    function setUp() public {
        factory = new LiddeFactory();
        wrapper = new LiddeWrappedVery();
        router = new LiddeRouter(address(factory), address(wrapper));
        alpha = new MockToken("Local Alpha", "LALPHA");
        beta = new MockToken("Local Beta", "LBETA");
        alpha.mint(ALICE, 10_000 ether);
        beta.mint(ALICE, 10_000 ether);
        alpha.mint(BOB, 10_000 ether);
        beta.mint(BOB, 10_000 ether);
        vm.deal(ALICE, 1_000 ether);
        vm.deal(BOB, 1_000 ether);
    }

    function testLocalLifecycleDepositSwapPartialWithdrawAndBacking() public {
        require(router.factory() == address(factory), "ROUTER_FACTORY_MISMATCH");
        require(router.WETH() == address(wrapper), "ROUTER_WRAPPER_MISMATCH");
        vm.prank(ALICE);
        alpha.approve(address(router), type(uint256).max);
        vm.prank(ALICE);
        beta.approve(address(router), type(uint256).max);
        vm.prank(ALICE);
        (uint256 addedA, uint256 addedB, uint256 lp) =
            router.addLiquidity(address(alpha), address(beta), 2_000 ether, 2_000 ether,
                2_000 ether, 2_000 ether, ALICE, block.timestamp);
        require(addedA == 2_000 ether && addedB == 2_000 ether && lp > 0, "INITIAL_MINT_FAILED");
        address pairAddr = factory.getPair(address(alpha), address(beta));
        LiddePair pair = LiddePair(pairAddr);
        require(pairAddr != address(0) && pair.totalSupply() == lp + pair.MINIMUM_LIQUIDITY(), "UNVERIFIED_PAIR");
        require(pair.token0() < pair.token1(), "BAD_PAIR_ORDER");

        vm.prank(BOB);
        alpha.approve(address(router), 20 ether);
        address[] memory route = new address[](2);
        route[0] = address(alpha);
        route[1] = address(beta);
        uint256 oldB = beta.balanceOf(BOB);
        vm.prank(BOB);
        uint256[] memory out = router.swapExactTokensForTokens(20 ether, 1, route, BOB, block.timestamp);
        require(beta.balanceOf(BOB) == oldB + out[1], "WALLET_TRADE_NOT_RECONCILED");

        vm.prank(ALICE);
        pair.approve(address(router), lp / 2);
        uint256 beforeA = alpha.balanceOf(ALICE);
        uint256 beforeB = beta.balanceOf(ALICE);
        vm.prank(ALICE);
        (uint256 withdrawA,uint256 withdrawB) =
            router.removeLiquidity(address(alpha), address(beta), lp / 2, 1, 1, ALICE, block.timestamp);
        require(alpha.balanceOf(ALICE) == beforeA + withdrawA, "ASSET_A_WITHDRAW_FAILED");
        require(beta.balanceOf(ALICE) == beforeB + withdrawB, "ASSET_B_WITHDRAW_FAILED");

        (uint112 r0,uint112 r1,) = pair.getReserves();
        require(
            r0 == (pair.token0() == address(alpha) ? alpha.balanceOf(pairAddr) : beta.balanceOf(pairAddr)) &&
            r1 == (pair.token1() == address(alpha) ? alpha.balanceOf(pairAddr) : beta.balanceOf(pairAddr)),
            "POST_WITHDRAW_RESERVE_MISMATCH"
        );
        require(pair.balanceOf(ALICE) == lp - lp / 2, "REMAINING_LP_INCORRECT");
        require(pair.balanceOf(address(0)) == pair.MINIMUM_LIQUIDITY(), "LOCKED_LP_LOST");
    }

    function testLocalNativeWrapperIsFullyCollateralized() public {
        vm.prank(ALICE);
        alpha.approve(address(router), type(uint256).max);
        vm.prank(ALICE);
        router.addLiquidityETH{value: 20 ether}(
            address(alpha), 40 ether, 40 ether, 20 ether, ALICE, block.timestamp
        );
        require(wrapper.totalSupply() == address(wrapper).balance, "UNBACKED_LOCAL_WRAPPER");
        vm.prank(BOB);
        beta.approve(address(router), 1 ether);
        // A wrapper with no official provenance remains a LOCAL TEST FIXTURE.
        require(factory.getPair(address(alpha),address(wrapper)) != address(0), "WRAPPER_POOL_MISSING");
    }

    function testFailedInitialMintCannotRegisterHalfCreatedPool() public {
        vm.prank(ALICE);
        alpha.approve(address(router), 500);
        vm.prank(ALICE);
        beta.approve(address(router), 500);
        vm.prank(ALICE);
        (bool ok,) = address(router).call(abi.encodeWithSelector(
            router.addLiquidity.selector, address(alpha),address(beta),
            uint256(500),uint256(500),uint256(1),uint256(1),ALICE,block.timestamp
        ));
        require(!ok, "DUST_LIQUIDITY_UNEXPECTED_SUCCESS");
        require(factory.getPair(address(alpha),address(beta)) == address(0), "PARTIAL_PAIR_CREATION");
        require(factory.allPairsLength() == 0, "HALF_CREATED_POOL");
    }
}
