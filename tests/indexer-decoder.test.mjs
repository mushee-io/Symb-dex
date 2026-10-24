import test from "node:test";
import assert from "node:assert/strict";
import {encodeEventTopics,encodeAbiParameters,parseAbiParameters} from "viem";
import {factoryEvents,pairEvents,parsePairCreation,normalizePairLog,normalizedAmounts} from "../services/indexer/decoder.mjs";
const f="0x1111111111111111111111111111111111111111",a="0x2222222222222222222222222222222222222222",
  b="0x3333333333333333333333333333333333333333",p="0x4444444444444444444444444444444444444444";
const hash=n=>"0x"+BigInt(n).toString(16).padStart(64,"0");
test("valid PairCreated decoded only from verified factory",()=>{
  const topics=encodeEventTopics({abi:factoryEvents,eventName:"PairCreated",args:{token0:a,token1:b}});
  const data=encodeAbiParameters(parseAbiParameters("address pair,uint256 id"),[p,1n]);
  const log={address:f,topics,data,blockNumber:12n,transactionHash:hash(5),logIndex:0};
  const record=parsePairCreation(log,f);
  assert.equal(record.address,p);
  assert.equal(record.creationBlock,12n);
  assert.throws(()=>parsePairCreation({...log,address:a},f),/unexpected/);
});
test("Swap decoded into raw integer-based normalized amounts",()=>{
  const topics=encodeEventTopics({abi:pairEvents,eventName:"Swap",args:{sender:a,to:b}});
  const data=encodeAbiParameters(parseAbiParameters("uint256 amount0In,uint256 amount1In,uint256 amount0Out,uint256 amount1Out"),[100n,0n,0n,99n]);
  const log={address:p,topics,data,blockNumber:12n,blockHash:hash(12),transactionHash:hash(9),logIndex:1};
  const ev=normalizePairLog(log,new Set([p.toLowerCase()]),new Map([["12",{hash:hash(12)}]]));
  assert.equal(ev.eventName,"Swap");
  assert.deepEqual([normalizedAmounts(ev).amount0In,normalizedAmounts(ev).amount1Out],["100","99"]);
  assert.throws(()=>normalizePairLog({...log,blockHash:hash(11)},new Set([p]),new Map([["12",{hash:hash(12)}]])),/block hash/);
  assert.throws(()=>normalizePairLog(log,new Set(),new Map([["12",{hash:hash(12)}]])),/Unregistered/);
});
