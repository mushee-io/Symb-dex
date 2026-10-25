import Link from "next/link";
import {DemoLaunch} from "@/components/testnet/demo-launch";
export const metadata={title:"Create a Demo Token — Symb Testnet",description:"Deploy valueless capped synthetic tokens on a separately configured EVM sandbox. No real funds."};
export default function Page(){return <main className="shell subpage"><div className="page-heading">
 <span className="eyebrow">MILESTONE 12 · TOKEN LAUNCH</span><h1>Create a demo token.</h1>
 <p>Experiment with your own capped ERC-20. Launch it on a verified sandbox chain, then create a liquidity pool using fake-value assets.</p>
 <Link href="/testnet/pools" className="secondary-link">Explore test pools ↗</Link>
 </div><DemoLaunch/></main>;}
