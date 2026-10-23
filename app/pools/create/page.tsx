import { LiquidityForm } from "@/components/liquidity/liquidity-form";
export const metadata={title:"Create Pool"};
export default function CreatePoolPage(){
  return <main className="shell subpage">
    <div className="page-heading"><span className="eyebrow">LIQUIDITY MANAGEMENT</span>
      <h1>Create a pool</h1><p>Choose two reviewed assets, establish a price with the first deposit, or contribute to an existing pool. All writes require audited live contracts.</p>
    </div>
    <LiquidityForm />
  </main>;
}
