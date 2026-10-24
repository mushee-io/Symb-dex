// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {LiddeERC20} from "../src/LiddeERC20.sol";

contract MockToken is LiddeERC20 {
    constructor(string memory n, string memory s) LiddeERC20(n, s) {}
    function mint(address to, uint256 amount) external {
        require(to != address(0), "ZERO_RECIPIENT");
        _mint(to, amount);
    }
}
