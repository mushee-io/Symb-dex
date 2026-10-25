import Link from "next/link";
import {DemoOrders} from "@/components/testnet/demo-orders";
export const metadata={title:"Demo Limit Orders — Symb Testnet",description:"Create, fill and cancel fake-value ERC20 orders on isolated EVM testnet contracts."};
export default function Page(){return <main className="shell subpage"><div className="page-heading">
 <span className="eyebrow">MILESTONE 12 · DEMO LIMIT ORDERS</span><h1>Trade at your price.</h1>
 <p>Test on-chain ERC-20 escrow orders with partial fills, cancellation and deadlines. There is no real asset support, automatic fill guarantee or real money trading.</p>
 <Link href="/testnet" className="secondary-link">← Back to Testnet Swap</Link></div><DemoOrders/></main>;}
