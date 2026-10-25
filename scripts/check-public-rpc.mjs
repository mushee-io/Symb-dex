// Read-only verification of an isolated public Symb devnet; refuses VERY mainnet.
const rpc=process.env.TESTNET_RPC_URL;
const expected=Number(process.env.TESTNET_EXPECTED_CHAIN_ID??31338);
if(!rpc||!/^https:\/\//i.test(rpc))throw Error("Set TESTNET_RPC_URL to a public HTTPS RPC endpoint");
if(!Number.isSafeInteger(expected)||expected<=1000||expected===4613||expected===1)
 throw Error("Unsafe expected chain ID");
const parsed=new URL(rpc);
if(/(^|\.)verylabs\.io$|(^|\.)veryscan\.io$/i.test(parsed.hostname))
 throw Error("Mainnet domain supplied where isolated test RPC is required");
async function jsonrpc(method,params=[]){
 const response=await fetch(rpc,{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({jsonrpc:"2.0",id:100,method,params}),signal:AbortSignal.timeout(10000)});
 const body=await response.text();
 let json;try{json=JSON.parse(body)}catch{if(response.status===403)return {response,json:null};throw Error(method+": RPC did not return JSON")}
 return {response,json};
}
const chain=await jsonrpc("eth_chainId");
const actual=Number(BigInt(chain.json.result??"0x0"));
if(actual!==expected)throw Error("Wrong chain ID: expected "+expected+", got "+actual);
const latest=await jsonrpc("eth_blockNumber");
if(!latest.json.result)throw Error("Public RPC cannot read latest block");
const denied=await jsonrpc("anvil_setBalance",["0x000000000000000000000000000000000000dEaD","0x1"]);
if(denied.response.status!==403)throw Error("Privileged Anvil RPC was not blocked with HTTP 403");
console.log(JSON.stringify({status:"PASS",publicRpc:parsed.origin,chainId:actual,
 latestBlock:Number(BigInt(latest.json.result)),adminRpcBlocked:true},null,2));
