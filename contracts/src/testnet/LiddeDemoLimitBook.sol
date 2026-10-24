// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @notice Non-custodial-at-rest wallet custody until signed deposit; demo ERC20 order escrow
///         and atomic test-only peer fills. No off-chain phantom fills or keeper dependency.
/// @dev WARNING: unaudited experimental test contracts. All underlying assets must be FAKE.
contract LiddeDemoLimitBook {
    struct Order {
        address maker;
        address sellToken;
        address buyToken;
        uint128 initialSell;
        uint128 initialBuy;
        uint128 remainingSell;
        uint128 remainingBuy;
        uint64 expiry;
        bool cancelled;
    }
    uint256 public nextOrderId = 1;
    mapping(address => bool) public approvedToken;
    mapping(uint256 => Order) public orders;
    uint256 private unlocked = 1;
    event OrderCreated(uint256 indexed id, address indexed maker, address indexed sellToken, address buyToken, uint256 sellAmount, uint256 buyAmount, uint64 expiry);
    event OrderFilled(uint256 indexed id, address indexed taker, uint256 sellReceived, uint256 buyPaid, uint256 sellRemaining, uint256 buyRemaining);
    event OrderCancelled(uint256 indexed id, uint256 returnedToMaker);
    modifier nonReentrant() { require(unlocked == 1, "REENTRANCY"); unlocked = 0; _; unlocked = 1; }

    constructor(address[] memory approvedAssets) {
        require(block.chainid > 1000 && block.chainid != 4613, "NOT_ISOLATED_TEST_CHAIN");
        require(approvedAssets.length >= 2 && approvedAssets.length <= 16, "INVALID_ASSET_COUNT");
        for (uint256 i = 0; i < approvedAssets.length; i++) {
            address asset = approvedAssets[i];
            require(asset != address(0) && asset.code.length > 0 && !approvedToken[asset], "INVALID_ASSET");
            approvedToken[asset] = true;
        }
    }

    function _balance(address token, address wallet) private view returns (uint256 result) {
        (bool ok, bytes memory data) = token.staticcall(abi.encodeWithSignature("balanceOf(address)", wallet));
        require(ok && data.length == 32, "BAD_TOKEN_BALANCE");
        result = abi.decode(data, (uint256));
    }
    function _checkedCall(address token, bytes memory data) private {
        require(token.code.length > 0, "TOKEN_NOT_CONTRACT");
        (bool ok, bytes memory result) = token.call(data);
        require(ok && (result.length == 0 || (result.length == 32 && abi.decode(result,(bool)))), "TOKEN_TRANSFER_FAILED");
    }
    function _pull(address token, address from, uint256 amount) private {
        uint256 beforeBalance = _balance(token, address(this));
        _checkedCall(token, abi.encodeWithSignature("transferFrom(address,address,uint256)",from,address(this),amount));
        require(_balance(token,address(this)) == beforeBalance + amount, "FEE_ON_TRANSFER_UNSUPPORTED");
    }
    function _push(address token, address to, uint256 amount) private {
        uint256 beforeBalance = _balance(token, to);
        _checkedCall(token, abi.encodeWithSignature("transfer(address,uint256)",to,amount));
        require(_balance(token,to) == beforeBalance + amount, "FEE_ON_TRANSFER_UNSUPPORTED");
    }

    function createOrder(
        address sellToken, address buyToken, uint128 sellAmount, uint128 buyAmount, uint64 expiry
    ) external nonReentrant returns (uint256 id) {
        require(sellToken != buyToken && sellToken != address(0) && buyToken != address(0), "INVALID_MARKET");
        require(approvedToken[sellToken] && approvedToken[buyToken], "UNREVIEWED_TOKEN");
        require(sellAmount > 0 && buyAmount > 0, "ZERO_ORDER");
        require(block.timestamp < expiry && expiry <= block.timestamp + 30 days, "INVALID_EXPIRY");
        _pull(sellToken, msg.sender, sellAmount);
        id = nextOrderId++;
        orders[id] = Order(msg.sender,sellToken,buyToken,sellAmount,buyAmount,sellAmount,buyAmount,expiry,false);
        emit OrderCreated(id,msg.sender,sellToken,buyToken,sellAmount,buyAmount,expiry);
    }

    function fill(uint256 id,uint128 receiveSellAmount) external nonReentrant returns (uint128 payAmount) {
        Order storage o = orders[id];
        require(o.maker != address(0) && !o.cancelled && o.remainingSell > 0, "ORDER_CLOSED");
        require(block.timestamp < o.expiry, "ORDER_EXPIRED");
        require(msg.sender != o.maker, "MAKER_CANNOT_FILL");
        require(receiveSellAmount > 0 && receiveSellAmount <= o.remainingSell, "INVALID_FILL");
        // uint128 * uint128 plus uint128 cannot overflow uint256.
        uint256 quote = receiveSellAmount == o.remainingSell
            ? uint256(o.remainingBuy)
            : (uint256(receiveSellAmount) * uint256(o.remainingBuy) + uint256(o.remainingSell) - 1) / uint256(o.remainingSell);
        require(quote > 0 && quote <= o.remainingBuy, "INVALID_FILL_QUOTE");
        payAmount = uint128(quote);
        o.remainingSell -= receiveSellAmount;
        o.remainingBuy -= payAmount;
        _pull(o.buyToken,msg.sender,payAmount);
        _push(o.buyToken,o.maker,payAmount);
        _push(o.sellToken,msg.sender,receiveSellAmount);
        emit OrderFilled(id,msg.sender,receiveSellAmount,payAmount,o.remainingSell,o.remainingBuy);
    }

    function cancel(uint256 id) external nonReentrant {
        Order storage o = orders[id];
        require(o.maker == msg.sender, "NOT_MAKER");
        require(!o.cancelled && o.remainingSell > 0, "ORDER_CLOSED");
        uint128 remaining = o.remainingSell;
        o.cancelled = true;
        o.remainingSell = 0;
        o.remainingBuy = 0;
        _push(o.sellToken,msg.sender,remaining);
        emit OrderCancelled(id,remaining);
    }
}
