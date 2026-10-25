// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import {SymbTestToken} from "../src/testnet/SymbTestToken.sol";
import {SymbTestFaucet} from "../src/testnet/SymbTestFaucet.sol";
import {SymbFactory} from "../src/SymbFactory.sol";
import {SymbRouter} from "../src/SymbRouter.sol";
import {SymbWrappedVery} from "../src/SymbWrappedVery.sol";
import {SymbPair} from "../src/SymbPair.sol";

interface VmT { function deal(address,uint256) external; function prank(address) external; function warp(uint256) external; }
contract SymbTestnetTest {
    VmT constant vm=VmT(address(uint160(uint256(keccak256("hevm cheat code")))));
    address constant ALICE=address(0xA11CE);
    address constant BOB=address(0xB0B);
    SymbTestToken tUSD;
    SymbTestToken tBTC;
    SymbTestFaucet faucet;
    SymbFactory factory;
    SymbRouter router;
    SymbWrappedVery wrapped;

    function setUp() public {
        tUSD=new SymbTestToken("Symb test USD","tUSD",6,1_000_000_000e6);
        tBTC=new SymbTestToken("Symb test BTC","tBTC",8,21_000_000e8);
        address[] memory assets=new address[](2);
        assets[0]=address(tUSD);assets[1]=address(tBTC);
        uint256[] memory payouts=new uint256[](2);
        payouts[0]=1_000e6;payouts[1]=1e7;
        faucet=new SymbTestFaucet(assets,payouts,0.01 ether,24 hours);
        tUSD.mint(address(faucet),100_000e6);
        tBTC.mint(address(faucet),10e8);
        vm.deal(address(faucet),10 ether);
        factory=new SymbFactory();
        wrapped=new SymbWrappedVery();
        router=new SymbRouter(address(factory),address(wrapped));
    }
    function testGaslessOperatorClaimAndCooldown() public {
        faucet.claimFor(ALICE);
        require(ALICE.balance==0.01 ether,"MISSING_GAS");
        require(tUSD.balanceOf(ALICE)==1000e6 && tBTC.balanceOf(ALICE)==1e7,"MISSING_TOKENS");
        (bool repeat,)=address(faucet).call(abi.encodeWithSelector(faucet.claimFor.selector,ALICE));
        require(!repeat,"COOLDOWN_BYPASS");
        vm.warp(block.timestamp+24 hours);
        faucet.claimFor(ALICE);
        require(ALICE.balance==0.02 ether,"SECOND_CLAIM");
    }
    function testNonOwnerCannotSponsor() public {
        vm.prank(BOB);
        (bool ok,)=address(faucet).call(abi.encodeWithSelector(faucet.claimFor.selector,ALICE));
        require(!ok,"UNAUTHORIZED_SPONSOR");
    }
    function testUserClaimAfterReceivingGas() public {
        vm.deal(BOB,0.5 ether);
        vm.prank(BOB);
        faucet.claim();
        require(tUSD.balanceOf(BOB)==1000e6,"SELF_CLAIM");
    }
    function testFaucetFailsAtomicallyWithoutInventory() public {
        tUSD=new SymbTestToken("Empty USD","tUSD",6,100e6);
        address[] memory assets=new address[](1);
        assets[0]=address(tUSD);
        uint256[] memory amounts=new uint256[](1);
        amounts[0]=1e6;
        SymbTestFaucet empty=new SymbTestFaucet(assets,amounts,0.01 ether,1 hours);
        vm.deal(address(empty),1 ether);
        (bool ok,)=address(empty).call(abi.encodeWithSelector(empty.claimFor.selector,ALICE));
        require(!ok && !empty.claimed(ALICE) && ALICE.balance==0,"PARTIAL_CLAIM");
    }
    function testMintCapAndOwner() public {
        (bool fail,)=address(tBTC).call(abi.encodeWithSelector(tBTC.mint.selector,ALICE,21_000_000e8));
        require(!fail,"CAP_BYPASS");
        vm.prank(BOB);
        (bool other,)=address(tUSD).call(abi.encodeWithSelector(tUSD.mint.selector,BOB,1));
        require(!other,"OWNER_BYPASS");
    }
    function testFaucetToSwapAndLP() public {
        faucet.claimFor(ALICE);
        faucet.claimFor(BOB);
        vm.prank(ALICE);tUSD.approve(address(router),type(uint256).max);
        vm.prank(ALICE);tBTC.approve(address(router),type(uint256).max);
        vm.prank(BOB);tUSD.approve(address(router),type(uint256).max);
        vm.prank(ALICE);
        router.addLiquidity(address(tUSD),address(tBTC),200e6,2e6,1,1,ALICE,block.timestamp);
        address pairAddr=factory.getPair(address(tUSD),address(tBTC));
        require(pairAddr!=address(0),"PAIR_NOT_CREATED");
        address[] memory path=new address[](2);
        path[0]=address(tUSD);path[1]=address(tBTC);
        vm.prank(BOB);
        uint256[] memory amounts=router.swapExactTokensForTokens(10e6,1,path,BOB,block.timestamp);
        require(amounts[1]>0 && tBTC.balanceOf(BOB)>1e7,"SWAP_NOT_EXECUTED");
        uint256 lp=SymbPair(pairAddr).balanceOf(ALICE);
        vm.prank(ALICE);SymbPair(pairAddr).approve(address(router),lp);
        vm.prank(ALICE);
        (uint256 a,uint256 b)=router.removeLiquidity(address(tUSD),address(tBTC),lp,1,1,ALICE,block.timestamp);
        require(a>0 && b>0,"LP_NOT_WITHDRAWN");
        require(SymbPair(pairAddr).balanceOf(ALICE)==0,"LP_REMAINS");
    }
}
