// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {LiddeFactory} from "../src/LiddeFactory.sol";
import {LiddeRouter} from "../src/LiddeRouter.sol";
import {LiddePair} from "../src/LiddePair.sol";
import {LiddeWrappedVery} from "../src/LiddeWrappedVery.sol";
import {MockToken} from "./MockToken.sol";

/// @notice A deliberately hostile ERC-20 used to probe pair callback reentrancy.
/// @dev Minimal mock; not intended for production token deployment.
contract ReentryProbeToken {
    string public constant name = "Reentry probe";
    string public constant symbol = "REENTRY";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    address public attackPair;
    bool public reentryBlocked;
    bool private attacking;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount; totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
    function setAttackPair(address pair) external { attackPair = pair; }
    function approve(address to, uint256 amount) external returns (bool) {
        allowance[msg.sender][to] = amount; emit Approval(msg.sender, to, amount); return true;
    }
    function transfer(address to, uint256 amount) external returns (bool) {
        _move(msg.sender, to, amount);
        return true;
    }
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 permitted = allowance[from][msg.sender];
        require(permitted >= amount, "ALLOWANCE");
        if (permitted != type(uint256).max) allowance[from][msg.sender] = permitted - amount;
        _move(from, to, amount);
        return true;
    }
    function _move(address from, address to, uint256 amount) internal {
        require(balanceOf[from] >= amount && to != address(0), "BALANCE");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        // Pair pays output. Try calling sync while its swap lock is held.
        if (from == attackPair && !attacking) {
            attacking = true;
            (bool succeeded,) = attackPair.call(abi.encodeWithSignature("sync()"));
            reentryBlocked = !succeeded;
            attacking = false;
        }
    }
}

contract LiddeSecurityTest {
    LiddeFactory factory;
    LiddeRouter router;
    LiddeWrappedVery wvery;
    MockToken alpha;
    ReentryProbeToken hostile;

    function setUp() public {
        factory = new LiddeFactory();
        wvery = new LiddeWrappedVery();
        router = new LiddeRouter(address(factory), address(wvery));
        alpha = new MockToken("Alpha", "A");
        hostile = new ReentryProbeToken();
        alpha.mint(address(this), 1_000_000 ether);
        hostile.mint(address(this), 1_000_000 ether);
        alpha.approve(address(router), type(uint256).max);
        hostile.approve(address(router), type(uint256).max);
    }

    function testReentrancyGuardRejectsHostileTokenCallback() public {
        router.addLiquidity(
            address(alpha), address(hostile), 1000 ether, 1000 ether,
            1000 ether, 1000 ether, address(this), block.timestamp
        );
        address pair = factory.getPair(address(alpha), address(hostile));
        hostile.setAttackPair(pair);
        address[] memory path = new address[](2);
        path[0] = address(alpha);
        path[1] = address(hostile);
        uint256 old = hostile.balanceOf(address(this));
        router.swapExactTokensForTokens(5 ether, 1, path, address(this), block.timestamp);
        require(hostile.reentryBlocked(), "REENTRANCY_SUCCEEDED");
        require(hostile.balanceOf(address(this)) > old, "SWAP_FAILED");
    }

    function testFactoryRejectsZeroAndIdenticalTokens() public {
        (bool sameToken,) = address(factory).call(abi.encodeWithSelector(
            factory.createPair.selector, address(alpha), address(alpha)
        ));
        (bool zeroToken,) = address(factory).call(abi.encodeWithSelector(
            factory.createPair.selector, address(0), address(alpha)
        ));
        require(!sameToken && !zeroToken, "BAD_PAIR_CREATED");
    }

    function testNoZeroOutputOrUnfundedPoolSwap() public {
        router.addLiquidity(
            address(alpha), address(hostile), 1000 ether, 1000 ether,
            1000 ether, 1000 ether, address(this), block.timestamp
        );
        address pair = factory.getPair(address(alpha), address(hostile));
        (bool empty,) = pair.call(abi.encodeWithSignature("swap(uint256,uint256,address)",0,0,address(this)));
        require(!empty, "EMPTY_SWAP");
        (bool missingInput,) = pair.call(abi.encodeWithSignature("swap(uint256,uint256,address)",uint256(1 ether),0,address(this)));
        require(!missingInput, "UNFUNDED_SWAP");
    }

    function testCannotStealLPWithNoApproval() public {
        router.addLiquidity(
            address(alpha), address(hostile), 1000 ether, 1000 ether,
            1000 ether, 1000 ether, address(this), block.timestamp
        );
        address pair = factory.getPair(address(alpha), address(hostile));
        (bool success,) = address(router).call(abi.encodeWithSelector(
            router.removeLiquidity.selector,
            address(alpha),address(hostile),uint256(1 ether),uint256(0),uint256(0),
            address(this),block.timestamp
        ));
        require(!success, "UNAPPROVED_LP_BURN");
        require(LiddePair(pair).balanceOf(address(this)) > 0, "LP_STOLEN");
    }

    function testNoUnauthorizedPairInitialization() public {
        address pair = factory.createPair(address(alpha),address(hostile));
        (bool ok,) = pair.call(abi.encodeWithSignature(
            "initialize(address,address)",address(alpha),address(hostile)
        ));
        require(!ok, "REINITIALIZED");
    }

    function testFuzzRouterAmountOutNeverExceedsReserves(uint96 rawIn, uint96 rawReserve) public {
        uint256 reserve=10_000 + uint256(rawReserve) % (10**25);
        uint256 input=1+uint256(rawIn) % (10**22);
        uint256 output=router.getAmountOut(input,reserve,reserve);
        require(output > 0 && output < reserve, "PRICE_OVERFLOW");
    }
}
