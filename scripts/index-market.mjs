// M06A/B: explicit read-only resumable indexer. No wallet credentials are used.
import {createPublicClient,http,getAddress,isAddress,zeroAddress} from "viem";
import {readFile} from "node:fs/promises";
import {createStore} from "../services/indexer/store.mjs";
import {indexConfirmedWindow} from "../services/indexer/worker.mjs";

const cfg=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));
const network=JSON.parse(await readFile(new URL("../config/very-mainnet.json",import.meta.url),"utf8"));
const env=process.env;
const origin=env.LIDDE_INDEXER_START_BLOCK;
const factory=cfg.factory;
if(!isAddress(factory??"")||getAddress(factory)===zeroAddress || cfg.chainId!==4613 ||
   !origin || !/^\d+$/.test(origin) || !env.DATABASE_URL) {
  console.error("M06 requires verified config.factory, private DATABASE_URL and LIDDE_INDEXER_START_BLOCK.");
  process.exitCode=1;
} else {
  const n=Number(env.LIDDE_INDEXER_BATCH_SIZE??"50");
  const confirmations=Number(env.LIDDE_INDEXER_CONFIRMATIONS??"12");
  const limit=Number(env.LIDDE_INDEXER_MAX_WINDOWS??"1");
  if(!Number.isInteger(limit) || limit<1 || limit>100)
    throw new Error("LIDDE_INDEXER_MAX_WINDOWS must be an integer from 1 to 100.");
  const client=createPublicClient({transport:http(network.rpcUrl,{timeout:20_000,retryCount:2})});
  const store=createStore(env.DATABASE_URL,getAddress(factory));
  let finished=false;
  for(let i=0;i<limit;i++){
    const outcome=await indexConfirmedWindow({
      client,store,factory:getAddress(factory),deploymentStart:BigInt(origin),
      confirmations,batchSize:n
    });
    console.log(JSON.stringify(outcome,(_k,v)=>typeof v==="bigint"?v.toString():v));
    if(outcome.status!=="indexed"){finished=true;break;}
  }
  if(!finished)console.log("Window limit reached; run again to continue confirmed backfill.");
}
