// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ILiddeERC20, ILiddeFactory, ILiddePair, ILiddeWrappedVery} from "./interfaces/ILidde.sol";

/// @notice Original MIT-licensed V2-style router for Solidity review and local-only tests.
/// @dev ETH-named selectors intentionally preserve compatibility with existing Viem ABIs:
///      for VERY, "ETH" refers to the chain's native coin.
///      Not audited; do not deploy with real funds.
contract LiddeRouter {
    address public immutable factory;
    address public immutable WETH;

    modifier ensure(uint256 deadline) {
        require(block.timestamp <= deadline, "EXPIRED");
        _;
    }

    constructor(address factory_, address wrapped_) {
        require(factory_ != address(0) && wrapped_ != address(0), "ZERO_CONFIG");
        factory = factory_;
        WETH = wrapped_;
    }

    receive() external payable {
        require(msg.sender == WETH, "NATIVE_ONLY_FROM_WRAPPER");
    }

    function _safeTransfer(address token, address to, uint256 amount) internal {
        (bool ok, bytes memory data) = token.call(abi.encodeWithSelector(ILiddeERC20.transfer.selector, to, amount));
        require(ok && (data.length == 0 || abi.decode(data, (bool))), "TOKEN_TRANSFER_FAILED");
    }

    function _safeTransferFrom(address token, address from, address to, uint256 amount) internal {
        (bool ok, bytes memory data) =
            token.call(abi.encodeWithSelector(ILiddeERC20.transferFrom.selector, from, to, amount));
        require(ok && (data.length == 0 || abi.decode(data, (bool))), "TOKEN_TRANSFER_FROM_FAILED");
    }

    function _safeNative(address recipient, uint256 amount) internal {
        (bool ok,) = payable(recipient).call{value: amount}("");
        require(ok, "NATIVE_SEND_FAILED");
    }

    function _getPair(address a, address b) internal view returns (address pair) {
        pair = ILiddeFactory(factory).getPair(a, b);
        require(pair != address(0), "PAIR_NOT_FOUND");
    }

    function _reserves(address tokenA, address tokenB) internal view returns (uint256 reserveA, uint256 reserveB) {
        address pair = _getPair(tokenA, tokenB);
        (uint112 r0, uint112 r1,) = ILiddePair(pair).getReserves();
        if (tokenA < tokenB) (reserveA, reserveB) = (uint256(r0), uint256(r1));
        else (reserveA, reserveB) = (uint256(r1), uint256(r0));
    }

    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) public pure returns (uint256) {
        require(amountA > 0 && reserveA > 0 && reserveB > 0, "BAD_QUOTE");
        return amountA * reserveB / reserveA;
    }

    function getAmountOut(uint256 input, uint256 reserveIn, uint256 reserveOut)
        public pure returns (uint256 output)
    {
        require(input > 0 && reserveIn > 0 && reserveOut > 0, "NO_LIQUIDITY");
        uint256 inputWithFee = input * 997;
        output = inputWithFee * reserveOut / (reserveIn * 1000 + inputWithFee);
        require(output > 0 && output < reserveOut, "OUTPUT_TOO_SMALL");
    }

    function getAmountsOut(uint256 input, address[] memory path)
        public view returns (uint256[] memory amounts)
    {
        require(path.length >= 2 && path.length <= 3, "INVALID_PATH");
        require(path.length != 3 || path[0] != path[2], "CYCLIC_PATH");
        amounts = new uint256[](path.length);
        amounts[0] = input;
        for (uint256 i = 0; i + 1 < path.length; ++i) {
            require(path[i] != path[i + 1], "REPEATED_TOKEN");
            (uint256 reserveIn, uint256 reserveOut) = _reserves(path[i], path[i + 1]);
            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
        }
    }

    function _addLiquidity(
        address a, address b, uint256 desiredA, uint256 desiredB, uint256 minA, uint256 minB
    ) internal returns (address pair, uint256 amountA, uint256 amountB) {
        require(a != b && a != address(0) && b != address(0), "INVALID_PAIR");
        pair = ILiddeFactory(factory).getPair(a, b);
        if (pair == address(0)) pair = ILiddeFactory(factory).createPair(a, b);
        (uint256 rA, uint256 rB) = _reserves(a, b);
        if (rA == 0 && rB == 0) {
            amountA = desiredA;
            amountB = desiredB;
        } else {
            require(rA > 0 && rB > 0, "INCONSISTENT_RESERVES");
            uint256 optimalB = quote(desiredA, rA, rB);
            if (optimalB <= desiredB) {
                (amountA, amountB) = (desiredA, optimalB);
            } else {
                (amountA, amountB) = (quote(desiredB, rB, rA), desiredB);
            }
        }
        require(amountA > 0 && amountB > 0 && amountA >= minA && amountB >= minB, "LIQUIDITY_SLIPPAGE");
    }

    function addLiquidity(
        address a, address b, uint256 desiredA, uint256 desiredB,
        uint256 minA, uint256 minB, address to, uint256 deadline
    ) external ensure(deadline) returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(to != address(0), "INVALID_RECIPIENT");
        (address pair, uint256 aValue, uint256 bValue) =
            _addLiquidity(a, b, desiredA, desiredB, minA, minB);
        (amountA, amountB) = (aValue, bValue);
        _safeTransferFrom(a, msg.sender, pair, amountA);
        _safeTransferFrom(b, msg.sender, pair, amountB);
        liquidity = ILiddePair(pair).mint(to);
    }

    function addLiquidityETH(
        address token, uint256 desiredToken, uint256 minToken, uint256 minETH,
        address to, uint256 deadline
    ) external payable ensure(deadline) returns (uint256 amountToken, uint256 amountETH, uint256 liquidity) {
        require(to != address(0) && token != WETH, "INVALID_RECIPIENT_OR_TOKEN");
        (address pair, uint256 tokenValue, uint256 nativeValue) =
            _addLiquidity(token, WETH, desiredToken, msg.value, minToken, minETH);
        (amountToken, amountETH) = (tokenValue, nativeValue);
        _safeTransferFrom(token, msg.sender, pair, amountToken);
        ILiddeWrappedVery(WETH).deposit{value: amountETH}();
        _safeTransfer(WETH, pair, amountETH);
        liquidity = ILiddePair(pair).mint(to);
        if (msg.value > amountETH) _safeNative(msg.sender, msg.value - amountETH);
    }

    function removeLiquidity(
        address a, address b, uint256 liquidity, uint256 minA, uint256 minB,
        address to, uint256 deadline
    ) public ensure(deadline) returns (uint256 amountA, uint256 amountB) {
        require(to != address(0) && liquidity > 0, "INVALID_WITHDRAW");
        address pair = _getPair(a, b);
        _safeTransferFrom(pair, msg.sender, pair, liquidity);
        (uint256 amount0, uint256 amount1) = ILiddePair(pair).burn(to);
        (amountA, amountB) = a < b ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= minA && amountB >= minB, "WITHDRAW_SLIPPAGE");
    }

    function removeLiquidityETH(
        address token, uint256 liquidity, uint256 minToken, uint256 minETH,
        address to, uint256 deadline
    ) external ensure(deadline) returns (uint256 amountToken, uint256 amountETH) {
        require(to != address(0) && token != WETH && liquidity > 0, "INVALID_WITHDRAW");
        address pair = _getPair(token, WETH);
        _safeTransferFrom(pair, msg.sender, pair, liquidity);
        (uint256 amount0, uint256 amount1) = ILiddePair(pair).burn(address(this));
        (amountToken, amountETH) = token < WETH ? (amount0, amount1) : (amount1, amount0);
        require(amountToken >= minToken && amountETH >= minETH, "WITHDRAW_SLIPPAGE");
        _safeTransfer(token, to, amountToken);
        ILiddeWrappedVery(WETH).withdraw(amountETH);
        _safeNative(to, amountETH);
    }

    function _swap(uint256[] memory amounts, address[] memory path, address recipient) internal {
        require(recipient != address(0), "INVALID_RECIPIENT");
        for (uint256 i = 0; i + 1 < path.length; ++i) {
            address input = path[i];
            address output = path[i + 1];
            address pair = _getPair(input, output);
            uint256 outAmount = amounts[i + 1];
            (uint256 out0, uint256 out1) = input < output ? (uint256(0), outAmount) : (outAmount, uint256(0));
            address to = i + 2 < path.length ? _getPair(output, path[i + 2]) : recipient;
            ILiddePair(pair).swap(out0, out1, to);
        }
    }

    function swapExactTokensForTokens(
        uint256 amountIn, uint256 minOut, address[] calldata path,
        address to, uint256 deadline
    ) external ensure(deadline) returns (uint256[] memory amounts) {
        amounts = getAmountsOut(amountIn, path);
        require(amounts[amounts.length - 1] >= minOut, "SWAP_SLIPPAGE");
        _safeTransferFrom(path[0], msg.sender, _getPair(path[0], path[1]), amounts[0]);
        _swap(amounts, path, to);
    }

    function swapExactETHForTokens(
        uint256 minOut, address[] calldata path, address to, uint256 deadline
    ) external payable ensure(deadline) returns (uint256[] memory amounts) {
        require(path.length >= 2 && path[0] == WETH, "WRONG_NATIVE_PATH");
        amounts = getAmountsOut(msg.value, path);
        require(amounts[amounts.length - 1] >= minOut, "SWAP_SLIPPAGE");
        ILiddeWrappedVery(WETH).deposit{value: amounts[0]}();
        _safeTransfer(WETH, _getPair(path[0], path[1]), amounts[0]);
        _swap(amounts, path, to);
    }

    function swapExactTokensForETH(
        uint256 amountIn, uint256 minOut, address[] calldata path,
        address to, uint256 deadline
    ) external ensure(deadline) returns (uint256[] memory amounts) {
        require(path.length >= 2 && path[path.length - 1] == WETH, "WRONG_NATIVE_PATH");
        amounts = getAmountsOut(amountIn, path);
        require(amounts[amounts.length - 1] >= minOut, "SWAP_SLIPPAGE");
        _safeTransferFrom(path[0], msg.sender, _getPair(path[0], path[1]), amounts[0]);
        _swap(amounts, path, address(this));
        uint256 result = amounts[amounts.length - 1];
        ILiddeWrappedVery(WETH).withdraw(result);
        _safeNative(to, result);
    }
}
