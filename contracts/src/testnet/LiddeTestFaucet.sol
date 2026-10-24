// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface ITestAsset {
    function transfer(address,uint256) external returns(bool);
}

/// @notice Rate-limited faucet for valueless devnet assets, including native test gas.
/// @dev Users with ZERO gas require an operator-sponsored claimFor, not claim() transaction.
///      The operator must independently implement rate limits and budget controls.
contract LiddeTestFaucet {
    address public owner;
    uint64 public immutable cooldown;
    uint256 public immutable nativeAmount;
    address[] public assets;
    uint256[] public payouts;
    mapping(address => uint256) public lastClaim;
    mapping(address => bool) public claimed;

    uint256 private unlocked = 1;
    event Claimed(address indexed recipient,address indexed operator,uint256 nativeAmount);
    event OwnershipTransferred(address indexed oldOwner,address indexed next);

    modifier onlyOwner() { require(msg.sender == owner, "NOT_OWNER"); _; }
    modifier lock() { require(unlocked == 1, "REENTRANCY"); unlocked = 0; _; unlocked = 1; }

    constructor(address[] memory tokens,uint256[] memory amounts,uint256 nativePayout,uint64 waitSeconds) {
        require(tokens.length == amounts.length && tokens.length>0 && tokens.length<=8,"BAD_ASSETS");
        require(nativePayout > 0 && nativePayout <= 1 ether,"NATIVE_CAP");
        require(waitSeconds >= 1 hours && waitSeconds <= 30 days, "COOLDOWN_BOUNDS");
        for(uint256 i=0;i<tokens.length;i++){
            require(tokens[i] != address(0) && tokens[i].code.length>0 && amounts[i]>0,"BAD_TOKEN");
            for(uint256 j=0;j<i;j++) require(tokens[j]!=tokens[i],"DUP_TOKEN");
            assets.push(tokens[i]); payouts.push(amounts[i]);
        }
        nativeAmount=nativePayout;cooldown=waitSeconds;owner=msg.sender;
    }

    receive() external payable {}

    function assetCount() external view returns(uint256) { return assets.length; }

    function transferOwnership(address next) external onlyOwner {
        require(next!=address(0),"BAD_OWNER");
        emit OwnershipTransferred(owner,next);owner=next;
    }

    function claim() external lock { _claim(msg.sender); }
    function claimFor(address recipient) external onlyOwner lock { _claim(recipient); }

    function _claim(address recipient) private {
        require(recipient!=address(0) && recipient!=address(this), "BAD_RECIPIENT");
        if(claimed[recipient]) require(block.timestamp >= lastClaim[recipient]+uint256(cooldown),"COOLDOWN");
        require(address(this).balance>=nativeAmount,"EMPTY_NATIVE");
        lastClaim[recipient]=block.timestamp;claimed[recipient]=true;
        for(uint256 i=0;i<assets.length;i++){
            (bool ok,bytes memory data)=assets[i].call(
                abi.encodeWithSelector(ITestAsset.transfer.selector,recipient,payouts[i]));
            require(ok && (data.length==0 || abi.decode(data,(bool))),"EMPTY_TOKEN");
        }
        emit Claimed(recipient,msg.sender,nativeAmount);
        (bool sent,)=payable(recipient).call{value:nativeAmount}("");
        require(sent,"NATIVE_SEND_FAIL");
    }
}
