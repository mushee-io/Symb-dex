"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
export default function Explorer(){
 const [hash,setHash]=useState("");
 const router=useRouter();
 return <main className="shell subpage">
  <div className="page-heading"><span className="eyebrow">SYMB DEVNET · READ ONLY</span>
   <h1>Testnet Transaction Explorer</h1>
   <p>Look up genuine confirmed EVM sandbox transactions from the configured test chain. This limited viewer is not an official VERY explorer.</p></div>
  <section className="testnet-panel">
   <form onSubmit={e=>{e.preventDefault();if(/^0x[0-9a-fA-F]{64}$/.test(hash))router.push("/testnet/explorer/tx/"+hash);}}>
    <label>Transaction hash<input aria-label="Testnet transaction hash" value={hash}
     onChange={e=>setHash(e.target.value.trim())} placeholder="0x…"/></label>
    <button type="submit" disabled={!/^0x[0-9a-fA-F]{64}$/.test(hash)}>Inspect transaction</button>
   </form>
   <p>Only the separate Symb test network is queried. No private keys or wallet connections are needed.</p>
   <Link href="/testnet/pools">Testnet liquidity →</Link>
  </section>
 </main>;
}
