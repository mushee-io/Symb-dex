import {OrderHistory} from "@/components/exchange/order-history";
export const metadata={title:"Order History"};
export default function Orders(){return <div className="dex-content-page"><div className="dex-page-heading"><span className="dex-eyebrow">ACCOUNT ACTIVITY</span><h1>Transaction History</h1><p>Only confirmed onchain activity will appear here once the dedicated exchange indexer is operational. There are no sample or fictional transactions.</p></div><OrderHistory/></div>}
