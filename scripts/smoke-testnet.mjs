// Actual EVM TEST CHAIN transactions: faucet → swap → LP mint → full redemption.
// Never broadcasts on VERY Mainnet. Uses ephemeral tester keys, not user wallets.
import {readFile} from "node:fs/promises";
import {createPublicClient,createWalletClient,http,erc20Abi,parseAbi,parseEventLogs} from "viem";
import {privateKeyToAccount,generatePrivateKey} from "viem/accounts";
import {deploymentAddresses} from "../lib/testnet/deployment-config.mjs";
const chainId=Number(process.env.TESTNET_EXPECTED_CHAIN_ID);
const rpc=process.env.TESTNET_RPC_URL??"http://127.0.0.1:8545";
const key=process.env.TESTNET_DEPLOYER_PRIVATE_KEY;
if(!Number.isSafeInteger(chainId)||chainId<=1000||[1,4613].includes(chainId)||
 !/^0x[0-9a-fA-F]{64}$/.test(key??""))throw new Error("TEST CHAIN signer and chain ID required.");
if(!["localhost","127.0.0.1"].includes(new URL(rpc).hostname)&&new URL(rpc).protocol!=="https:")
 throw new Error("Refusing insecure remote testnet RPC.");
const source=JSON.parse(await readFile(new URL("../broadcast/TestnetDeploy.s.sol/"+chainId+"/run-latest.json",import.meta.url),"utf8"));
const d=deploymentAddresses(source.transactions);
const client=createPublicClient({transport:http(rpc,{timeout:15000})});
if(await client.getChainId()!==chainId)throw new Error("Smoke-test refuses wrong chain.");
const owner=privateKeyToAccount(key);
const tester=privateKeyToAccount(generatePrivateKey());
const ownerWallet=createWalletClient({account:owner,transport:http(rpc)});
const wallet=createWalletClient({account:tester,transport:http(rpc)});
const faucetAbi=parseAbi(["function owner() view returns(address)","function claimFor(address recipient)"]);
const routerAbi=parseAbi([
 "function addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256) returns(uint256,uint256,uint256)",
 "function removeLiquidity(address,address,uint256,uint256,uint256,address,uint256) returns(uint256,uint256)",
 "function swapExactTokensForTokens(uint256,uint256,address[],address,uint256) returns(uint256[])",
 "function swapExactETHForTokens(uint256,address[],address,uint256) payable returns(uint256[])"
]);
const factoryAbi=parseAbi(["function getPair(address,address) view returns(address)"]);
const pairAbi=parseAbi(["function balanceOf(address) view returns(uint256)","function getReserves() view returns(uint112,uint112,uint32)","function totalSupply() view returns(uint256)"]);
const token=s=>d.tokens.find(x=>x.symbol===s).address;
const tUSD=token("tUSD"),tUSDC=token("tUSDC"),tBTC=token("tBTC");
const contracts=[d.factory,d.router,d.faucet,d.wrappedTestNative,tUSD,tUSDC,tBTC];
for(const address of contracts)if(!(await client.getBytecode({address})))throw new Error("Missing bytecode: "+address);
if((await client.readContract({address:d.faucet,abi:faucetAbi,functionName:"owner"})).toLowerCase()!==owner.address.toLowerCase())
 throw new Error("Deployer is not faucet owner; do not sign.");
async function tx(signer,address,abi,functionName,args,value){
 const sim=await client.simulateContract({account:signer.account,address,abi,functionName,args,value});
 const hash=await signer.writeContract(sim.request);
 const receipt=await client.waitForTransactionReceipt({hash,timeout:120000,confirmations:1});
 if(receipt.status!=="success")throw new Error("Demo transaction reverted: "+hash);
 return {hash,block:receipt.blockNumber};
}
const deadline=()=>BigInt(Math.floor(Date.now()/1000)+1800);
const log={chainId,tester:tester.address,tx:[]};
let result=await tx(ownerWallet,d.faucet,faucetAbi,"claimFor",[tester.address]);
log.tx.push({step:"gasless-faucet",...result});
const native=await client.getBalance({address:tester.address});
const usd=await client.readContract({address:tUSD,abi:erc20Abi,functionName:"balanceOf",args:[tester.address]});
if(native<=0n||usd<100e6)throw new Error("Test wallet did not receive free tokens/gas");
result=await tx(wallet,tUSD,erc20Abi,"approve",[d.router,10e6]);
log.tx.push({step:"swap-approval",...result});
result=await tx(wallet,d.router,routerAbi,"swapExactTokensForTokens",
 [10e6,1n,[tUSD,tBTC],tester.address,deadline()]);
log.tx.push({step:"token-token-swap",...result});
result=await tx(wallet,d.router,routerAbi,"swapExactETHForTokens",
 [1n,[d.wrappedTestNative,tUSD],tester.address,deadline()],10n**14n);
log.tx.push({step:"native-token-swap",...result});
for(const [addr,amt] of [[tUSDC,20e6],[tBTC,1e6]]){
 result=await tx(wallet,addr,erc20Abi,"approve",[d.router,amt]);
 log.tx.push({step:"lp-approval",...result});
}
result=await tx(wallet,d.router,routerAbi,"addLiquidity",
 [tUSDC,tBTC,20e6,1e6,1n,1n,tester.address,deadline()]);
