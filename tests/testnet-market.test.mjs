import test from "node:test";
import assert from "node:assert/strict";
import {getDemoQuote,demoPaths} from "../lib/testnet/market.mjs";
const addr=n=>"0x"+n.toString(16).padStart(40,"0");
const pair=addr(7),a=addr(3),b=addr(4),factory=addr(8);
const client={
 getChainId:async()=>31337,
 getBytecode:async()=> "0x6000",
 readContract:async({functionName})=>{
  if(functionName==="getPair")return pair;
  if(functionName==="token0")return a;
  if(functionName==="token1")return b;
  if(functionName==="getReserves")return [1000000n,1000000n,0];
 }
};
test("quotes use actual pool reserves on a separate chain",async()=>{
 const q=await getDemoQuote(client,{chainId:31337,factory,inputAddress:a,outputAddress:b,amountIn:1000n});
 assert.equal(q.path.length,2);
 assert.ok(q.amountOut>0n&&q.amountOut<1000n);
 assert.equal(q.pair.toLowerCase(),pair);
});
test("never quote against mainnet or wrong RPC",async()=>{
 await assert.rejects(getDemoQuote(client,{chainId:4613,factory,inputAddress:a,outputAddress:b,amountIn:1000n}),/Testnet/);
 await assert.rejects(getDemoQuote({...client,getChainId:async()=>4613},{chainId:31337,factory,inputAddress:a,outputAddress:b,amountIn:1000n}),/mismatch/);
});
test("reject identical tokens and absent pools",async()=>{
 assert.throws(()=>demoPaths(a,a),/Invalid/);
 const c={...client,readContract:async({functionName})=>functionName==="getPair"?addr(0):null};
 assert.equal(await getDemoQuote(c,{chainId:31337,factory,inputAddress:a,outputAddress:b,amountIn:1000n}),null);
});
