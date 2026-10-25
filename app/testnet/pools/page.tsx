import Link from "next/link";
import {TestnetPools} from "@/components/testnet/testnet-pools";
export const metadata={title:"Liquidity Pools — Symb Testnet",description:"Create, add and withdraw liquidity with valueless demo assets."};
export default function Page(){return <main className="shell subpage">
 <div className="page-heading"><span className="eyebrow">MILESTONE 11 · NO REAL FUNDS</span>
  <h1>Testnet Liquidity</h1><p>Create test pools, deposit synthetic tokens, receive LP shares and withdraw all redeemable LP with real demo-chain receipts.</p>
  <Link href="/testnet" className="secondary-link">← Back to testnet swap</Link>
 </div><TestnetPools/></main>;}
