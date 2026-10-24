import {createHash} from "node:crypto";
import {NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";
import {
 createPublicClient,createWalletClient,http,parseAbi,getAddress,isAddress,verifyMessage
} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {demoNetwork,demoDeployment,demoChain,testnetReady} from "@/lib/testnet/network";
import {claimMessage,dayUtc} from "@/lib/testnet/faucet-message.mjs";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const faucetAbi=parseAbi([
 "function owner() view returns (address)",
 "function lastClaim(address) view returns (uint256)",
 "function claimed(address) view returns (bool)",
 "function cooldown() view returns (uint64)",
 "function nativeAmount() view returns (uint256)",
 "function claimFor(address recipient)",
]);
type RequestBody={address?:string;signature?:string;day?:number};
const reply=(message:string,status:number)=>NextResponse.json({error:message},{status,headers:{"Cache-Control":"no-store"}});
const hexKey=(x:string|undefined):x is `0x${string}`=>Boolean(x && /^0x[0-9a-fA-F]{64}$/.test(x));

export async function POST(req:Request) {
 if(!testnetReady || !demoNetwork || !demoDeployment || !demoChain)
  return reply("The test network has not been deployed.",503);
 if(process.env.TESTNET_FAUCET_SPONSOR_ENABLED!=="true")
  return reply("Operator-sponsored first claims are not enabled yet.",503);
 const db=process.env.TESTNET_FAUCET_DATABASE_URL;
 const pk=process.env.TESTNET_FAUCET_OPERATOR_PRIVATE_KEY;
 const pepper=process.env.TESTNET_FAUCET_IP_PEPPER;
 if(!db || !hexKey(pk) || !pepper || pepper.length<32)
  return reply("Testnet faucet operator is not provisioned.",503);
 // Proxy header must be inserted/overwritten by the hosting provider, not an
 // arbitrary browser-provided X-Forwarded-For on an untrusted deployment.
 const ip=req.headers.get("x-vercel-forwarded-for");
 if(!ip || !/^[0-9a-fA-F.:]{3,50}$/.test(ip))
  return reply("Trusted anti-abuse proxy information unavailable.",503);
 if(Number(req.headers.get("content-length")??"0")>1500)
  return reply("Request too large.",413);
 let data:RequestBody;
 try {data=await req.json() as RequestBody;}
 catch{return reply("Invalid claim request.",400);}
 if(!isAddress(data.address??"") || typeof data.signature!=="string" ||
   !/^0x[0-9a-fA-F]{130}$/.test(data.signature))
  return reply("Sign the faucet claim with your own wallet.",400);
 const day=dayUtc();
 if(data.day!==day) return reply("Claim signature expired. Please sign again.",400);
 const recipient=getAddress(data.address!);
 const message=claimMessage(recipient,demoNetwork.chainId,day);
 const authorized=await verifyMessage({address:recipient,message,signature:data.signature as `0x${string}`});
 if(!authorized)return reply("Wallet claim signature invalid.",403);
 const chainClient=createPublicClient({chain:demoChain,transport:http(demoNetwork.rpcUrl)});
 try {
  if(await chainClient.getChainId()!==demoNetwork.chainId || demoNetwork.chainId===4613)
   return reply("RPC returned wrong blockchain.",503);
  const ownerAccount=privateKeyToAccount(pk);
  const owner=await chainClient.readContract({address:demoDeployment.faucet,abi:faucetAbi,functionName:"owner"});
  if(owner.toLowerCase()!==ownerAccount.address.toLowerCase())
   return reply("Operator key is not the on-chain faucet owner.",503);
  const [claimed,lastClaim,cooldown,amount,nativeBalance]=await Promise.all([
   chainClient.readContract({address:demoDeployment.faucet,abi:faucetAbi,functionName:"claimed",args:[recipient]}),
   chainClient.readContract({address:demoDeployment.faucet,abi:faucetAbi,functionName:"lastClaim",args:[recipient]}),
   chainClient.readContract({address:demoDeployment.faucet,abi:faucetAbi,functionName:"cooldown"}),
   chainClient.readContract({address:demoDeployment.faucet,abi:faucetAbi,functionName:"nativeAmount"}),
   chainClient.getBalance({address:demoDeployment.faucet}),
  ]);
  if(claimed && BigInt(Math.floor(Date.now()/1000))<lastClaim+cooldown)
   return reply("Claim cooldown is still active.",429);
  if(nativeBalance<amount || amount>1_000_000_000_000_000_000n)
   return reply("Testnet faucet inventory is low.",503);
  const ipHash=createHash("sha256").update(pepper+"|"+ip).digest("hex");
  const requestId=createHash("sha256").update(demoNetwork.chainId+"|"+recipient+"|"+day+"|"+ipHash).digest("hex");
  const sql=neon(db);
  const reserved=await sql`SELECT lidde_reserve_faucet_claim(
   ${demoNetwork.chainId},${recipient},${day},${ipHash},${requestId}) AS allowed`;
  if(!reserved[0]?.allowed)return reply("Daily wallet or network claim limit reached.",429);
  // A reservation is intentionally NOT automatically cleared after a write
  // error; ops must reconcile possible broadcast before allowing another claim.
  const sender=createWalletClient({account:ownerAccount,chain:demoChain,transport:http(demoNetwork.rpcUrl)});
  try{
   const simulated=await chainClient.simulateContract({account:ownerAccount,address:demoDeployment.faucet,
    abi:faucetAbi,functionName:"claimFor",args:[recipient]});
   const hash=await sender.writeContract({...simulated.request,chain:demoChain,account:ownerAccount});
   await sql`UPDATE lidde_test_faucet_claims SET tx_hash=${hash},status='submitted',updated_at=now()
    WHERE chain_id=${demoNetwork.chainId} AND wallet=${recipient.toLowerCase()} AND day_utc=${day}`;
   return NextResponse.json({status:"submitted",chainId:demoNetwork.chainId,
    hash,explorerUrl:demoNetwork.explorerUrl.replace(/\/$/,"")+"/tx/"+hash},{
     status:202,headers:{"Cache-Control":"no-store"}});
  }catch(e){
   await sql`UPDATE lidde_test_faucet_claims SET status='needs_reconciliation',updated_at=now()
    WHERE chain_id=${demoNetwork.chainId} AND wallet=${recipient.toLowerCase()} AND day_utc=${day}`;
   console.error("Testnet faucet claim requires operator reconciliation:",e);
   return reply("Claim could not be verified; operator reconciliation required.",503);
  }
 }catch(e){
  console.error("Testnet faucet server error:",e);
  return reply("Faucet service unavailable.",503);
 }
}
