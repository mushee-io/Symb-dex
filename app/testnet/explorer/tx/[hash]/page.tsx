import Link from "next/link";
import {createPublicClient,http,isHash,formatEther} from "viem";
import {demoNetwork,demoChain,testnetReady} from "@/lib/testnet/network";
export const dynamic="force-dynamic";
export default async function Transaction({params}:{params:Promise<{hash:string}>}){
 const {hash}=await params;
 let tx:Awaited<ReturnType<ReturnType<typeof createPublicClient>["getTransaction"]>>|null=null;
 let receipt:Awaited<ReturnType<ReturnType<typeof createPublicClient>["getTransactionReceipt"]>>|null=null;
 let error="";
 if(!testnetReady||!demoNetwork||!demoChain)error="Testnet RPC and explorer are not yet configured.";
 else if(!isHash(hash))error="Invalid transaction hash.";
 else try{
  const client=createPublicClient({chain:demoChain,transport:http(demoNetwork.rpcUrl,{timeout:10000,retryCount:1})});
  if(await client.getChainId()!==demoNetwork.chainId||demoNetwork.chainId===4613)
   throw new Error("RPC chain mismatch.");
  tx=await client.getTransaction({hash:hash as `0x${string}`});
  receipt=await client.getTransactionReceipt({hash:hash as `0x${string}`}).catch(()=>null);
 }catch(e){error=e instanceof Error?e.message:"RPC request failed.";}
 return <main className="shell subpage"><div className="page-heading">
  <span className="eyebrow">TEST CHAIN ONLY</span><h1>Transaction receipt</h1>
  <p>Blockchain data is read directly from the isolated test RPC, never created as placeholder trading volume.</p>
 </div><section className="testnet-panel">
  {error?<p role="alert">{error}</p>:<div>
   <div className="testnet-quote"><span>Transaction</span><strong>{hash}</strong></div>
   <div className="testnet-quote"><span>Status</span><strong>{receipt?.status??"Pending / unconfirmed"}</strong></div>
   <div className="testnet-quote"><span>Chain ID</span><strong>{demoNetwork?.chainId??"—"}</strong></div>
   <div className="testnet-quote"><span>Block</span><strong>{receipt?.blockNumber.toString()??"—"}</strong></div>
   <div className="testnet-quote"><span>From</span><strong>{tx?.from??"—"}</strong></div>
   <div className="testnet-quote"><span>To</span><strong>{tx?.to??"Contract creation"}</strong></div>
   <div className="testnet-quote"><span>Fake native value</span><strong>{tx?formatEther(tx.value):"—"} tVERY</strong></div>
   <div className="testnet-quote"><span>Gas used</span><strong>{receipt?.gasUsed.toString()??"—"}</strong></div>
   <h2>Emitted logs ({receipt?.logs.length??0})</h2>
   {receipt?.logs.map((l,i)=><div className="testnet-quote" key={i}>
    <span>{l.address}<br/>Log #{l.logIndex}</span>
    <strong>{l.topics[0]??"No event topic"}</strong></div>)}
  </div>}
  <p><Link href="/testnet/explorer">← Search another transaction</Link></p>
 </section></main>;
}
