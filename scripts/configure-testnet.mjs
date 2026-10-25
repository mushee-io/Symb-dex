// M10.1–10.6: read and verify ACTUAL Foundry receipts before writing demo config.
// Never deploys or sends transactions, never reads a wallet private key.
import {readFile,writeFile} from "node:fs/promises";
import {execFileSync} from "node:child_process";
import {createPublicClient,http,parseAbi,erc20Abi,getAddress} from "viem";
import {validateTestnet} from "../lib/testnet/config.mjs";
import {deploymentAddresses} from "../lib/testnet/deployment-config.mjs";

const expected=Number(process.env.TESTNET_EXPECTED_CHAIN_ID);
const rpc=process.env.TESTNET_RPC_URL??"http://127.0.0.1:8545";
const explorer=process.env.TESTNET_EXPLORER_URL??"http://127.0.0.1:8545";
const isLocal=new URL(rpc).hostname==="localhost"||new URL(rpc).hostname==="127.0.0.1";
if(!Number.isSafeInteger(expected)||expected<=1000||[1,4613].includes(expected))
 throw new Error("Refusing unknown or mainnet test chain ID.");
if(!isLocal && new URL(rpc).protocol!=="https:")
 throw new Error("Public test RPC must use HTTPS.");
const file=new URL("../broadcast/TestnetDeploy.s.sol/"+expected+"/run-latest.json",import.meta.url);
const broadcast=JSON.parse(await readFile(file,"utf8"));
const discovered=deploymentAddresses(broadcast.transactions);
const chainClient=createPublicClient({transport:http(rpc,{timeout:10000,retryCount:1})});
if(await chainClient.getChainId()!==expected)throw new Error("Broadcast chain and RPC chain mismatch.");
const getCode=async address=>{
 const code=await chainClient.getBytecode({address});
 if(!code||code==="0x")throw new Error("No deployed contract code at "+address);
};
for(const address of [discovered.factory,discovered.router,discovered.wrappedTestNative,discovered.faucet,
 ...discovered.tokens.map(x=>x.address),...(discovered.tokenCreator?[discovered.tokenCreator,discovered.limitBook]:[])])await getCode(address);
const routerAbi=parseAbi(["function factory() view returns (address)","function WETH() view returns (address)"]);
const pairAbi=parseAbi(["function getPair(address,address) view returns(address)"]);
const faucetAbi=parseAbi(["function owner() view returns (address)"]);
const [factory,wrapper,owner]=await Promise.all([
 chainClient.readContract({address:discovered.router,abi:routerAbi,functionName:"factory"}),
 chainClient.readContract({address:discovered.router,abi:routerAbi,functionName:"WETH"}),
 chainClient.readContract({address:discovered.faucet,abi:faucetAbi,functionName:"owner"})
]);
if(factory.toLowerCase()!==discovered.factory.toLowerCase() ||
 wrapper.toLowerCase()!==discovered.wrappedTestNative.toLowerCase())
 throw new Error("Router constructor points to wrong Factory or wrapper.");
if(!getAddress(owner))throw new Error("No verified faucet owner.");
for(const token of discovered.tokens) {
 const [symbol,precision]=await Promise.all([
  chainClient.readContract({address:token.address,abi:erc20Abi,functionName:"symbol"}),
  chainClient.readContract({address:token.address,abi:erc20Abi,functionName:"decimals"}),
 ]);
 if(symbol!==token.symbol||precision!==token.decimals)
  throw new Error("Unexpected demo token metadata for "+token.symbol);
}
for(const pair of [["tUSD","tBTC"],["tUSD","tVERY"]]){
 const a=discovered.tokens.find(x=>x.symbol==="tUSD").address;
 const b=pair[1]==="tBTC"?discovered.tokens.find(x=>x.symbol==="tBTC").address:discovered.wrappedTestNative;
 const resolved=await chainClient.readContract({address:discovered.factory,abi:pairAbi,
  functionName:"getPair",args:[a,b]});
 await getCode(resolved);
}
const sourceCommit=execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();
const network={
 status:"configured",chainId:expected,
 name:process.env.TESTNET_NETWORK_NAME??"Symb Isolated Development Network",
 rpcUrl:rpc,explorerUrl:explorer,
 nativeCurrency:{name:"Test Gas Token",symbol:"tVERY",decimals:18},
 isOfficialVeryTestnet:false,officialVerificationReference:null,realFundsAllowed:false,
};
const deployments={status:"configured",chainId:expected,...discovered,feeBps:30,
 realFundsAllowed:false,deploymentSourceCommit:sourceCommit};
const assessment=validateTestnet({network,deployments});
if(!assessment.ready)throw new Error("Invalid test deployment: "+assessment.errors.join("; "));
console.log(JSON.stringify({network:network.name,chainId:expected,contracts:discovered,sourceCommit,verification:"PASSED"},null,2));
if(process.argv.includes("--verify-only")){
 console.log("Verified only. No configuration files were changed.");
}else{
 if(process.env.TESTNET_CONFIG_APPROVE!=="yes-local-test-only")
  throw new Error("Explicit TESTNET_CONFIG_APPROVE=yes-local-test-only required to write files.");
 await writeFile(new URL("../config/networks.testnet.json",import.meta.url),JSON.stringify(network,null,2)+"\n");
 await writeFile(new URL("../config/deployments.testnet.json",import.meta.url),JSON.stringify(deployments,null,2)+"\n");
 console.log("Verified test-only addresses saved. Restart/rebuild frontend to enable testnet wallet routes.");
}
