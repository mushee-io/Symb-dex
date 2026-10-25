// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {SymbTestToken} from "./SymbTestToken.sol";

/// @notice Permissionless test-only capped ERC20 creator. Tokens have NO monetary value.
/// @dev The creator receives mint permissions. Every asset is UNVERIFIED by default.
contract SymbDemoTokenFactory {
    address[] public createdTokens;
    mapping(address => address) public creatorOf;
    event DemoTokenCreated(address indexed creator, address indexed token, string symbol, uint8 decimals, uint256 initialSupply, uint256 maxSupply);

    constructor() {
        require(block.chainid > 1000 && block.chainid != 4613, "NOT_ISOLATED_TEST_CHAIN");
    }

    function createToken(
        string calldata name,
        string calldata symbol,
        uint8 decimals,
        uint256 initialSupply,
        uint256 maxSupply
    ) external returns (address token) {
        require(bytes(name).length >= 3 && bytes(name).length <= 64, "INVALID_NAME");
        require(bytes(symbol).length >= 2 && bytes(symbol).length <= 14, "INVALID_SYMBOL");
        require(initialSupply > 0 && maxSupply >= initialSupply, "INVALID_SUPPLY");
        // SymbTestToken constructor additionally restricts permitted token decimals and caps.
        SymbTestToken newToken = new SymbTestToken(name, symbol, decimals, maxSupply);
        newToken.mint(msg.sender, initialSupply);
        newToken.transferOwnership(msg.sender);
        token = address(newToken);
        creatorOf[token] = msg.sender;
        createdTokens.push(token);
        emit DemoTokenCreated(msg.sender, token, symbol, decimals, initialSupply, maxSupply);
    }

    function createdTokensLength() external view returns (uint256) { return createdTokens.length; }
}
