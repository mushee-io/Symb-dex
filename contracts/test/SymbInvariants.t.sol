// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {SymbFactory} from "../src/SymbFactory.sol";
import {SymbRouter} from "../src/SymbRouter.sol";
import {SymbPair} from "../src/SymbPair.sol";
import {SymbWrappedVery} from "../src/SymbWrappedVery.sol";
import {MockToken} from "./MockToken.sol";

/// @dev Stateful handler for randomized swaps, LP minting and withdrawals.
contract SymbInvariantHandler {
    SymbRouter internal immutable router;
    SymbPair internal immutable pair;
    MockToken internal immutable tokenA;
    MockToken internal immutable tokenB;

    constructor(SymbRouter r, SymbPair p, MockToken a, MockToken b) {
        router = r; pair = p; tokenA = a; tokenB = b;
        a.approve(address(r), type(uint256).max);
        b.approve(address(r), type(uint256).max);
        p.approve(address(r), type(uint256).max);
    }

    function swapAForB(uint96 seed) external {
        uint256 amount = 1e12 + uint256(seed) % (10 ether);
        tokenA.mint(address(this), amount);
        address[] memory path = new address[](2);
        path[0] = address(tokenA);
        path[1] = address(tokenB);
        router.swapExactTokensForTokens(amount, 1, path, address(this), block.timestamp);
    }

    function swapBForA(uint96 seed) external {
        uint256 amount = 1e12 + uint256(seed) % (10 ether);
        tokenB.mint(address(this), amount);
        address[] memory path = new address[](2);
        path[0] = address(tokenB);
        path[1] = address(tokenA);
        router.swapExactTokensForTokens(amount, 1, path, address(this), block.timestamp);
    }

    function add(uint96 seed) external {
        uint256 amount = 1 ether + uint256(seed) % (5 ether);
        tokenA.mint(address(this), amount);
        tokenB.mint(address(this), amount);
        router.addLiquidity(address(tokenA), address(tokenB), amount, amount, 1, 1, address(this), block.timestamp);
    }

    function remove(uint96 seed) external {
        uint256 owned = pair.balanceOf(address(this));
        if (owned < 1e12) return;
        uint256 lp = 1e12 + uint256(seed) % (owned / 2 + 1);
        if (lp > owned) lp = owned;
        router.removeLiquidity(address(tokenA), address(tokenB), lp, 1, 1, address(this), block.timestamp);
    }
}

contract SymbInvariantsTest {
    SymbFactory factory;
    SymbPair pair;
    SymbRouter router;
    MockToken a;
    MockToken b;
    address[] private targets;

    function setUp() public {
        factory = new SymbFactory();
        SymbWrappedVery wvery = new SymbWrappedVery();
        router = new SymbRouter(address(factory), address(wvery));
        a = new MockToken("Alpha", "A");
        b = new MockToken("Beta", "B");
        a.mint(address(this), 1000 ether);
        b.mint(address(this), 1000 ether);
        a.approve(address(router), type(uint256).max);
        b.approve(address(router), type(uint256).max);
        router.addLiquidity(address(a), address(b), 1000 ether, 1000 ether, 1, 1, address(this), block.timestamp);
        pair = SymbPair(factory.getPair(address(a), address(b)));
        SymbInvariantHandler handler = new SymbInvariantHandler(router, pair, a, b);
        targets.push(address(handler));
    }

    function targetContracts() public view returns (address[] memory) { return targets; }

    function invariant_reservesCannotExceedBackingBalances() public view {
        (uint112 r0, uint112 r1,) = pair.getReserves();
        address token0 = pair.token0();
        uint256 bal0 = token0 == address(a) ? a.balanceOf(address(pair)) : b.balanceOf(address(pair));
        uint256 bal1 = token0 == address(a) ? b.balanceOf(address(pair)) : a.balanceOf(address(pair));
        require(r0 <= bal0 && r1 <= bal1, "UNBACKED_RESERVES");
    }

    function invariant_initialLPLockNeverReleased() public view {
        require(pair.balanceOf(address(0)) == pair.MINIMUM_LIQUIDITY(), "UNLOCKED_INITIAL_LP");
        require(pair.totalSupply() >= pair.MINIMUM_LIQUIDITY(), "LP_SUPPLY_BELOW_LOCK");
    }

    function invariant_factoryCannotDuplicatePair() public view {
        require(factory.allPairsLength() == 1, "DUPLICATE_POOL");
        require(factory.getPair(address(a), address(b)) == address(pair), "PAIR_REASSIGNED");
        require(factory.getPair(address(b), address(a)) == address(pair), "REVERSE_PAIR_REASSIGNED");
    }
}
