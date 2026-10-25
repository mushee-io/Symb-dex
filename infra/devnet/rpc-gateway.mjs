// HTTP JSON-RPC safety gateway for a FAKE-VALUE independent EVM devnet.
// Never exposes Anvil administrative methods, node-held signing or impersonation.
import {createServer} from "node:http";
const upstream=process.env.UPSTREAM_RPC_URL??"http://anvil:8545";
const bodyLimit=Number(process.env.RPC_BODY_LIMIT??65536);
const rate=Number(process.env.RPC_GLOBAL_RATE_PER_MINUTE??500);
const origin=process.env.RPC_ALLOWED_ORIGIN??"*";
const expectedId=Number(process.env.RPC_EXPECTED_CHAIN_ID??"31338");
export const trustedTestChain=id=>Number.isSafeInteger(id)&&id>1000&&id!==4613&&id!==1&&id===expectedId;
async function verifyUpstreamChain(){
 const answer=await fetch(upstream,{method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify({jsonrpc:"2.0",id:1,method:"eth_chainId",params:[]}),
  signal:AbortSignal.timeout(5000)});
 const data=await answer.json();
 if(!trustedTestChain(Number(BigInt(data.result??"0x0"))))
  throw new Error("Unsafe RPC upstream chain ID. Reject all traffic.");
}
const methods=new Set([
 "eth_chainId","eth_blockNumber","eth_getBlockByNumber","eth_getBlockByHash",
 "eth_getBlockTransactionCountByNumber","eth_getTransactionByHash",
 "eth_getTransactionReceipt","eth_getTransactionCount","eth_getBalance","eth_getCode",
 "eth_getStorageAt","eth_getLogs","eth_call","eth_estimateGas","eth_gasPrice",
 "eth_feeHistory","eth_maxPriorityFeePerGas","eth_sendRawTransaction",
 "net_version","web3_clientVersion","eth_getTransactionByBlockNumberAndIndex"
]);
let windowStart=Date.now(),calls=0;
const headers={"Content-Type":"application/json","Cache-Control":"no-store",
 "Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST, OPTIONS",
 "Access-Control-Allow-Headers":"content-type"};
export function permittedRpc(payload){
 const calls=Array.isArray(payload)?payload:[payload];
 return calls.length>0 && calls.length<=10 &&
  calls.every(x=>x&&typeof x==="object"&&methods.has(x.method)&&
   (x.jsonrpc==="2.0")&&
   (x.id===null||["number","string"].includes(typeof x.id)) &&
   Array.isArray(x.params??[]));
}
export const server=createServer(async(req,res)=>{
 for(const [k,v] of Object.entries(headers))res.setHeader(k,v);
 if(req.method==="OPTIONS"){res.writeHead(204).end();return;}
 if(req.method==="GET"&&req.url==="/health"){
  try{await verifyUpstreamChain();res.writeHead(200).end(JSON.stringify({status:"ready",type:"testnet-rpc-gateway"}));}
  catch{res.writeHead(503).end(JSON.stringify({status:"unavailable",type:"testnet-rpc-gateway"}));}
  return;
 }
 if(req.method!=="POST"){res.writeHead(405).end("Method not allowed");return;}
 if(!Number.isFinite(rate)||rate<1){res.writeHead(503).end("Gateway not configured");return;}
 if(Date.now()-windowStart>=60000){windowStart=Date.now();calls=0;}
 if(++calls>rate){res.writeHead(429).end("RPC rate limit");return;}
 let bytes=0,chunks=[];
 for await(const chunk of req){bytes+=chunk.length;if(bytes>bodyLimit){res.writeHead(413).end("RPC request too large");return;}chunks.push(chunk);}
 let json;
 try{json=JSON.parse(Buffer.concat(chunks).toString("utf8"));}
 catch{res.writeHead(400).end("Invalid JSON-RPC");return;}
 if(!permittedRpc(json)){res.writeHead(403).end("RPC method blocked");return;}
 try{
  // Check the upstream on every request, especially signed tx submissions.
  // A mistaken upstream pointing to VERY Mainnet must be rejected even if
  // the external endpoint URL itself still says "symb testnet".
  await verifyUpstreamChain();
  const upstreamResponse=await fetch(upstream,{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify(json),signal:AbortSignal.timeout(15000)});
  const body=await upstreamResponse.text();
  res.writeHead(upstreamResponse.status,{"Content-Type":"application/json"}).end(body.slice(0,1024*1024));
 }catch{res.writeHead(502).end(JSON.stringify({error:"Testnet upstream unavailable"}));}
});
if(process.env.NODE_ENV!=="test")server.listen(3000,"0.0.0.0");
