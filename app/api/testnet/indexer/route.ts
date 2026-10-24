import {NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";
import {demoNetwork,demoDeployment,testnetReady} from "@/lib/testnet/network";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 if(!testnetReady||!demoNetwork||!demoDeployment)
  return NextResponse.json({status:"not-deployed"},{status:503,headers:{"Cache-Control":"no-store"}});
 if(!process.env.TESTNET_DATABASE_URL)
  return NextResponse.json({status:"indexer-not-provisioned",chainId:demoNetwork.chainId},
   {status:503,headers:{"Cache-Control":"no-store"}});
 try{
  const sql=neon(process.env.TESTNET_DATABASE_URL);
  const rows=await sql`SELECT block_number,block_hash,updated_at FROM m06_cursors
   WHERE chain_id=${demoNetwork.chainId} AND factory_address=${demoDeployment.factory.toLowerCase()} LIMIT 1`;
  return NextResponse.json({chainId:demoNetwork.chainId,
    status:rows.length?"indexed":"awaiting-first-block",
    indexedBlock:rows[0]?.block_number?.toString()??null,
    lastUpdated:rows[0]?.updated_at??null,
    // Informational only; the chain head can have moved after this checkpoint.
    canonicalBlockHash:rows[0]?.block_hash??null},{headers:{"Cache-Control":"no-store"}});
 }catch{
  return NextResponse.json({status:"indexer-unavailable",chainId:demoNetwork.chainId},
   {status:503,headers:{"Cache-Control":"no-store"}});
 }
}
