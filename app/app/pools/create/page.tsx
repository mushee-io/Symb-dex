import Link from "next/link";
import {LiquidityForm} from "@/components/liquidity/liquidity-form";
export const metadata={title:"Create Pool"};
export default function CreatePool(){return <div className="dex-content-page"><div className="dex-page-heading"><Link href="/app/pools">← Back to pools</Link><h1>Create Liquidity Pool</h1><p>Choose reviewed assets, enter deposits and review the actual factory state. Mainnet writes remain disabled without verified contracts and release approval.</p></div><div className="dex-panel dex-full-form"><LiquidityForm/></div></div>}
