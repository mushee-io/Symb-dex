import Link from "next/link";
import {PoolDetails} from "@/components/liquidity/pool-details";
export const metadata={title:"Pool Details"};
export default async function PoolDetailsPage({params}:{params:Promise<{address:string}>}){const {address}=await params;return <div className="dex-content-page"><div className="dex-page-heading"><Link href="/app/pools">← Back to pools</Link><h1>Pool Details</h1><p>Balances and positions are fetched only from a configured verified onchain pool.</p></div><PoolDetails pair={address}/></div>}
