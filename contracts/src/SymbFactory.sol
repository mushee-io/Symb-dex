// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {SymbPair} from "./SymbPair.sol";

/// @notice Permissionless, fee-immutable factory. No privileged admin keys.
contract SymbFactory {
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint256 pairIndex);

    function allPairsLength() external view returns (uint256) { return allPairs.length; }

    function createPair(address a, address b) external returns (address pair) {
        require(a != b && a != address(0) && b != address(0), "INVALID_TOKENS");
        (address token0, address token1) = a < b ? (a, b) : (b, a);
        require(getPair[token0][token1] == address(0), "PAIR_EXISTS");
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        pair = address(new SymbPair{salt: salt}());
        // Record the new pair before calling its initializer. Any initializer
        // failure reverts the entire transaction and therefore also these writes.
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);
        SymbPair(pair).initialize(token0, token1);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
}