log.tx.push({step:"create-and-add-liquidity",...result});
const pair=await client.readContract({address:d.factory,abi:factoryAbi,functionName:"getPair",args:[tUSDC,tBTC]});
if(!(await client.getBytecode({address:pair})))throw new Error("No new demo pool created.");
const lp=await client.readContract({address:pair,abi:pairAbi,functionName:"balanceOf",args:[tester.address]});
if(lp<=0n)throw new Error("Minted LP balance missing.");
result=await tx(wallet,pair,erc20Abi,"approve",[d.router,lp]);
log.tx.push({step:"lp-burn-approval",...result});
result=await tx(wallet,d.router,routerAbi,"removeLiquidity",
 [tUSDC,tBTC,lp,1n,1n,tester.address,deadline()]);
log.tx.push({step:"full-lp-withdrawal",...result});
const lpAfter=await client.readContract({address:pair,abi:pairAbi,functionName:"balanceOf",args:[tester.address]});
if(lpAfter!==0n)throw new Error("Wallet could not fully exit test LP.");

if(!d.tokenCreator||!d.limitBook)throw new Error("Advanced contracts missing from verified Foundry broadcast.");
const creatorAbi=parseAbi([
 "function createToken(string,string,uint8,uint256,uint256) returns(address)",
 "function creatorOf(address) view returns(address)",
 "event DemoTokenCreated(address indexed creator,address indexed token,string symbol,uint8 decimals,uint256 initialSupply,uint256 maxSupply)"
]);
const bookAbi=parseAbi([
 "function createOrder(address,address,uint128,uint128,uint64) returns(uint256)",
 "function fill(uint256,uint128) returns(uint128)",
 "function cancel(uint256)",
 "function orders(uint256) view returns(address,address,address,uint128,uint128,uint128,uint128,uint64,bool)"
]);
for(const contract of [d.tokenCreator,d.limitBook])
 if(!(await client.getBytecode({address:contract})))throw new Error("Missing deployed advanced test contract.");
result=await tx(wallet,d.tokenCreator,creatorAbi,"createToken",
 ["Externally made test token","tGEM",18,1000n*10n**18n,10000n*10n**18n]);
log.tx.push({step:"create-unverified-demo-token",...result});
const tokenReceipt=await client.getTransactionReceipt({hash:result.hash});
const tokenEvents=parseEventLogs({abi:creatorAbi,eventName:"DemoTokenCreated",logs:tokenReceipt.logs,strict:true});
const created=tokenEvents.find(ev=>ev.address.toLowerCase()===d.tokenCreator.toLowerCase());
if(!created || created.args.creator.toLowerCase()!==tester.address.toLowerCase())
 throw new Error("Demo ERC20 creator event missing.");
const custom=created.args.token;
const actualCreator=await client.readContract({address:d.tokenCreator,abi:creatorAbi,functionName:"creatorOf",args:[custom]});
if(actualCreator.toLowerCase()!==tester.address.toLowerCase())throw new Error("Custom token issuer mismatch.");
result=await tx(wallet,tUSD,erc20Abi,"approve",[d.router,100e6]);
log.tx.push({step:"custom-pool-base-approval",...result});
result=await tx(wallet,custom,erc20Abi,"approve",[d.router,100n*10n**18n]);
log.tx.push({step:"custom-pool-token-approval",...result});
result=await tx(wallet,d.router,routerAbi,"addLiquidity",
 [custom,tUSD,100n*10n**18n,100e6,1n,1n,tester.address,deadline()]);
log.tx.push({step:"user-created-token-pool",...result});
const customPair=await client.readContract({address:d.factory,abi:factoryAbi,functionName:"getPair",args:[custom,tUSD]});
if(!(await client.getBytecode({address:customPair})))throw new Error("Custom token LP pair missing.");
const customLP=await client.readContract({address:customPair,abi:pairAbi,functionName:"balanceOf",args:[tester.address]});
if(customLP<=0n)throw new Error("Custom pool LP not minted");
result=await tx(wallet,customPair,erc20Abi,"approve",[d.router,customLP]);
log.tx.push({step:"custom-pool-lp-approval",...result});
result=await tx(wallet,d.router,routerAbi,"removeLiquidity",
 [custom,tUSD,customLP,1n,1n,tester.address,deadline()]);
log.tx.push({step:"custom-pool-lp-withdrawal",...result});
if(await client.readContract({address:customPair,abi:pairAbi,functionName:"balanceOf",args:[tester.address]})!==0n)
 throw new Error("User-created token LP still locked after exit.");

result=await tx(wallet,tUSD,erc20Abi,"approve",[d.limitBook,20e6]);
log.tx.push({step:"limit-order-maker-approval",...result});
result=await tx(wallet,d.limitBook,bookAbi,"createOrder",
 [tUSD,tBTC,20e6,2e6,BigInt(Math.floor(Date.now()/1000)+3600)]);
log.tx.push({step:"onchain-limit-order-create",...result});
result=await tx(ownerWallet,tBTC,erc20Abi,"approve",[d.limitBook,1e6]);
log.tx.push({step:"limit-order-taker-approval",...result});
result=await tx(ownerWallet,d.limitBook,bookAbi,"fill",[1n,10e6]);
log.tx.push({step:"onchain-limit-order-partial-fill",...result});
result=await tx(wallet,d.limitBook,bookAbi,"cancel",[1n]);
log.tx.push({step:"onchain-limit-order-cancel-refund",...result});
const state=await client.readContract({address:d.limitBook,abi:bookAbi,functionName:"orders",args:[1n]});
if(!state[8]||state[5]!==0n||state[6]!==0n)
 throw new Error("Cancelled limit order retains live or unrefunded escrow.");
log.customToken=custom;log.customPair=customPair;log.orderId="1";

log.pool=pair;log.steps=log.tx.length;log.status="PASSED";
console.log(JSON.stringify(log,(_k,v)=>typeof v==="bigint"?v.toString():v,2));
