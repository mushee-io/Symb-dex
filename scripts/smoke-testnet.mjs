// Actual EVM TEST CHAIN transactions: faucet → swap → LP mint → full redemption.
// Never broadcasts on VERY Mainnet. Uses ephemeral tester keys, not user wallets.
import {readFile} from "node:fs/promises";
import {createPublicClient,createWalletClient,http,erc20Abi,parseAbi} from "viem";
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
log.pool=pair;log.steps=log.tx.length;log.status="PASSED";
console.log(JSON.stringify(log,(_k,v)=>typeof v==="bigint"?v.toString():v,2));
