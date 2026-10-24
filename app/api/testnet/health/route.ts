import {NextResponse} from "next/server";
import {createPublicClient,http} from "viem";
import {neon} from "@neondatabase/serverless";
import {demoNetwork,demoDeployment,demoChain,testnetReady} from "@/lib/testnet/network";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store"};
type Check={status:"ready"|"missing"|"error"|"not-configured";detail:string};
const down=(detail:string)=>({status:"not-configured" as const,detail});
export async function GET(){
 if(!testnetReady||!demoChain||!demoNetwork||!demoDeployment){
  return NextResponse.json({status:"not-deployed",chainId:null,
   rpc:down("No verified distinct EVM test network configured."),
   contracts:down("Demo contract registry has no verified deployed addresses."),
   indexer:down("Indexer cannot be connected without a verified test chain."),
   faucet:down("Gas-sponsored claim cannot be active while testnet is unconfigured."),
   block:null,checkedAt:new Date().toISOString()},{headers});
 }
 const net=demoNetwork,dep=demoDeployment;
 const client=createPublicClient({chain:demoChain,transport:http(net.rpcUrl,{timeout:8500,retryCount:0})});
 const result:{status:string;chainId:number;block:string|null;checkedAt:string;
 rpc:Check;contracts:Check;indexer:Check;faucet:Check}={
  status:"checking",chainId:net.chainId,block:null,checkedAt:new Date().toISOString(),
  rpc:{status:"error",detail:"RPC not yet verified"},
  contracts:{status:"error",detail:"Contract bytecode not yet verified"},
  indexer:down("No testnet indexer credentials configured."),
  faucet:down("Operator sponsorship is disabled by default.")
 };
 try{
  const [remoteId,head]=await Promise.all([client.getChainId(),client.getBlockNumber()]);
  if(remoteId!==net.chainId||remoteId===4613||remoteId===1)throw new Error("RPC returned a wrong or mainnet chain.");
  result.block=head.toString();
  result.rpc={status:"ready",detail:"Chain "+remoteId+" responding at block "+head};
  const expected=[dep.factory,dep.router,dep.wrappedTestNative,dep.faucet,...dep.tokens.map(t=>t.address),
   ...(dep.tokenCreator?[dep.tokenCreator]:[]),...(dep.limitBook?[dep.limitBook]:[])];
  const codes=await Promise.all(expected.map(a=>client.getBytecode({address:a})));
  const missing=codes.filter(c=>!c||c==="0x").length;
  result.contracts=missing===0?
   {status:"ready",detail:expected.length+" deployed demo contracts contain code."}:
   {status:"missing",detail:missing+" configured demo contracts have no code."};
 }catch(e){
  result.rpc={status:"error",detail:e instanceof Error?e.message:"RPC read failed"};
  result.contracts={status:"error",detail:"Cannot independently verify contract code."};
 }
 if(process.env.TESTNET_DATABASE_URL){
  try{
   const sql=neon(process.env.TESTNET_DATABASE_URL);
   const row=await sql`SELECT block_number,updated_at FROM m06_cursors WHERE chain_id=${net.chainId}
    AND factory_address=${dep.factory.toLowerCase()} LIMIT 1`;
   result.indexer=row.length?
    {status:"ready",detail:"Last indexed block: "+row[0].block_number+", updated "+row[0].updated_at}:
    {status:"missing",detail:"Database connected; no canonical event checkpoint exists."};
  }catch{
   result.indexer={status:"error",detail:"Indexer database is unavailable."};
  }
 }
 if(process.env.TESTNET_FAUCET_SPONSOR_ENABLED==="true"&&
    process.env.TESTNET_FAUCET_DATABASE_URL&&
    process.env.TESTNET_FAUCET_OPERATOR_PRIVATE_KEY&&result.rpc.status==="ready"){
  // Key presence alone does NOT prove signer's chain owner/nonce/limits. Make that explicit.
  result.faucet={status:"missing",detail:"Operator configured; live gas sponsorship requires a successful zero-gas claim smoke test."};
 }
 result.status=result.rpc.status==="ready"&&result.contracts.status==="ready"?"chain-verified":"not-ready";
 return NextResponse.json(result,{headers});
}
