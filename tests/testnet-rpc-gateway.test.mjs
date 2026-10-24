import test from "node:test";
import assert from "node:assert/strict";
process.env.NODE_ENV="test";
const {permittedRpc,server,trustedTestChain}=await import("../infra/devnet/rpc-gateway.mjs");
test("the public RPC permits reads and signed test-only broadcasts",()=>{
 assert.ok(permittedRpc({jsonrpc:"2.0",id:1,method:"eth_chainId",params:[]}));
 assert.ok(permittedRpc({jsonrpc:"2.0",id:1,method:"eth_sendRawTransaction",params:["0xf8"]}));
});
test("gateway refuses admin, signer and impersonation methods",()=>{
 for(const method of ["anvil_setBalance","hardhat_impersonateAccount","personal_sign","eth_sendTransaction","eth_sign","debug_traceTransaction","eth_accounts"])
  assert.equal(permittedRpc({jsonrpc:"2.0",id:1,method,params:[]}),false);
 assert.equal(permittedRpc([{jsonrpc:"2.0",id:1,method:"eth_chainId",params:[]},{jsonrpc:"2.0",id:2,method:"anvil_mine",params:[]}]),false);
});
test("reject malformed payload and massive batch",()=>{
 assert.equal(permittedRpc(null),false);
 assert.equal(permittedRpc([]),false);
 assert.equal(permittedRpc(Array.from({length:12},(_,i)=>({jsonrpc:"2.0",id:i,method:"eth_chainId",params:[]}))),false);
});
server.close();

test("gateway expected chain always rejects chain 4613 even if someone points upstream there",()=>{
 assert.equal(trustedTestChain(31338),true);
 assert.equal(trustedTestChain(4613),false);
 assert.equal(trustedTestChain(1),false);
 assert.equal(trustedTestChain(31337),false);
});
