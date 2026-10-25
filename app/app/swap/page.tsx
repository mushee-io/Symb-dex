import Link from "next/link";
import {SwapTerminal} from "@/components/swap/swap-terminal";
import {OrderHistory} from "@/components/exchange/order-history";
export const metadata={title:"Swap"};
export default function ExchangeSwap(){
 return <div className="dex-swap-page">
  <div className="dex-exchange-tabs"><Link className="active" href="/app/swap">Swap</Link><Link href="/app/limit">Limit</Link><span className="dex-tabs-spacer"/><Link className="dex-tabs-utility" href="/app/orders" aria-label="Order history">◴</Link><Link className="dex-tabs-utility" href="/app/settings" aria-label="Settings">⚙</Link></div>
  <SwapTerminal/>
  <div className="dex-swap-footer"><span>VERY Mainnet · Chain ID 4613</span><span>Unavailable quotes are shown as —, never invented</span></div>
  <OrderHistory/>
 </div>;
}
