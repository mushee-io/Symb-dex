import test from "node:test";
import assert from "node:assert/strict";
import { candidatePaths, findBestQuote } from "../lib/swap/market.mjs";

const A="0x1111111111111111111111111111111111111111";
const B="0x2222222222222222222222222222222222222222";
const W="0x3333333333333333333333333333333333333333";
const F="0x4444444444444444444444444444444444444444";
const P="0x5555555555555555555555555555555555555555";
const Q="0x6666666666666666666666666666666666666666";
const R="0x7777777777777777777777777777777777777777";

test("direct and wrapped paths have no duplicate hops",()=>{
  assert.deepEqual(candidatePaths(A,B,W),[[A,B],[A,W,B]]);
  assert.deepEqual(candidatePaths(W,B,W),[[W,B]]);
  assert.throws(()=>candidatePaths(A,A,W));
});

function fakeClient({pairs,chain=4613}) {
  const byPair=Object.fromEntries(Object.values(pairs).map(p=>[p.address.toLowerCase(),p]));
  return {
    getChainId: async()=>chain,
    getBytecode: async()=> "0x6001",
    readContract: async ({address,functionName,args})=>{
      if (functionName==="getPair") return pairs[[args[0].toLowerCase(),args[1].toLowerCase()].sort().join(":")]?.address ?? "0x0000000000000000000000000000000000000000";
      const p=byPair[address.toLowerCase()];
      if(!p) throw new Error("Unknown pair");
      if(functionName==="token0") return p.tokens[0];
      if(functionName==="token1") return p.tokens[1];
      if(functionName==="getReserves") return [p.reserves[0],p.reserves[1],0];
      throw new Error("Unknown method");
    }
  };
}
const pool=(x,y,address,reserves)=>({address,tokens:[x,y],reserves});
const key=(a,b)=>[a,b].sort().join(":");

test("chooses better wrapped route from actual pair reserves",async()=>{
  const client=fakeClient({pairs:{
    [key(A,B)]:pool(A,B,P,[10000n,3000n]),
    [key(A,W)]:pool(A,W,Q,[10000n,10000n]),
    [key(W,B)]:pool(W,B,R,[10000n,10000n]),
  }});
  const quote=await findBestQuote(client,{chainId:4613,factory:F,wrappedVery:W,tokenIn:A,tokenOut:B,input:100n,feeBps:30});
  assert.deepEqual(quote.path,[A,W,B]);
  assert.equal(quote.pairs.length,2);
});

test("handles absent and empty pools as unavailable",async()=>{
  const client=fakeClient({pairs:{[key(A,B)]:pool(A,B,P,[0n,1000n])}});
  const quote=await findBestQuote(client,{chainId:4613,factory:F,wrappedVery:W,tokenIn:A,tokenOut:B,input:100n,feeBps:30});
  assert.equal(quote,null);
});

test("rejects RPC chain mismatch and mismatched pair tokens",async()=>{
  await assert.rejects(findBestQuote(fakeClient({pairs:{},chain:1}),{
    chainId:4613,factory:F,wrappedVery:W,tokenIn:A,tokenOut:B,input:1n,feeBps:30}),/wrong chain/i);
  const client=fakeClient({pairs:{[key(A,B)]:pool(A,W,P,[10000n,10000n])}});
  await assert.rejects(findBestQuote(client,{chainId:4613,factory:F,wrappedVery:W,tokenIn:A,tokenOut:B,input:100n,feeBps:30}),/mismatched tokens/i);
});
