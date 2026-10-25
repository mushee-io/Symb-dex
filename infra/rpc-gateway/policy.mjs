/** Public valueless-sandbox JSON-RPC allowlist. No admin or cheat calls. */
const METHODS=new Set([
 "eth_chainId","net_version","web3_clientVersion","eth_blockNumber",
 "eth_getBalance","eth_getTransactionCount","eth_getCode","eth_getStorageAt",
 "eth_call","eth_estimateGas","eth_gasPrice","eth_feeHistory",
 "eth_maxPriorityFeePerGas","eth_getBlockByNumber","eth_getBlockByHash",
 "eth_getBlockTransactionCountByHash","eth_getBlockTransactionCountByNumber",
 "eth_getTransactionByHash","eth_getTransactionByBlockHashAndIndex",
 "eth_getTransactionByBlockNumberAndIndex","eth_getTransactionReceipt",
 "eth_getBlockReceipts","eth_getLogs","eth_getProof","eth_syncing","eth_sendRawTransaction"
]);
export const maxRequestsPerBatch=10;
export const maxBodyBytes=65536;
export function allowedMethod(name){return typeof name==="string"&&METHODS.has(name);}
export function decodeRpcRequest(value){
 const batch=Array.isArray(value)?value:[value];
 if(!batch.length||batch.length>maxRequestsPerBatch)throw Error("Invalid JSON-RPC batch size.");
 for(const item of batch){
  if(!item||typeof item!=="object"||Array.isArray(item)||
     item.jsonrpc!=="2.0"||!allowedMethod(item.method)||
     !Object.hasOwn(item,"id")||
     !(typeof item.id==="string"||typeof item.id==="number"||item.id===null)||
     !Array.isArray(item.params??[]))throw Error("Unapproved JSON-RPC method or request.");
 }
 return value;
}
