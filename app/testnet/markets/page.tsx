import Link from "next/link";
import {DemoMarkets} from "@/components/testnet/demo-markets";
export const metadata={title:"Live Testnet Markets — Lidde",description:"Authentic canonical EVM sandbox swap events, pool reserves and liquidity actions. No real-money valuation."};
export default function Page(){return <main className="shell subpage"><div className="page-heading">
 <span className="eyebrow">CONFIRMED EVENT DATA · TESTNET ONLY</span><h1>Markets & liquidity.</h1>
 <p>Inspect indexed swap and LP activity derived from genuine demo-chain blocks. No artificial dollar volume, prices or real assets.</p>
 <Link href="/testnet" className="secondary-link">← Back to Testnet Swap</Link>
 </div><DemoMarkets/></main>;}
