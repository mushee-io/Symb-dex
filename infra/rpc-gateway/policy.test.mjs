import {test} from "node:test";
import assert from "node:assert/strict";
import {allowedMethod,decodeRpcRequest,maxRequestsPerBatch} from "./policy.mjs";
const msg=(method)=>({jsonrpc:"2.0",id:1,method,params:[]});
test("allow canonical reads and raw-signed transactions",()=>{
 for(const method of ["eth_chainId","eth_getLogs","eth_call","eth_estimateGas","eth_sendRawTransaction"])
  assert.equal(allowedMethod(method),true);
});
test("deny Anvil cheats, admin, trace and unlocked-wallet methods",()=>{
 for(const method of ["evm_mine","evm_snapshot","anvil_setBalance","anvil_setCode","anvil_setStorageAt",
 "eth_sendTransaction","personal_unlockAccount","personal_listAccounts","admin_addPeer","debug_traceTransaction"])
  assert.equal(allowedMethod(method),false);
});
test("reject malformed or unbounded JSON-RPC batches",()=>{
 assert.throws(()=>decodeRpcRequest(msg("anvil_impersonateAccount")));
 assert.throws(()=>decodeRpcRequest({method:"eth_chainId",params:[],id:1}));
 assert.throws(()=>decodeRpcRequest({jsonrpc:"2.0",method:"eth_chainId",params:[]}));
 assert.throws(()=>decodeRpcRequest([]));
 assert.throws(()=>decodeRpcRequest(Array.from({length:maxRequestsPerBatch+1},()=>msg("eth_call"))));
 assert.equal(decodeRpcRequest([msg("eth_chainId"),msg("eth_getBalance")]).length,2);
});
