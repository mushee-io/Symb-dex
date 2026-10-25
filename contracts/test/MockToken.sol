// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {SymbERC20} from "../src/SymbERC20.sol";

contract MockToken is SymbERC20 {
    constructor(string memory n, string memory s) SymbERC20(n, s) {}
    function mint(address to, uint256 amount) external {
        require(to != address(0), "ZERO_RECIPIENT");
        _mint(to, amount);
    }
}
