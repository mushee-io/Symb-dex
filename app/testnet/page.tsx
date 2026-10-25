import Link from "next/link";
import {TestnetTerminal} from "@/components/testnet/testnet-terminal";
export const metadata={title:"Public Testnet · Symb",description:"Test-only Symb DEX: faucet and real demo-chain swaps. No real assets."};
export default function TestnetPage(){
 return <main className="shell subpage">
  <div className="page-heading"><span className="eyebrow">MILESTONE 10 · NO REAL FUNDS</span>
   <h1>Symb Testnet</h1>
   <p>Connect a demo wallet, obtain synthetic tokens and execute verifiable sandbox-chain
    swaps. This is not VERY Mainnet; the public test network must be provisioned first.</p>
  </div>
  <p><Link href="/testnet/pools" className="primary-link">Create or manage test liquidity ↗</Link></p>
  <p className="testnet-wallet-actions"><Link href="/testnet/launch" className="secondary-link">Create demo token ↗</Link><Link href="/testnet/orders" className="secondary-link">Test limit orders ↗</Link></p>
  <TestnetTerminal/>
  <p className="subpage-footnote">See <Link href="/swap">the locked mainnet preview</Link> separately.
   Never send real VERY, USDC or other real assets to demo contracts.</p>
 </main>;
}
