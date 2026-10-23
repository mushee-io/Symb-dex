import Link from "next/link";
import { PoolDirectory } from "@/components/liquidity/pool-directory";
export const metadata={title:"Liquidity Pools"};
export default function PoolsPage() {
  return <main className="shell subpage">
    <div className="page-heading"><span className="eyebrow">MARKET LIQUIDITY</span><h1>Liquidity Pools</h1>
      <p>Discover verified VERY pools, inspect real on-chain reserves, and manage liquidity positions using self-custodial wallets.</p>
      <Link href="/pools/create" className="secondary-link">Create a pool or add liquidity ↗</Link>
    </div>
    <PoolDirectory />
  </main>;
}
