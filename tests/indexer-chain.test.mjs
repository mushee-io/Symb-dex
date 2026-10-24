import test from "node:test";
import assert from "node:assert/strict";
import {confirmedHead,nextWindow,findCanonicalAncestor,assertHeaderContinuity} from "../services/indexer/chain.mjs";
const h=n=>"0x"+BigInt(n).toString(16).padStart(64,"0");
test("confirmed head never indexes unconfirmed blocks",()=>{
  assert.equal(confirmedHead(100n,12),88n);
  assert.equal(confirmedHead(3n,12),null);
  assert.throws(()=>confirmedHead(2n,0));
});
test("bounded historical backfill and no unbounded batch",()=>{
  assert.deepEqual(nextWindow({checkpoint:null,deploymentStart:20n,confirmed:100n,batchSize:5}),{from:20n,to:24n});
  assert.deepEqual(nextWindow({checkpoint:{blockNumber:24n},deploymentStart:20n,confirmed:27n,batchSize:5}),{from:25n,to:27n});
  assert.equal(nextWindow({checkpoint:{blockNumber:27n},deploymentStart:20n,confirmed:27n}),null);
  assert.throws(()=>nextWindow({deploymentStart:0n,confirmed:1000n,batchSize:1000}));
});
test("reorg recovery finds last matching stored block",async()=>{
  const known=[{blockNumber:9n,blockHash:h(9)},{blockNumber:8n,blockHash:h(8)}];
  const checkpoint={blockNumber:10n,blockHash:h(10)};
  const live=async n=>({hash:n===10n?h(99):h(n)});
  assert.equal(await findCanonicalAncestor(checkpoint,known,live),9n);
  await assert.rejects(findCanonicalAncestor(checkpoint,known,async()=>({hash:h(100)})),/Halt/);
});
test("discontinuous or foreign-parent chain cannot commit",()=>{
  const headers=[{number:3n,hash:h(3),parentHash:h(2)},{number:4n,hash:h(4),parentHash:h(3)}];
  assert.equal(assertHeaderContinuity(headers,h(2)),true);
  assert.throws(()=>assertHeaderContinuity(headers,h(42)),/canonical ancestor/);
  assert.throws(()=>assertHeaderContinuity([{...headers[0]},{...headers[1],parentHash:h(0)}]),/discontinuous/);
});
