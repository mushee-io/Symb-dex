// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface ILiddeERC20 {
    function balanceOf(address) external view returns (uint256);
    function transfer(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
}

interface ILiddeFactory {
    function getPair(address, address) external view returns (address);
    function createPair(address, address) external returns (address);
}

interface ILiddePair is ILiddeERC20 {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112, uint112, uint32);
    function mint(address to) external returns (uint256);
    function burn(address to) external returns (uint256 amount0, uint256 amount1);
    function swap(uint256 amount0Out, uint256 amount1Out, address to) external;
}

interface ILiddeWrappedVery is ILiddeERC20 {
    function deposit() external payable;
    function withdraw(uint256) external;
}
