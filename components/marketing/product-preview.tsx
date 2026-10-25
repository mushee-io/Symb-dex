import Link from "next/link";
export type ProductPreviewData={title:string;subtitle:string;tag:string;kind:"swap"|"chart"|"pool"|"create"|"limit"|"mining"|"portfolio"|"market"|"launch"|"receipt";href:string};
export const productPreviews:ProductPreviewData[]=[
 {title:"Swap VERY",subtitle:"VERY / token",tag:"TRADE",kind:"swap",href:"/app/swap"},
 {title:"Market overview",subtitle:"Price discovery",tag:"MARKETS",kind:"chart",href:"/app/swap"},
 {title:"Your liquidity",subtitle:"Pool positions",tag:"POOLS",kind:"pool",href:"/app/pools"},
 {title:"Create a pool",subtitle:"Provide liquidity",tag:"CREATE",kind:"create",href:"/app/pools/create"},
 {title:"Limit orders",subtitle:"Define your price",tag:"LIMIT",kind:"limit",href:"/app/limit"},
 {title:"Liquidity mining",subtitle:"Rewards explorer",tag:"EARN",kind:"mining",href:"/app/mining"},
 {title:"Your portfolio",subtitle:"Self-custody",tag:"ASSETS",kind:"portfolio",href:"/app/portfolio"},
 {title:"VERY ecosystem",subtitle:"Verified assets",tag:"DISCOVER",kind:"market",href:"/app/swap"},
 {title:"Crowdpooling",subtitle:"Launchpad concept",tag:"LAUNCH",kind:"launch",href:"/app/launchpad/crowdpooling"},
 {title:"Receipts",subtitle:"Transaction history",tag:"HISTORY",kind:"receipt",href:"/app/orders"},
];
function MockBars(){return <div className="mini-bars">{[27,41,33,57,49,69,48,73,62,88,68,93].map((height,i)=><i key={i} style={{height:height+"%"}}/>)}</div>}
export function ProductPreview({data}:{data:ProductPreviewData}){
 return <div className="product-mini">
  <div className="product-mini-top"><span className="product-mini-logo"><img src="/brand/symb-fish.svg" width="20" height="14" alt="" /></span><strong>SYMB</strong><span>•••</span></div>
  <div className="product-mini-tag">{data.tag} <span>↗</span></div>
  <div className="product-mini-content">
   {data.kind==="swap"&&<div className="mini-swap"><div>YOU PAY <strong>VERY <span>▾</span></strong><b>0.00</b></div><span className="mini-center">↓</span><div>YOU RECEIVE<strong>TOKEN <span>▾</span></strong><b>—</b></div></div>}
   {data.kind==="chart"&&<div className="mini-chart"><small>VERY / TOKEN</small><MockBars/><span>Market data unavailable</span></div>}
   {data.kind==="pool"&&<div className="mini-pool"><small>POOL POSITIONS</small><div><b>VERY / TOKEN</b><em>—</em></div><div><b>Pool share</b><em>—</em></div><div><b>Liquidity</b><em>—</em></div></div>}
   {data.kind==="create"&&<div className="mini-create"><span>01 / Choose assets</span><strong>VERY</strong><span>+</span><strong>Token</strong><small>Initial deposit</small></div>}
   {data.kind==="limit"&&<div className="mini-limit"><span>LIMIT ORDER</span><strong>Set your target.</strong><div>VERY <span>0.00</span></div><div>Price <span>—</span></div><small>Preview only</small></div>}
   {data.kind==="mining"&&<div className="mini-mining"><span className="mini-mining-star">✳</span><strong>Grow together.</strong><small>Rewards programmes</small><div>Not available yet</div></div>}
   {data.kind==="portfolio"&&<div className="mini-portfolio"><span>YOUR BALANCE</span><strong>—</strong><small>Connect your wallet</small><div className="mini-progress"><i/></div></div>}
   {data.kind==="market"&&<div className="mini-market">{["VERY","WVERY","Tokens"].map(x=><div key={x}><span>◉</span><b>{x}</b><em>—</em></div>)}</div>}
   {data.kind==="launch"&&<div className="mini-launch"><span>PROJECT LAUNCHES</span><strong>New markets<br/>start here.</strong><small>Contract-backed only</small><div>Explore →</div></div>}
   {data.kind==="receipt"&&<div className="mini-receipt"><span>TRANSACTION STATUS</span><strong>Activity</strong><div>◷ No transactions yet</div><small>On-chain records only</small></div>}
  </div>
  <div className="product-mini-bottom"><strong>{data.title}</strong><span>{data.subtitle}</span></div>
 </div>;
}
