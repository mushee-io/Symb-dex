// Operator-triggered reconciliation. Requires a fully indexed canonical checkpoint.
import {createPublicClient,http,getAddress,isAddress,zeroAddress} from "viem";
import {readFile} from "node:fs/promises";
import {createStore} from "../services/indexer/store.mjs";
import {reconcilePool} from "../services/indexer/reconcile.mjs";

const config=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));
const chain=JSON.parse(await readFile(new URL("../config/very-mainnet.json",import.meta.url),"utf8"));
const factory=config.factory;
if(!isAddress(factory??"")||getAddress(factory)===zeroAddress||!process.env.DATABASE_URL)
  throw new Error("Verified factory and DATABASE_URL are required.");
const store=createStore(process.env.DATABASE_URL,getAddress(factory));
const checkpoint=await store.loadCursor();
if(!checkpoint){console.log("No indexed checkpoint.");process.exit(0);}
const client=createPublicClient({transport:http(chain.rpcUrl,{timeout:20_000,retryCount:2})});
const pools=await store.listPairs(checkpoint.blockNumber);
if(pools.length>400)throw new Error("Too many pools for a single reconciliation pass.");
let mismatches=0;
for(const pool of pools){
  const result=await reconcilePool({client,store,pair:pool.address,checkpoint});
  console.log(pool.address,result.status);
  if(result.status==="mismatch")mismatches++;
}
if(mismatches)throw new Error(`Pool reserve reconciliation failed: ${mismatches} mismatches`);
console.log("Reconciliation complete.",pools.length,"pairs checked at",checkpoint.blockNumber.toString());
