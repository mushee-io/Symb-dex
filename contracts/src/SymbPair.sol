// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {SymbERC20} from "./SymbERC20.sol";
import {ISymbERC20} from "./interfaces/ISymb.sol";

/// @notice Experimental, original MIT-licensed V2-style constant-product liquidity pair.
/// @dev 30 bps swap fee stays in reserves for LPs; no flash callback, no admin, no protocol fee.
///      UNSAFE FOR PRODUCTION until independent audit / end-to-end integration review.
contract SymbPair is SymbERC20 {
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    uint256 private constant FEE_DENOMINATOR = 1000;
    uint256 private constant FEE_NUMERATOR = 3;

    address public immutable factory;
    address public token0;
    address public token1;
    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;
    uint256 private unlocked = 1;

    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to);
    event Swap(
        address indexed sender, uint256 amount0In, uint256 amount1In,
        uint256 amount0Out, uint256 amount1Out, address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    modifier lock() {
        require(unlocked == 1, "REENTRANCY");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    constructor() SymbERC20("Symb Liquidity Provider", "SYMB-LP") {
        factory = msg.sender;
    }

    function initialize(address a, address b) external {
        require(msg.sender == factory, "FACTORY_ONLY");
        require(token0 == address(0) && token1 == address(0), "ALREADY_INITIALIZED");
        require(a != address(0) && b != address(0) && a != b, "INVALID_TOKENS");
        token0 = a;
        token1 = b;
    }

    function getReserves() public view returns (uint112, uint112, uint32) {
        return (reserve0, reserve1, blockTimestampLast);
    }

    function _sqrt(uint256 x) private pure returns (uint256 z) {
        if (x == 0) return 0;
        z = x;
        uint256 y = (x + 1) / 2;
        while (y < z) { z = y; y = (x / y + y) / 2; }
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    function _balance(address token) private view returns (uint256) {
        return ISymbERC20(token).balanceOf(address(this));
    }

    function _safeTransfer(address token, address to, uint256 amount) private {
        require(token.code.length > 0, "TOKEN_NOT_CONTRACT");
        (bool success, bytes memory response) =
            token.call(abi.encodeWithSelector(ISymbERC20.transfer.selector, to, amount));
        require(success && (response.length == 0 || abi.decode(response, (bool))), "TOKEN_TRANSFER_FAILED");
    }

    function _update(uint256 balance0, uint256 balance1) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "RESERVE_OVERFLOW");
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = uint32(block.timestamp);
        emit Sync(reserve0, reserve1);
    }

    function mint(address to) external lock returns (uint256 liquidity) {
        require(to != address(0), "INVALID_RECIPIENT");
        (uint112 old0, uint112 old1,) = getReserves();
        uint256 balance0 = _balance(token0);
        uint256 balance1 = _balance(token1);
        require(balance0 >= old0 && balance1 >= old1, "RESERVE_DEFICIT");
        uint256 amount0 = balance0 - old0;
        uint256 amount1 = balance1 - old1;
        require(amount0 > 0 && amount1 > 0, "ZERO_DEPOSIT");
        uint256 supply = totalSupply;
        if (supply == 0) {
            uint256 root = _sqrt(amount0 * amount1);
            require(root > MINIMUM_LIQUIDITY, "INITIAL_LIQUIDITY_TOO_SMALL");
            liquidity = root - MINIMUM_LIQUIDITY;
            _mint(address(0), MINIMUM_LIQUIDITY);
        } else {
            require(old0 > 0 && old1 > 0, "UNINITIALIZED_RESERVES");
            liquidity = _min(amount0 * supply / old0, amount1 * supply / old1);
        }
        require(liquidity > 0, "ZERO_LP_MINT");
        _mint(to, liquidity);
        _update(balance0, balance1);
        emit Mint(msg.sender, amount0, amount1);
    }

    function burn(address to) external lock returns (uint256 amount0, uint256 amount1) {
        require(to != address(0), "INVALID_RECIPIENT");
        uint256 poolLP = balanceOf[address(this)];
        uint256 supply = totalSupply;
        require(poolLP > 0 && supply > 0, "ZERO_LP_BURN");
        uint256 balance0 = _balance(token0);
        uint256 balance1 = _balance(token1);
        amount0 = poolLP * balance0 / supply;
        amount1 = poolLP * balance1 / supply;
        require(amount0 > 0 && amount1 > 0, "BURN_DUST");
        _burn(address(this), poolLP);
        _safeTransfer(token0, to, amount0);
        _safeTransfer(token1, to, amount1);
        _update(_balance(token0), _balance(token1));
        emit Burn(msg.sender, amount0, amount1, to);
    }

    function swap(uint256 amount0Out, uint256 amount1Out, address to) external lock {
        require(to != address(0) && to != token0 && to != token1, "INVALID_RECIPIENT");
        require(amount0Out > 0 || amount1Out > 0, "ZERO_OUTPUT");
        (uint112 old0, uint112 old1,) = getReserves();
        require(amount0Out < old0 && amount1Out < old1, "INSUFFICIENT_RESERVES");
        if (amount0Out > 0) _safeTransfer(token0, to, amount0Out);
        if (amount1Out > 0) _safeTransfer(token1, to, amount1Out);
        uint256 balance0 = _balance(token0);
        uint256 balance1 = _balance(token1);
        // Hard-cap balances so adjusted multiplication fits uint256.
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "RESERVE_OVERFLOW");
        uint256 input0 = balance0 > uint256(old0) - amount0Out ? balance0 - (uint256(old0) - amount0Out) : 0;
        uint256 input1 = balance1 > uint256(old1) - amount1Out ? balance1 - (uint256(old1) - amount1Out) : 0;
        require(input0 > 0 || input1 > 0, "INSUFFICIENT_INPUT");
        uint256 adjusted0 = balance0 * FEE_DENOMINATOR - input0 * FEE_NUMERATOR;
        uint256 adjusted1 = balance1 * FEE_DENOMINATOR - input1 * FEE_NUMERATOR;
        require(
            adjusted0 * adjusted1 >= uint256(old0) * uint256(old1) * FEE_DENOMINATOR ** 2,
            "K_INVARIANT"
        );
        _update(balance0, balance1);
        emit Swap(msg.sender, input0, input1, amount0Out, amount1Out, to);
    }

    /// @notice Anyone may synchronize reserves; direct token donations are treated as pool assets.
    function sync() external lock {
        _update(_balance(token0), _balance(token1));
    }
}
