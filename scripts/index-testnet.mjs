// M11: isolated testnet indexer. No signer, no real funds, fail closed on wrong chain.
import {readFile} from "node:fs/promises";
import {createPublicClient,http} from "viem";
import {validateTestnet} from "../lib/testnet/config.mjs";
import {createStore} from "../services/indexer/store.mjs";
import {indexConfirmedWindow} from "../services/indexer/worker.mjs";
const network=JSON.parse(await readFile(new URL("../config/networks.testnet.json",import.meta.url),"utf8"));
const deployments=JSON.parse(await readFile(new URL("../config/deployments.testnet.json",import.meta.url),"utf8"));
const validation=validateTestnet({network,deployments});
if(!validation.ready || network.chainId===4613) throw new Error("Testnet indexer refused: "+validation.errors.join("; "));
if(!process.env.TESTNET_DATABASE_URL)throw new Error("Isolated TESTNET_DATABASE_URL required.");
const start=process.env.TESTNET_INDEXER_START_BLOCK;
if(!start || !/^\d+$/.test(start))throw new Error("Provide actual TESTNET_INDEXER_START_BLOCK.");
const limit=Number(process.env.TESTNET_INDEXER_MAX_WINDOWS??"5");
const confirmations=Number(process.env.TESTNET_INDEXER_CONFIRMATIONS??"2");
const batchSize=Number(process.env.TESTNET_INDEXER_BATCH_SIZE??"25");
if(!Number.isInteger(limit)||limit<1||limit>50)throw new Error("Bad indexer window cap.");
const client=createPublicClient({transport:http(network.rpcUrl,{timeout:15000,retryCount:2})});
if(await client.getChainId()!==network.chainId)throw new Error("Wrong RPC chain.");
const store=createStore(process.env.TESTNET_DATABASE_URL,deployments.factory,network.chainId);
for(let i=0;i<limit;i++){
 const result=await indexConfirmedWindow({
  client,store,factory:deployments.factory,deploymentStart:BigInt(start),
  chainId:network.chainId,confirmations,batchSize
 });
 console.log(JSON.stringify({chainId:network.chainId,...result},(_k,v)=>typeof v==="bigint"?v.toString():v));
 if(result.status!=="indexed")break;
}
