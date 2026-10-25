// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import {SymbDemoTokenFactory} from "../src/testnet/SymbDemoTokenFactory.sol";
import {SymbDemoLimitBook} from "../src/testnet/SymbDemoLimitBook.sol";
import {SymbTestToken} from "../src/testnet/SymbTestToken.sol";
import {SymbFactory} from "../src/SymbFactory.sol";
import {SymbRouter} from "../src/SymbRouter.sol";
import {SymbWrappedVery} from "../src/SymbWrappedVery.sol";
import {SymbPair} from "../src/SymbPair.sol";

interface VmAdvanced { function prank(address) external; function warp(uint256) external; }
contract SymbDemoAdvancedTest {
    VmAdvanced constant vm=VmAdvanced(address(uint160(uint256(keccak256("hevm cheat code")))));
    address constant ALICE=address(0xA11CE);
    address constant BOB=address(0xB0B);
    SymbDemoTokenFactory creator;
    SymbDemoLimitBook book;
    SymbTestToken usd;
    SymbTestToken btc;
    SymbFactory factory;
    SymbRouter router;

    function setUp() public {
        creator = new SymbDemoTokenFactory();
        usd = new SymbTestToken("Test Dollar","tUSD",6,100_000_000e6);
        btc = new SymbTestToken("Test Bitcoin","tBTC",8,21_000_000e8);
        address[] memory allowlist=new address[](2);
        allowlist[0]=address(usd);allowlist[1]=address(btc);
        book = new SymbDemoLimitBook(allowlist);
        usd.mint(ALICE,100000e6);
        btc.mint(BOB,10e8);
        factory=new SymbFactory();
        SymbWrappedVery wrapped=new SymbWrappedVery();
        router=new SymbRouter(address(factory),address(wrapped));
    }
    function testFactoryOwnerAndCap() public {
        vm.prank(ALICE);
        address token=creator.createToken("User-created test gem","tGEM",18,1000e18,10000e18);
        require(creator.creatorOf(token)==ALICE,"CREATOR_NOT_RECORDED");
        require(SymbTestToken(token).owner()==ALICE,"OWNER_NOT_TRANSFERRED");
        require(SymbTestToken(token).balanceOf(ALICE)==1000e18,"MINT_MISSING");
        require(creator.createdTokensLength()==1,"DIRECTORY_MISSING");
        vm.prank(BOB);
        (bool unauthorized,)=token.call(abi.encodeWithSelector(SymbTestToken.mint.selector,BOB,1e18));
        require(!unauthorized,"UNAUTHORIZED_MINT");
        vm.prank(ALICE);
        (bool badcap,)=token.call(abi.encodeWithSelector(SymbTestToken.mint.selector,ALICE,10001e18));
        require(!badcap,"MINT_CAP_BYPASS");
    }
    function testCreatorTokenCanBePooledAndRedeemed() public {
        vm.prank(ALICE);
        address custom=creator.createToken("Test user gem","tGEM",18,2000e18,2000e18);
        vm.prank(ALICE);usd.approve(address(router),100e6);
        vm.prank(ALICE);SymbTestToken(custom).approve(address(router),100e18);
        vm.prank(ALICE);
        router.addLiquidity(address(usd),custom,100e6,100e18,1,1,ALICE,block.timestamp);
        address p=factory.getPair(address(usd),custom);
        require(p!=address(0),"MISSING_POOL");
        uint256 lp=SymbPair(p).balanceOf(ALICE);
        require(lp>0,"MISSING_LP");
        vm.prank(ALICE);SymbPair(p).approve(address(router),lp);
        vm.prank(ALICE);
        (uint256 a,uint256 b)=router.removeLiquidity(address(usd),custom,lp,1,1,ALICE,block.timestamp);
        require(a>0&&b>0,"LP_EXIT_FAILED");
        require(SymbPair(p).balanceOf(ALICE)==0,"LP_NOT_EXITED");
    }
    function testLimitOrderPartialFillAndCancellation() public {
        vm.prank(ALICE);usd.approve(address(book),100e6);
        vm.prank(ALICE);
        uint256 id=book.createOrder(address(usd),address(btc),100e6,1e7,uint64(block.timestamp+1 days));
        require(id==1,"BAD_ORDER_ID");
        vm.prank(BOB);btc.approve(address(book),1e7);
        vm.prank(BOB);
        uint128 paid=book.fill(id,40e6);
        require(paid==4e6,"INCORRECT_PARTIAL_QUOTE");
        require(usd.balanceOf(BOB)==40e6,"NOT_RECEIVED");
        require(btc.balanceOf(ALICE)==4e6,"MAKER_NOT_PAID");
        vm.prank(ALICE);
        book.cancel(id);
        require(usd.balanceOf(ALICE)==(100000e6-40e6),"UNEXPECTED_MAKER_BALANCE");
        (, , , , , uint128 remaining, , , bool cancelled)=book.orders(id);
        require(remaining==0&&cancelled,"ORDER_NOT_CLOSED");
        vm.prank(BOB);
        (bool repeat,)=address(book).call(abi.encodeWithSelector(book.fill.selector,id,1e6));
        require(!repeat,"CANCELLED_ORDER_FILLED");
    }
    function testFullLimitOrderFillAndReplayFailure() public {
        vm.prank(ALICE);usd.approve(address(book),100e6);
        vm.prank(ALICE);
        uint256 id=book.createOrder(address(usd),address(btc),100e6,10e6,uint64(block.timestamp+1 days));
        vm.prank(BOB);btc.approve(address(book),10e6);
        vm.prank(BOB);book.fill(id,100e6);
        require(usd.balanceOf(BOB)==100e6,"BUYER_NOT_RECEIVED");
        require(btc.balanceOf(ALICE)==10e6,"SELLER_NOT_PAID");
        vm.prank(BOB);
        (bool repeat,)=address(book).call(abi.encodeWithSelector(book.fill.selector,id,1e6));
        require(!repeat,"REPLAY_SUCCEEDED");
    }
    function testOnlyMakerCanCancelAndExpiredCannotFill() public {
        vm.prank(ALICE);usd.approve(address(book),100e6);
        vm.prank(ALICE);
        uint256 id=book.createOrder(address(usd),address(btc),100e6,10e6,uint64(block.timestamp+1 hours));
        vm.prank(BOB);
        (bool theft,)=address(book).call(abi.encodeWithSelector(book.cancel.selector,id));
        require(!theft,"CANCEL_THEFT");
        vm.warp(block.timestamp+1 hours);
        vm.prank(BOB);
        (bool late,)=address(book).call(abi.encodeWithSelector(book.fill.selector,id,1e6));
        require(!late,"EXPIRED_FILL");
        vm.prank(ALICE);book.cancel(id);
        require(usd.balanceOf(ALICE)==100000e6,"EXPIRED_REFUND_FAILED");
    }
}
