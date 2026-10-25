// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {SymbERC20} from "./SymbERC20.sol";

/// @notice Original local wrapped-native-currency implementation for development.
/// @dev NOT a verified canonical WVERY address. Do not deploy or configure mainnet without review.
contract SymbWrappedVery is SymbERC20 {
    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);

    constructor() SymbERC20("Symb Wrapped VERY", "L-WVERY") {}

    receive() external payable { deposit(); }

    function deposit() public payable {
        require(msg.value > 0, "ZERO_DEPOSIT");
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "ZERO_WITHDRAW");
        _burn(msg.sender, amount);
        emit Withdrawal(msg.sender, amount);
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "NATIVE_TRANSFER_FAILED");
    }
}
