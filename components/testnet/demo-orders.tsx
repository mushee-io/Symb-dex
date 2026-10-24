"use client";
import {useEffect,useMemo,useState} from "react";
import {createPublicClient,http,erc20Abi,parseAbi,parseUnits,formatUnits,type Address,type Hash} from "viem";
import {useAccount,useChainId,useWriteContract,useSwitchChain} from "wagmi";
import {demoChain,demoDeployment,demoNetwork,testnetReady} from "@/lib/testnet/network";

const bookAbi=parseAbi([
 "function nextOrderId() view returns(uint256)",
 "function orders(uint256 id) view returns(address maker,address sellToken,address buyToken,uint128 initialSell,uint128 initialBuy,uint128 remainingSell,uint128 remainingBuy,uint64 expiry,bool cancelled)",
 "function createOrder(address sellToken,address buyToken,uint128 sellAmount,uint128 buyAmount,uint64 expiry) returns(uint256)",
 "function fill(uint256 id,uint128 receiveSellAmount) returns(uint128)",
 "function cancel(uint256 id)"
]);
const same=(a:string,b:string)=>a.toLowerCase()===b.toLowerCase();
const err=(e:unknown)=>e instanceof Error?e.message:"Unexpected wallet or sandbox-chain error";
type DemoOrder={id:bigint;maker:Address;sellToken:Address;buyToken:Address;initialSell:bigint;initialBuy:bigint;remainingSell:bigint;remainingBuy:bigint;expiry:bigint;cancelled:boolean};
export function DemoOrders(){
 const {address,isConnected}=useAccount();const walletId=useChainId();
 const {switchChainAsync}=useSwitchChain();const {writeContractAsync}=useWriteContract();
 const d=demoDeployment,n=demoNetwork;
 const book=d?.limitBook;
 const client=useMemo(()=>demoChain&&n?createPublicClient({chain:demoChain,transport:http(n.rpcUrl,{timeout:14000})}):null,[n]);
 const assets=d?.tokens??[];
 const [sell,setSell]=useState("tUSD"),[buy,setBuy]=useState("tBTC"),[sellQty,setSellQty]=useState("100"),[buyQty,setBuyQty]=useState("0.05");
 const [hours,setHours]=useState("24"),[fillQty,setFillQty]=useState<Record<string,string>>({});
 const [orders,setOrders]=useState<DemoOrder[]>([]),[busy,setBusy]=useState(false),[loading,setLoading]=useState(false);
 const [status,setStatus]=useState(""),[error,setError]=useState(""),[hash,setHash]=useState<Hash|null>(null);
 const ready=Boolean(testnetReady&&client&&book&&n&&d);
 const walletReady=Boolean(ready&&address&&isConnected&&walletId===n?.chainId);
 const sold=assets.find(x=>x.symbol===sell),bought=assets.find(x=>x.symbol===buy);
 const getAsset=(x:Address)=>assets.find(t=>same(t.address,x));
 const units=(symbol:string,v:string)=>{
  const asset=assets.find(x=>x.symbol===symbol);
  if(!asset||!/^\d+(?:\.\d+)?$/.test(v))throw new Error("Invalid demo token amount");
  const x=parseUnits(v,asset.decimals);
  if(x<=0n||x>2n**128n-1n)throw new Error("Order amount outside bounds");
  return x;
 };
 async function guard(){
  if(!client||!book||!n||!address||!walletReady)throw new Error("Connect an external wallet to the isolated test chain.");
  if(await client.getChainId()!==n.chainId||n.chainId===4613)throw new Error("Mainnet or wrong RPC refused.");
  const code=await client.getBytecode({address:book});
  if(!code||code==="0x")throw new Error("No order contract on the verified test chain.");
  return address;
 }
 async function refresh(){
  if(!ready||!client||!book)return;
  setLoading(true);
  try{
   if(await client.getChainId()!==n!.chainId)throw new Error("Wrong RPC chain");
   const next=await client.readContract({address:book,abi:bookAbi,functionName:"nextOrderId"});
   const last=next>1n?next-1n:0n;
   const first=last>19n?last-19n:1n;
   const rows:DemoOrder[]=[];
   for(let i=last;i>=first&&i>=1n;i--){
    const r=await client.readContract({address:book,abi:bookAbi,functionName:"orders",args:[i]});
    rows.push({id:i,maker:r[0],sellToken:r[1],buyToken:r[2],initialSell:r[3],
     initialBuy:r[4],remainingSell:r[5],remainingBuy:r[6],expiry:r[7],cancelled:r[8]});
    if(i===1n)break;
   }
   setOrders(rows);setError("");
  }catch(e){setError(err(e));}finally{setLoading(false);}
 }
 useEffect(()=>{if(ready)void refresh();},[ready,client,book]);
 async function send(addressTo:Address,abi:typeof bookAbi|typeof erc20Abi,fn:string,args:unknown[]){
  const me=await guard();
  const simulate=await client!.simulateContract({account:me,address:addressTo,abi:functionAbi(abi),functionName:fn as never,args:args as never});
  const h=await writeContractAsync({...simulate.request,chainId:n!.chainId});
  setHash(h);setStatus("Waiting for sandbox transaction receipt…");
  const receipt=await client!.waitForTransactionReceipt({hash:h,timeout:120000});
  if(receipt.status!=="success")throw new Error("On-chain transaction reverted.");
  setStatus("Confirmed on test block "+receipt.blockNumber.toString()+". Refresh to see updated orders.");
  return h;
 }
 function functionAbi(abi:typeof bookAbi|typeof erc20Abi){return abi;}
 async function exactApproval(token:Address,value:bigint){
  const me=await guard();
  const [allowance,balance]=await Promise.all([
   client!.readContract({address:token,abi:erc20Abi,functionName:"allowance",args:[me,book!]}),
   client!.readContract({address:token,abi:erc20Abi,functionName:"balanceOf",args:[me]})
  ]);
  if(balance<value)throw new Error("Insufficient demo tokens; claim from the faucet.");
  if(allowance>=value)return false;
  const next=allowance>0n?0n:value;
  await send(token,erc20Abi,"approve",[book!,next]);
  setStatus(next===0n?"Previous allowance reset. Click again to approve exact amount.":"Exact escrow allowance confirmed; click the action again.");
  return true;
 }
 async function execute(action:()=>Promise<void>){
  if(busy)return;setBusy(true);setStatus("");setError("");setHash(null);
  try{await action();}catch(e){setError(err(e));}finally{setBusy(false);}
 }
 async function create(){
  await guard();
  if(!sold||!bought||sell===buy)throw new Error("Choose two different demo assets.");
  const a=units(sell,sellQty),b=units(buy,buyQty);
  const deadlineHours=Number(hours);
  if(!Number.isInteger(deadlineHours)||deadlineHours<1||deadlineHours>720)throw new Error("Expiry must be 1–720 hours.");
  if(await exactApproval(sold.address,a))return;
  const expiry=BigInt(Math.floor(Date.now()/1000)+deadlineHours*3600);
  await send(book!,bookAbi,"createOrder",[sold.address,bought.address,a,b,expiry]);
  await refresh();
 }
 async function fill(o:DemoOrder){
  const sellToken=getAsset(o.sellToken),buyToken=getAsset(o.buyToken);
  if(!sellToken||!buyToken)throw new Error("Only seeded reviewed demonstration tokens supported by this UI.");
  const amount=units(sellToken.symbol,fillQty[String(o.id)]??"");
  if(amount>o.remainingSell)throw new Error("Fill is larger than available order quantity.");
  const cost=amount===o.remainingSell?o.remainingBuy:
   (amount*o.remainingBuy+o.remainingSell-1n)/o.remainingSell;
  if(cost<=0n)throw new Error("Fill amount too small.");
  if(await exactApproval(buyToken.address,cost))return;
  await send(book!,bookAbi,"fill",[o.id,amount]);await refresh();
 }
 async function cancel(id:bigint){await send(book!,bookAbi,"cancel",[id]);await refresh();}
 return <div className="testnet-board">
  <div className="testnet-banner"><strong>ON-CHAIN DEMO LIMIT ORDERS · TEST ONLY</strong><span>Escrow, partial fills, expiry, cancellation</span></div>
  {!ready?<section className="testnet-panel"><h2>Order settlement contract not deployed</h2><p>This experimental on-chain order feature stays unavailable until its code and addresses have been verified on the isolated test chain.</p></section>:<>
   {!walletReady&&<section className="testnet-panel"><p>Connect a demo EVM wallet at <a href="/testnet">Testnet Swap</a>.</p>
    {isConnected&&<button type="button" onClick={()=>void switchChainAsync({chainId:n!.chainId})}>Switch to test chain</button>}</section>}
   <div className="testnet-grid">
    <section className="testnet-panel">
     <h2>Place a demo limit order</h2>
     <p>Escrows the token you sell until another wallet fills or you cancel. Your token never represents actual money.</p>
     <label>Sell<select value={sell} onChange={e=>setSell(e.target.value)}>{assets.map(t=><option key={t.symbol}>{t.symbol}</option>)}</select></label>
     <label>Sell amount<input value={sellQty} inputMode="decimal" onChange={e=>setSellQty(e.target.value)} /></label>
     <label>Receive<select value={buy} onChange={e=>setBuy(e.target.value)}>{assets.map(t=><option key={t.symbol}>{t.symbol}</option>)}</select></label>
     <label>Minimum requested amount<input value={buyQty} inputMode="decimal" onChange={e=>setBuyQty(e.target.value)} /></label>
     <label>Expiry in hours (1–720)<input type="number" min="1" max="720" value={hours} onChange={e=>setHours(e.target.value)}/></label>
     <button type="button" disabled={!walletReady||busy||!sold||!bought||sell===buy} onClick={()=>void execute(create)}>
      {busy?"Wallet or chain processing…":"Approve / Create test order"}
     </button>
     <p className="muted-small">This is experimental escrow, not a professional matching engine. Other testers must manually fill; execution is never guaranteed.</p>
    </section>
    <section className="testnet-panel">
     <div className="testnet-row"><h2>Recent on-chain orders</h2>
      <button type="button" disabled={loading} onClick={()=>void refresh()}>↻ Refresh</button>
     </div>
     {!orders.length&&<p>No verified orders on this demo network yet.</p>}
     {orders.map(o=>{
      const a=getAsset(o.sellToken),b=getAsset(o.buyToken);
      const live=!o.cancelled&&o.remainingSell>0n&&o.expiry>BigInt(Math.floor(Date.now()/1000));
      const isMaker=Boolean(address&&same(o.maker,address));
      return <div key={String(o.id)} className="testnet-order">
       <div className="testnet-quote"><span>Order #{String(o.id)}</span><strong>{live?"OPEN":o.cancelled?"CANCELLED":o.remainingSell===0n?"FILLED":"EXPIRED"}</strong></div>
       <div className="testnet-quote"><span>Available</span><strong>{a?formatUnits(o.remainingSell,a.decimals):o.remainingSell.toString()} {a?.symbol??"Unknown token"}</strong></div>
       <div className="testnet-quote"><span>Requested</span><strong>{b?formatUnits(o.remainingBuy,b.decimals):o.remainingBuy.toString()} {b?.symbol??"Unknown token"}</strong></div>
       <p className="muted-small">Maker {o.maker.slice(0,8)}… · Expires {new Date(Number(o.expiry)*1000).toLocaleString()}</p>
       {live&&walletReady&&isMaker&&<button type="button" disabled={busy} onClick={()=>void execute(()=>cancel(o.id))}>Cancel & refund escrow</button>}
       {live&&walletReady&&!isMaker&&a&&b&&<div><label>Receive {a.symbol}<input value={fillQty[String(o.id)]??""}
        placeholder="Amount" onChange={e=>setFillQty(old=>({...old,[String(o.id)]:e.target.value}))}/></label>
        <button type="button" disabled={busy} onClick={()=>void execute(()=>fill(o))}>Approve / Fill order</button>
       </div>}
      </div>;
     })}
    </section>
   </div>
   {status&&<p role="status" className="notice">{status}</p>}
   {error&&<p role="alert" className="form-error">{error}</p>}
   {hash&&<a target="_blank" rel="noreferrer" className="testnet-receipt" href={n!.explorerUrl.replace(/\/$/,"")+"/tx/"+hash}>Inspect on-chain receipt ↗</a>}
  </>}
 </div>;
}
