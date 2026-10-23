import { PoolDetails } from "@/components/liquidity/pool-details";
export const metadata={title:"Pool Details"};
export default async function PoolPage({params}:{params:Promise<{pair:string}>}){
  const {pair}=await params;
  return <main className="shell subpage">
    <div className="page-heading"><span className="eyebrow">LIQUIDITY DETAILS</span><h1>Pool details</h1><p>Factory-verified pair reserves, LP ownership and controlled add/remove operations.</p></div>
    <PoolDetails pair={pair}/>
  </main>;
}
