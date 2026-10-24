import Link from "next/link";
import {TestnetTerminal} from "@/components/testnet/testnet-terminal";
export const metadata={title:"Public Testnet · Lidde",description:"Test-only Lidde DEX: faucet and real demo-chain swaps. No real assets."};
export default function TestnetPage(){
 return <main className="shell subpage">
  <div className="page-heading"><span className="eyebrow">MILESTONE 10 · NO REAL FUNDS</span>
   <h1>Lidde Testnet</h1>
   <p>Connect a demo wallet, obtain synthetic tokens and execute verifiable sandbox-chain
    swaps. This is not VERY Mainnet; the public test network must be provisioned first.</p>
  </div>
  <TestnetTerminal/>
  <p className="subpage-footnote">See <Link href="/swap">the locked mainnet preview</Link> separately.
   Never send real VERY, USDC or other real assets to demo contracts.</p>
 </main>;
}
