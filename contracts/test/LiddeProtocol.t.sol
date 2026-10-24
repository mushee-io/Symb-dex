// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {LiddeFactory} from "../src/LiddeFactory.sol";
import {LiddeRouter} from "../src/LiddeRouter.sol";
import {LiddePair} from "../src/LiddePair.sol";
import {LiddeWrappedVery} from "../src/LiddeWrappedVery.sol";
import {MockToken} from "./MockToken.sol";

interface Vm {
    function deal(address who, uint256 amount) external;
    function warp(uint256 timestamp) external;
    function prank(address msgSender) external;
}

contract LiddeProtocolTest {
    Vm constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
    LiddeFactory public factory;
    LiddeRouter public router;
    LiddeWrappedVery public wrapper;
    MockToken public alpha;
    MockToken public beta;
    uint256 internal constant SEED = 1_000 ether;

    receive() external payable {}

    function setUp() public {
        factory = new LiddeFactory();
        wrapper = new LiddeWrappedVery();
        router = new LiddeRouter(address(factory), address(wrapper));
        alpha = new MockToken("Alpha", "ALPHA");
        beta = new MockToken("Beta", "BETA");
        alpha.mint(address(this), 2_000_000 ether);
        beta.mint(address(this), 2_000_000 ether);
        alpha.approve(address(router), type(uint256).max);
        beta.approve(address(router), type(uint256).max);
        vm.deal(address(this), 100_000 ether);
    }

    function _seedPair() internal returns (LiddePair pair) {
        router.addLiquidity(address(alpha), address(beta), SEED, SEED, SEED, SEED, address(this), block.timestamp);
        pair = LiddePair(factory.getPair(address(alpha), address(beta)));
    }

    function testFactoryPairSymmetryAndNoDuplicate() public {
        address created = factory.createPair(address(alpha), address(beta));
        require(created == factory.getPair(address(beta), address(alpha)), "ASYMMETRIC");
        require(factory.allPairsLength() == 1, "PAIR_COUNT");
        (bool succeeded,) = address(factory).call(abi.encodeWithSelector(
            factory.createPair.selector, address(beta), address(alpha)
        ));
        require(!succeeded, "DUPLICATE_ALLOWED");
        require(LiddePair(created).factory() == address(factory), "INVALID_FACTORY");
    }

    function testInitialLiquidityAndReserves() public {
        LiddePair pair = _seedPair();
        (uint112 r0, uint112 r1,) = pair.getReserves();
        require(r0 == SEED && r1 == SEED, "RESERVE_MISMATCH");
        require(pair.totalSupply() == SEED, "LP_SUPPLY");
        require(pair.balanceOf(address(0)) == pair.MINIMUM_LIQUIDITY(), "LOCKED_LP");
        require(pair.balanceOf(address(this)) == SEED - pair.MINIMUM_LIQUIDITY(), "USER_LP");
    }

    function testSwapAndFeeAdjustedInvariant() public {
        LiddePair pair = _seedPair();
        address[] memory path = new address[](2);
        path[0] = address(alpha); path[1] = address(beta);
        uint256 balanceBefore = beta.balanceOf(address(this));
        uint256[] memory amounts = router.swapExactTokensForTokens(
            10 ether, 1, path, address(this), block.timestamp
        );
        require(amounts[1] > 0 && amounts[1] < 10 ether, "BAD_OUTPUT");
        require(beta.balanceOf(address(this)) - balanceBefore == amounts[1], "MISSING_OUTPUT");
        (uint112 r0, uint112 r1,) = pair.getReserves();
        require(uint256(r0) * uint256(r1) >= SEED * SEED, "K_DECREASED");
    }

    function testRemoveLiquidityReturnsBothAssets() public {
        LiddePair pair = _seedPair();
        pair.approve(address(router), type(uint256).max);
        uint256 aBefore = alpha.balanceOf(address(this));
        uint256 bBefore = beta.balanceOf(address(this));
        (uint256 a, uint256 b) = router.removeLiquidity(
            address(alpha), address(beta), pair.balanceOf(address(this)) / 2,
            1, 1, address(this), block.timestamp
        );
        require(a > 0 && b > 0, "BURN_ZERO");
        require(alpha.balanceOf(address(this)) - aBefore == a, "A_WITHDRAW_MISMATCH");
        require(beta.balanceOf(address(this)) - bBefore == b, "B_WITHDRAW_MISMATCH");
    }

    function testNoUnfundedSwap() public {
        LiddePair pair = _seedPair();
        (bool succeeded,) = address(pair).call(abi.encodeWithSelector(
            pair.swap.selector, uint256(0), uint256(10 ether), address(this)
        ));
        require(!succeeded, "UNFUNDED_SWAP_ALLOWED");
    }

    function testDeadlineAndSlippageRevert() public {
        _seedPair();
        vm.warp(100);
        address[] memory path = new address[](2);
        path[0] = address(alpha); path[1] = address(beta);
        (bool expired,) = address(router).call(abi.encodeWithSelector(
            router.swapExactTokensForTokens.selector, 1 ether, uint256(1), path, address(this), uint256(99)
        ));
        require(!expired, "EXPIRED_SWAP_ALLOWED");
        (bool slipping,) = address(router).call(abi.encodeWithSelector(
            router.swapExactTokensForTokens.selector, 1 ether, type(uint256).max, path, address(this), block.timestamp
        ));
        require(!slipping, "SLIPPAGE_BYPASS");
    }

    function testNativeVERYDepositAndWithdraw() public {
        (uint256 usedToken, uint256 usedNative, uint256 minted) = router.addLiquidityETH{value: 3 ether}(
            address(alpha), 6 ether, 6 ether, 3 ether, address(this), block.timestamp
        );
        require(usedToken == 6 ether && usedNative == 3 ether && minted > 0, "NATIVE_LP");
        address pairAddress = factory.getPair(address(alpha), address(wrapper));
        LiddePair pair = LiddePair(pairAddress);
        pair.approve(address(router), type(uint256).max);
        uint256 previousNative = address(this).balance;
        (,uint256 returnedNative) = router.removeLiquidityETH(
            address(alpha), pair.balanceOf(address(this))/2, 1, 1, address(this), block.timestamp
        );
        require(returnedNative > 0 && address(this).balance == previousNative+returnedNative, "NATIVE_WITHDRAW");
    }

    function testNativeSwapDirections() public {
        router.addLiquidityETH{value: 20 ether}(address(alpha), 40 ether, 40 ether, 20 ether, address(this), block.timestamp);
        address[] memory buy = new address[](2);
        buy[0] = address(wrapper); buy[1] = address(alpha);
        uint256 beforeToken = alpha.balanceOf(address(this));
        router.swapExactETHForTokens{value: 1 ether}(1, buy, address(this), block.timestamp);
        require(alpha.balanceOf(address(this)) > beforeToken, "NATIVE_BUY_FAIL");
        address[] memory sell = new address[](2);
        sell[0] = address(alpha); sell[1] = address(wrapper);
        uint256 beforeVery = address(this).balance;
        router.swapExactTokensForETH(1 ether, 1, sell, address(this), block.timestamp);
        require(address(this).balance > beforeVery, "NATIVE_SELL_FAIL");
    }

    function testFuzzSwapNeverDecreasesConstantProduct(uint96 raw) public {
        LiddePair pair = _seedPair();
        uint256 input = 1e12 + uint256(raw) % (50 ether);
        address[] memory path = new address[](2);
        path[0] = address(alpha); path[1] = address(beta);
        router.swapExactTokensForTokens(input, 1, path, address(this), block.timestamp);
        (uint112 r0, uint112 r1,) = pair.getReserves();
        require(uint256(r0)*uint256(r1) >= SEED*SEED, "K_INVARIANT_FAIL");
    }

    function testFuzzLPWithdrawalCannotExceedReserves(uint96 raw) public {
        LiddePair pair = _seedPair();
        uint256 owned = pair.balanceOf(address(this));
        uint256 shares = 1e15 + uint256(raw) % (owned / 2);
        pair.approve(address(router), shares);
        (uint112 before0,uint112 before1,) = pair.getReserves();
        (uint256 amountA,uint256 amountB) = router.removeLiquidity(
            address(alpha), address(beta), shares, 1, 1, address(this), block.timestamp
        );
        require(amountA <= before0 && amountB <= before1, "WITHDRAW_OVERFLOW");
        require(pair.totalSupply() >= pair.MINIMUM_LIQUIDITY(), "LOCKED_LP_LOST");
    }
}
