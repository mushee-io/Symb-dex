// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @notice Supply-capped synthetic ERC20; has NO cash value and cannot represent real assets.
/// @dev Independent implementation because the production LP token fixes decimals at 18.
contract SymbTestToken {
    string public name;
    string public symbol;
    uint8 public immutable decimals;
    uint256 public immutable maxSupply;
    uint256 public totalSupply;
    address public owner;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() { require(msg.sender == owner, "NOT_OWNER"); _; }

    constructor(string memory name_,string memory symbol_,uint8 decimals_,uint256 limit) {
        require(bytes(name_).length > 0 && bytes(symbol_).length >= 2, "BAD_METADATA");
        require(bytes(symbol_)[0] == bytes1("t"), "TEST_PREFIX_REQUIRED");
        require(decimals_ == 6 || decimals_ == 8 || decimals_ == 18, "UNSUPPORTED_DECIMALS");
        require(limit > 0 && limit <= type(uint192).max, "BAD_SUPPLY_CAP");
        name = name_; symbol = symbol_; decimals = decimals_; maxSupply = limit;
        owner = msg.sender;
    }

    function mint(address recipient,uint256 amount) external onlyOwner {
        require(recipient != address(0) && amount > 0, "BAD_MINT");
        require(totalSupply + amount <= maxSupply, "SUPPLY_CAP");
        totalSupply += amount; balanceOf[recipient] += amount;
        emit Transfer(address(0),recipient,amount);
    }
    function transferOwnership(address next) external onlyOwner {
        require(next != address(0), "BAD_OWNER");
        emit OwnershipTransferred(owner,next);
        owner = next;
    }
    function approve(address spender,uint256 amount) external returns(bool) {
        require(spender != address(0), "BAD_SPENDER");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender,spender,amount);
        return true;
    }
    function transfer(address to,uint256 amount) external returns(bool) {
        _move(msg.sender,to,amount);
        return true;
    }
    function transferFrom(address from,address to,uint256 amount) external returns(bool) {
        uint256 available = allowance[from][msg.sender];
        require(available >= amount, "INSUFFICIENT_ALLOWANCE");
        if(available != type(uint256).max) {
            unchecked { allowance[from][msg.sender] = available - amount; }
            emit Approval(from,msg.sender,allowance[from][msg.sender]);
        }
        _move(from,to,amount);
        return true;
    }
    function _move(address from,address to,uint256 amount) private {
        require(to != address(0), "INVALID_RECIPIENT");
        require(balanceOf[from] >= amount, "INSUFFICIENT_BALANCE");
        unchecked { balanceOf[from] -= amount; }
        balanceOf[to] += amount;
        emit Transfer(from,to,amount);
    }
}
