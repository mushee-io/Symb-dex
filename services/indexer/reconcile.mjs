import {getAddress} from "viem";
import {pairReadAbi,validAddress} from "./decoder.mjs";

export async function reconcilePool({client,store,pair,checkpoint,chainId=4613}) {
  if(!client || !store || !validAddress(pair) ||
     !checkpoint || typeof checkpoint.blockNumber!=="bigint")
    throw new Error("Invalid reconciliation request.");
  if(await client.getChainId()!==chainId) throw new Error("Wrong chain for reserve reconciliation.");
  const at=checkpoint.blockNumber;
  const canonical=await client.getBlock({blockNumber:at});
  if(canonical.hash.toLowerCase()!==checkpoint.blockHash.toLowerCase())
    throw new Error("Chain moved since checkpoint: refuse reconciliation.");
  const indexed=await store.latestIndexedReserves(pair,at);
  const [r0,r1]=await client.readContract({
    address:getAddress(pair),abi:pairReadAbi,functionName:"getReserves",blockNumber:at,
  });
  const actual={reserve0:BigInt(r0),reserve1:BigInt(r1)};
  const status=!indexed?(r0===0n && r1===0n?"uninitialized":"mismatch"):
    indexed.reserve0===actual.reserve0 && indexed.reserve1===actual.reserve1?"match":"mismatch";
  await store.storeReconciliation(pair,at,status,indexed,actual);
  return {pair,at,status,indexed,actual};
}
