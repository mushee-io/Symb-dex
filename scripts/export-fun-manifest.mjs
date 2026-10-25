// Export NONSECRET verified chain fingerprints for Lidde Fun. No fake addresses.
import {readFile} from "node:fs/promises";
import {createPublicClient,http,keccak256,getAddress,parseAbi} from "viem";
import {validateTestnet} from "../lib/testnet/config.mjs";
const network=JSON.parse(await readFile(new URL("../config/networks.testnet.json",import.meta.url),"utf8"));
const deployments=JSON.parse(await readFile(new URL("../config/deployments.testnet.json",import.meta.url),"utf8"));
if(!validateTestnet({network,deployments}).ready)throw Error("Actual configured deployment required.");
if(!network.rpcUrl?.startsWith("https://")||!network.explorerUrl?.startsWith("https://"))
 throw Error("Public TLS RPC and explorer must be reachable.");
const validAddress=x=>typeof x==="string"&&/^0x[0-9a-fA-F]{40}$/.test(x)&&!/^0x0{40}$/i.test(x);
const creator=deployments.tokenCreator,vault=process.env.LIDDE_FUN_QUEST_VAULT_ADDRESS;
if(!validAddress(creator)||!validAddress(vault))throw Error("Both TokenCreator and QuestEscrow must be deployed.");
const client=createPublicClient({transport:http(network.rpcUrl,{timeout:15000,retryCount:0})});
if(await client.getChainId()!==network.chainId)throw Error("Wrong public RPC chain.");
const genesis=await client.getBlock({blockNumber:0n});
if(!genesis.hash)throw Error("Invalid genesis hash.");
async function codeHash(a){
 const code=await client.getBytecode({address:getAddress(a)});
 if(!code||code==="0x")throw Error("Missing runtime bytecode: "+a);
 return keccak256(code);
}
const [factoryHash,routerHash,creatorHash,vaultHash]=await Promise.all([
 codeHash(deployments.factory),codeHash(deployments.router),codeHash(creator),codeHash(vault)
]);
const routerAbi=parseAbi(["function factory() view returns(address)","function WETH() view returns(address)"]);
const [actualFactory,actualWrapped]=await Promise.all([
 client.readContract({address:deployments.router,abi:routerAbi,functionName:"factory"}),
 client.readContract({address:deployments.router,abi:routerAbi,functionName:"WETH"})
]);
if(actualFactory.toLowerCase()!==deployments.factory.toLowerCase()||
 actualWrapped.toLowerCase()!==deployments.wrappedTestNative.toLowerCase())
 throw Error("Router wiring disagrees with deployment manifest.");
const endpoint=process.env.LIDDE_DEX_MARKETS_API_URL??"";
if(!endpoint.startsWith("https://"))throw Error("Real HTTPS markets indexer endpoint required.");
const response=await fetch(endpoint,{signal:AbortSignal.timeout(12000)});
if(!response.ok)throw Error("DEX markets API is not live.");
const snapshot=await response.json();
if(snapshot.status!=="indexed"||snapshot.chainId!==network.chainId||
 snapshot.factory?.toLowerCase()!==deployments.factory.toLowerCase()||
 !/^0x[0-9a-fA-F]{64}$/.test(snapshot.canonicalBlockHash??""))
 throw Error("Index snapshot does not match this chain and factory.");
const at=BigInt(snapshot.canonicalBlock);
const indexedBlock=await client.getBlock({blockNumber:at});
if(indexedBlock.hash.toLowerCase()!==snapshot.canonicalBlockHash.toLowerCase())
 throw Error("Indexed block is not canonical.");
const vars={
 LIDDE_FUN_TESTNET_CHAIN_ID:network.chainId,
 LIDDE_FUN_RPC_URL:network.rpcUrl,
 LIDDE_FUN_EXPLORER_URL:network.explorerUrl,
 LIDDE_FUN_GENESIS_HASH:genesis.hash,
 LIDDE_FUN_FACTORY_ADDRESS:deployments.factory,
 LIDDE_FUN_FACTORY_CODE_HASH:factoryHash,
 LIDDE_FUN_ROUTER_ADDRESS:deployments.router,
 LIDDE_FUN_ROUTER_CODE_HASH:routerHash,
 LIDDE_FUN_WRAPPED_NATIVE_ADDRESS:deployments.wrappedTestNative,
 LIDDE_FUN_TOKEN_CREATOR_ADDRESS:creator,
 LIDDE_FUN_TOKEN_CREATOR_CODE_HASH:creatorHash,
 LIDDE_FUN_QUEST_VAULT_ADDRESS:vault,
 LIDDE_FUN_QUEST_VAULT_CODE_HASH:vaultHash,
 LIDDE_DEX_MARKETS_API_URL:endpoint,
 LIDDE_FUN_WRITES_ENABLED:"false",LIDDE_FUN_EMERGENCY_STOP:"true"
};
for(const [key,val] of Object.entries(vars))console.log(key+"="+val);
console.error("Verified chain/Factory/Router/creator/QuestEscrow and canonical index. Signing remains disabled.");
