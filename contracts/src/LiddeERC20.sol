// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @notice Dependency-free, original ERC-20 primitive for LP shares and wrapped native assets.
/// @dev LP locking requires _mint(address(0), MINIMUM_LIQUIDITY); never use as a general ERC-20 template.
abstract contract LiddeERC20 {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory tokenName, string memory tokenSymbol) {
        name = tokenName;
        symbol = tokenSymbol;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        require(spender != address(0), "INVALID_SPENDER");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 granted = allowance[from][msg.sender];
        if (granted != type(uint256).max) {
            require(granted >= amount, "INSUFFICIENT_ALLOWANCE");
            unchecked { allowance[from][msg.sender] = granted - amount; }
            emit Approval(from, msg.sender, allowance[from][msg.sender]);
        }
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0) && to != address(0), "INVALID_TRANSFER");
        uint256 current = balanceOf[from];
        require(current >= amount, "INSUFFICIENT_BALANCE");
        unchecked { balanceOf[from] = current - amount; }
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        // to==0 is intentionally supported solely for the permanently locked initial LP supply.
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        require(from != address(0), "INVALID_BURN");
        uint256 current = balanceOf[from];
        require(current >= amount, "INSUFFICIENT_BALANCE");
        unchecked { balanceOf[from] = current - amount; }
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }
}
