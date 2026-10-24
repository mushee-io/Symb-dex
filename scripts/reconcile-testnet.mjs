import {readFile} from "node:fs/promises";
import {createPublicClient,http} from "viem";
import {validateTestnet} from "../lib/testnet/config.mjs";
import {createStore} from "../services/indexer/store.mjs";
import {reconcilePool} from "../services/indexer/reconcile.mjs";
const network=JSON.parse(await readFile(new URL("../config/networks.testnet.json",import.meta.url),"utf8"));
const deployment=JSON.parse(await readFile(new URL("../config/deployments.testnet.json",import.meta.url),"utf8"));
if(!validateTestnet({network,deployments:deployment}).ready || network.chainId===4613)
 throw new Error("Refusing to reconcile unconfigured testnet.");
if(!process.env.TESTNET_DATABASE_URL)throw new Error("TESTNET_DATABASE_URL required.");
const client=createPublicClient({transport:http(network.rpcUrl,{timeout:15000})});
if(await client.getChainId()!==network.chainId)throw new Error("Wrong RPC chain");
const store=createStore(process.env.TESTNET_DATABASE_URL,deployment.factory,network.chainId);
const checkpoint=await store.loadCursor();
if(!checkpoint)throw new Error("No testnet indexed checkpoint.");
let bad=0, checked=0;
for(const p of await store.listPairs(checkpoint.blockNumber)){
 const r=await reconcilePool({client,store,pair:p.address,checkpoint,chainId:network.chainId});
 console.log(p.address,r.status);
 checked++;if(r.status!=="match" && r.status!=="uninitialized")bad++;
}
console.log(JSON.stringify({chainId:network.chainId,checked,bad,atBlock:String(checkpoint.blockNumber)}));
if(bad)throw new Error("Mismatch between confirmed test-chain reserves and Neon");
