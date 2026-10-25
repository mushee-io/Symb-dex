"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {
 createPublicClient,http,erc20Abi,parseUnits,formatUnits,parseAbi,isAddress,getAddress,zeroAddress,type Address,type Hash
} from "viem";
import {useAccount,useChainId,useSwitchChain,useWriteContract} from "wagmi";
import {demoChain,demoDeployment,demoNetwork,testnetReady} from "@/lib/testnet/network";
import {demoPoolByTokens,demoPoolList,type DemoPool} from "@/lib/testnet/pools";
import {previewAdd,previewRemove,percentageOfBalance,applySlippage} from "@/lib/liquidity/math.mjs";
const demoCreatorAbi=parseAbi(["function creatorOf(address) view returns(address)"]);
const routerAbi=parseAbi([
 "function factory() view returns(address)",
 "function WETH() view returns(address)",
 "function addLiquidity(address tokenA,address tokenB,uint256 amountADesired,uint256 amountBDesired,uint256 amountAMin,uint256 amountBMin,address to,uint256 deadline) returns(uint256,uint256,uint256)",
 "function addLiquidityETH(address token,uint256 desiredToken,uint256 minToken,uint256 minETH,address to,uint256 deadline) payable returns(uint256,uint256,uint256)",
 "function removeLiquidity(address a,address b,uint256 liquidity,uint256 minA,uint256 minB,address to,uint256 deadline) returns(uint256,uint256)",
 "function removeLiquidityETH(address token,uint256 liquidity,uint256 minToken,uint256 minETH,address to,uint256 deadline) returns(uint256,uint256)"
]);
const short=(x:string)=>x.slice(0,6)+"…"+x.slice(-4);
const same=(a:string,b:string)=>a.toLowerCase()===b.toLowerCase();
type Asset={symbol:string;address:Address;decimals:number;native:boolean};
const message=(e:unknown)=>e instanceof Error?e.message:"Unknown testnet wallet or RPC error.";

export function TestnetPools(){
 const dep=demoDeployment, net=demoNetwork;
 const {address,isConnected}=useAccount();
 const walletChain=useChainId();
 const {switchChainAsync}=useSwitchChain();
 const {writeContractAsync}=useWriteContract();
 const client=useMemo(()=>demoChain&&net?createPublicClient({
  chain:demoChain,transport:http(net.rpcUrl,{timeout:15_000,retryCount:1})
 }):null,[net]);
 const [customAddress,setCustomAddress]=useState("");
 const [customAsset,setCustomAsset]=useState<Asset|null>(null);
 const [customError,setCustomError]=useState("");
 const assets=useMemo<Asset[]>(()=>{
  const seeded:Asset[]=dep?[{symbol:"tVERY",address:dep.wrappedTestNative,decimals:18,native:true},
   ...dep.tokens.map(x=>({...x,native:false}))]:[];
  if(customAsset&&!seeded.some(x=>same(x.address,customAsset.address)))seeded.push(customAsset);
  return seeded;
 },[dep,customAsset]);
 const [aSymbol,setA]=useState("tUSD"),[bSymbol,setB]=useState("tBTC");
 const [amountA,setAmountA]=useState("100"),[amountB,setAmountB]=useState("1");
 const [mode,setMode]=useState<"add"|"remove">("add"),[percent,setPercent]=useState(100);
 const [slippage,setSlippage]=useState("0.5"),[ack,setAck]=useState(false);
 const [pool,setPool]=useState<DemoPool|null>(null),[directory,setDirectory]=useState<DemoPool[]>([]);
 const [page,setPage]=useState(0),[poolCount,setCount]=useState(0n);
 const [busy,setBusy]=useState(false),[loading,setLoading]=useState(false);
 const [error,setError]=useState(""),[status,setStatus]=useState("");
 const [tx,setTx]=useState<Hash|null>(null),[snapshotBlock,setSnapshotBlock]=useState<bigint|null>(null);
 const a=assets.find(x=>x.symbol===aSymbol),b=assets.find(x=>x.symbol===bSymbol);
 const ready=Boolean(testnetReady&&client&&dep&&net);
 const walletReady=Boolean(isConnected&&address&&net&&walletChain===net.chainId);
 const slippageBps=useMemo(()=>{
  const n=Number(slippage);return Number.isFinite(n)&&n>=0.1&&n<=5?Math.round(n*100):null;
 },[slippage]);
 async function loadCreatedToken(){
  setCustomError("");
  if(!client||!net||!dep?.tokenCreator){setCustomError("Testnet token creator has not been verified.");return;}
  try{
   if(!isAddress(customAddress)||getAddress(customAddress)===zeroAddress)throw new Error("Enter a valid demo token address.");
   if(await client.getChainId()!==net.chainId||net.chainId===4613)throw new Error("Wrong testnet RPC.");
   const addr=getAddress(customAddress);
   const factoryCode=await client.getBytecode({address:dep.tokenCreator});
   const code=await client.getBytecode({address:addr});
   if(!factoryCode||factoryCode==="0x"||!code||code==="0x")throw new Error("Verified demo creator or token has no deployed code.");
   const issuer=await client.readContract({address:dep.tokenCreator,abi:demoCreatorAbi,
    functionName:"creatorOf",args:[addr]});
   if(issuer===zeroAddress)throw new Error("Token was not created through the Symb demo factory.");
   const [symbol,decimals]=await Promise.all([
    client.readContract({address:addr,abi:erc20Abi,functionName:"symbol"}),
    client.readContract({address:addr,abi:erc20Abi,functionName:"decimals"})
   ]);
   if(![6,8,18].includes(decimals)||!/^t[A-Za-z0-9]{1,13}$/.test(symbol))
    throw new Error("Invalid demo token metadata.");
   const asset:Asset={symbol:"USER:"+symbol+"-"+addr.slice(2,6),address:addr,decimals,native:false};
   setCustomAsset(asset);setB(asset.symbol);setAck(false);
  }catch(e){setCustomError(message(e));}
 }
 const quote=useMemo(()=>{
  if(!a||!b||same(a.address,b.address)||slippageBps===null)return null;
  try{
   if(mode==="remove"){
    if(!pool || pool.walletLp===0n)return null;
    const burn=percentageOfBalance(pool.walletLp,percent);
    const raw=previewRemove(burn,pool.totalSupply,pool.reserve0,pool.reserve1);
    const oriented=same(pool.token0,a.address)?{outA:raw.amount0,outB:raw.amount1}:{outA:raw.amount1,outB:raw.amount0};
    return {mode:"remove" as const,burn,...oriented,
     minA:applySlippage(oriented.outA,slippageBps),minB:applySlippage(oriented.outB,slippageBps)};
   }
   const desiredA=parseUnits(amountA,a.decimals),desiredB=parseUnits(amountB,b.decimals);
   if(desiredA<=0n||desiredB<=0n)return null;
   const reserveA=pool?(same(pool.token0,a.address)?pool.reserve0:pool.reserve1):0n;
   const reserveB=pool?(same(pool.token0,a.address)?pool.reserve1:pool.reserve0):0n;
   const estimate=previewAdd(desiredA,desiredB,reserveA,reserveB,pool?.totalSupply??0n);
   return {mode:"add" as const,desiredA,desiredB,...estimate,
    minA:applySlippage(estimate.usedA,slippageBps),minB:applySlippage(estimate.usedB,slippageBps)};
  }catch{return null;}
 },[a,b,mode,pool,amountA,amountB,slippageBps,percent]);
 const refresh=useCallback(async()=>{
  if(!client||!dep||!net||!a||!b)return;
  setLoading(true);
  try{
   const [pair,pages]=await Promise.all([
    demoPoolByTokens(client,net.chainId,dep.factory,a.address,b.address,address),
    demoPoolList(client,net.chainId,dep.factory,page)
   ]);
   setPool(pair);setDirectory(pages.pools);setCount(pages.count);setSnapshotBlock(pages.atBlock);setError("");
  }catch(e){setPool(null);setDirectory([]);setError(message(e));}
  finally{setLoading(false);}
 },[client,dep,net,a?.address,b?.address,address,page]);
 useEffect(()=>{if(ready)void refresh();else{setPool(null);setDirectory([]);}},[ready,refresh]);

 async function verify():Promise<{wallet:Address,expiry:bigint}>{
  if(!client||!dep||!net||!address||!walletReady||!a||!b||same(a.address,b.address))
   throw new Error("Connect your wallet to the correctly configured test chain.");
  const [id,code,routerFactory,routerWrapper]=await Promise.all([
   client.getChainId(),client.getBytecode({address:dep.router}),
   client.readContract({address:dep.router,abi:routerAbi,functionName:"factory"}),
   client.readContract({address:dep.router,abi:routerAbi,functionName:"WETH"})
  ]);
  if(id!==net.chainId||id===4613||!code||code==="0x"||
   !same(routerFactory,dep.factory)||!same(routerWrapper,dep.wrappedTestNative))
   throw new Error("Testnet contracts or RPC do not match verified configuration.");
  return {wallet:address,expiry:BigInt(Math.floor(Date.now()/1000)+20*60)};
 }
 async function receipt(hash:Hash){
  if(!client)throw new Error("Test RPC unavailable.");
  setTx(hash);setStatus("Waiting for demo-chain confirmation…");
  const result=await client.waitForTransactionReceipt({hash,timeout:120_000,confirmations:1});
  if(result.status!=="success")throw new Error("Test liquidity transaction reverted.");
  setStatus("Confirmed on demo-chain block "+result.blockNumber.toString());
  await refresh();
 }
 async function approve(token:Asset,value:bigint){
  const {wallet}=await verify();
  if(token.native)throw new Error("Native test gas requires no ERC-20 approval.");
  const allowance=await client!.readContract({address:token.address,abi:erc20Abi,
   functionName:"allowance",args:[wallet,dep!.router]});
  const next=allowance>0n&&allowance<value?0n:value;
  const simulation=await client!.simulateContract({account:wallet,address:token.address,
   abi:erc20Abi,functionName:"approve",args:[dep!.router,next]});
  const hash=await writeContractAsync({...simulation.request,chainId:net!.chainId});
  await receipt(hash);
  setStatus(next===0n?"Previous allowance revoked. Click again to approve exact amount.":"Exact token allowance confirmed. Click again to submit liquidity.");
 }
 async function doAction(){
  if(!a||!b||!quote||busy||!client||!net||!dep)return;
  setBusy(true);setError("");setStatus("");setTx(null);
  try{
   const {wallet,expiry}=await verify();
   // Ensure this calculation was made against the same pool state still on-chain.
   const fresh=await demoPoolByTokens(client,net.chainId,dep.factory,a.address,b.address,wallet);
   if(pool?.address!==fresh?.address||pool?.reserve0!==fresh?.reserve0||
    pool?.reserve1!==fresh?.reserve1||pool?.totalSupply!==fresh?.totalSupply)
    throw new Error("Reserves changed. Refresh your preview before signing.");
   if(quote.mode==="add"){
    if(quote.initial&&!ack)throw new Error("Acknowledge the arbitrary initial pool price and locked LP supply.");
    for(const token of [a,b]){
     if(token.native)continue;
     const desired=same(token.address,a.address)?quote.desiredA:quote.desiredB;
     const balance=await client.readContract({address:token.address,abi:erc20Abi,
      functionName:"balanceOf",args:[wallet]});
     if(balance<desired)throw new Error("Insufficient "+token.symbol+". Claim free demo assets first.");
     const current=await client.readContract({address:token.address,abi:erc20Abi,
      functionName:"allowance",args:[wallet,dep.router]});
     if(current<desired){await approve(token,desired);return;}
    }
    let hash:Hash;
    if(a.native||b.native){
     const token=a.native?b:a;
     const tokenAmount=a.native?quote.desiredB:quote.desiredA;
     const minToken=a.native?quote.minB:quote.minA;
     const minNative=a.native?quote.minA:quote.minB;
     const nativeValue=a.native?quote.desiredA:quote.desiredB;
     const sim=await client.simulateContract({account:wallet,address:dep.router,abi:routerAbi,
      functionName:"addLiquidityETH",args:[token.address,tokenAmount,minToken,minNative,wallet,expiry],
      value:nativeValue});
     hash=await writeContractAsync({...sim.request,chainId:net.chainId});
    }else{
     const sim=await client.simulateContract({account:wallet,address:dep.router,abi:routerAbi,
      functionName:"addLiquidity",args:[a.address,b.address,quote.desiredA,quote.desiredB,quote.minA,quote.minB,wallet,expiry]});
     hash=await writeContractAsync({...sim.request,chainId:net.chainId});
    }
    await receipt(hash);
   }else{
    if(!fresh||fresh.walletLp<quote.burn)throw new Error("No redeemable LP balance.");
    const approval=await client.readContract({address:fresh.address,abi:erc20Abi,
     functionName:"allowance",args:[wallet,dep.router]});
    if(approval<quote.burn){
     await approve({address:fresh.address,symbol:"LP",decimals:18,native:false},quote.burn);
     return;
    }
    let hash:Hash;
    if(a.native||b.native){
     const token=a.native?b:a;
     const minToken=a.native?quote.minB:quote.minA;
     const minNative=a.native?quote.minA:quote.minB;
     const sim=await client.simulateContract({account:wallet,address:dep.router,abi:routerAbi,
      functionName:"removeLiquidityETH",args:[token.address,quote.burn,minToken,minNative,wallet,expiry]});
     hash=await writeContractAsync({...sim.request,chainId:net.chainId});
    }else{
     const sim=await client.simulateContract({account:wallet,address:dep.router,abi:routerAbi,
      functionName:"removeLiquidity",args:[a.address,b.address,quote.burn,quote.minA,quote.minB,wallet,expiry]});
     hash=await writeContractAsync({...sim.request,chainId:net.chainId});
    }
    await receipt(hash);
   }
  }catch(e){setError(message(e));}
  finally{setBusy(false);}
 }
 const assetLabel=(x:Address)=>assets.find(z=>same(z.address,x))?.symbol??short(x);
 return <div className="testnet-board">
  <div className="testnet-banner"><strong>TESTNET LIQUIDITY · ZERO REAL VALUE</strong>
   <span>{ready?net!.name:"Awaiting verified demo-chain deployment"}</span></div>
  {!ready?<section className="testnet-panel"><h2>Liquidity contracts not deployed</h2>
   <p>The LP UI stays disabled until verified demo-chain contract addresses are configured. No real VERY or assets accepted.</p>
  </section>:<>
   {!walletReady&&<div className="testnet-panel">
    <strong>Connect your wallet on the demo chain</strong>
    <p>Use the wallet selector on <a href="/testnet">the testnet swap page</a>, then return to Pools.</p>
    {isConnected&&<button type="button" onClick={()=>void switchChainAsync({chainId:net!.chainId})}>Switch to testnet</button>}
   </div>}
   <div className="testnet-grid">
    <section className="testnet-panel">
     <h2>Create / Add / Remove liquidity</h2>
     <div className="testnet-wallet-actions">
      <button type="button" onClick={()=>{setMode("add");setAck(false);}}>Add liquidity</button>
      <button type="button" onClick={()=>setMode("remove")}>Remove liquidity</button>
     </div>
     <div className="testnet-grid">
      <label>Token A<select value={aSymbol} onChange={e=>{setA(e.target.value);setAck(false);}}>
       {assets.map(x=><option key={x.symbol}>{x.symbol}</option>)}</select></label>
      <label>Token B<select value={bSymbol} onChange={e=>{setB(e.target.value);setAck(false);}}>
       {assets.map(x=><option key={x.symbol}>{x.symbol}</option>)}</select></label>
     </div>
     {dep?.tokenCreator&&<div className="testnet-order">
      <label>Custom unverified demo token contract<input placeholder="0x… from Token Creator" value={customAddress}
       onChange={e=>setCustomAddress(e.target.value)}/></label>
      <button type="button" disabled={loading||busy} onClick={()=>void loadCreatedToken()}>Verify and select creator token</button>
      {customAsset&&<p className="muted-small">Selected {customAsset.symbol}: this token is user-created, unverified and may be minted by its issuer. All values are synthetic.</p>}
      {customError&&<p role="alert" className="form-error">{customError}</p>}
     </div>}
     {mode==="add"?<div className="testnet-grid">
      <label>Maximum {aSymbol} amount<input inputMode="decimal" value={amountA} onChange={e=>setAmountA(e.target.value)} /></label>
      <label>Maximum {bSymbol} amount<input inputMode="decimal" value={amountB} onChange={e=>setAmountB(e.target.value)} /></label>
     </div>:<div>
      <label>LP withdrawal: {percent}%<input type="range" min="1" max="100" value={percent} onChange={e=>setPercent(Number(e.target.value))}/></label>
      <div className="testnet-wallet-actions">{[25,50,75,100].map(n=><button key={n} onClick={()=>setPercent(n)}>{n}%</button>)}</div>
     </div>}
     <label>Slippage tolerance (%)<input inputMode="decimal" value={slippage}
      onChange={e=>setSlippage(e.target.value)}/></label>
     {quote?.mode==="add"&&quote.initial&&<label className="acknowledge-row">
      <input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/>
      I understand that the first LP sets an arbitrary testnet pool price and 1,000 minimum LP units are locked.
     </label>}
     <div className="testnet-quote"><span>Pool</span><strong>{loading?"Loading…":pool?short(pool.address):"New pool"}</strong></div>
     <div className="testnet-quote"><span>Wallet LP balance</span><strong>{pool?formatUnits(pool.walletLp,18):"0"}</strong></div>
     <div className="testnet-quote"><span>Estimated {mode==="add"?"LP minted":"LP burned"}</span>
      <strong>{quote?formatUnits(quote.mode==="add"?quote.minted:quote.burn,18):"—"}</strong></div>
     <div className="testnet-quote"><span>Expected {aSymbol} / {bSymbol}</span>
      <strong>{quote&&a&&b?(quote.mode==="add"
       ?formatUnits(quote.usedA,a.decimals)+" / "+formatUnits(quote.usedB,b.decimals)
       :formatUnits(quote.outA,a.decimals)+" / "+formatUnits(quote.outB,b.decimals)):"—"}</strong></div>
     <button type="button" disabled={!walletReady||!quote||busy||loading||!a||!b||same(a.address,b.address)||Boolean(quote?.mode==="add"&&quote.initial&&!ack)}
      onClick={()=>void doAction()}>{busy?"Waiting for wallet / chain…":mode==="add"?"Approve or add liquidity":"Approve or withdraw LP"}</button>
     <p className="muted-small">Approvals are separate wallet transactions. A reserve change requires preview refresh. All assets are valueless.</p>
    </section>
    <section className="testnet-panel">
     <h2>Real testnet pools</h2>
     <button type="button" onClick={()=>void refresh()} disabled={loading}>↻ Refresh pool directory</button>
     <p>Factory pairs: {String(poolCount)} · Confirmed snapshot block: {snapshotBlock?.toString()??"—"}</p>
     {directory.map(p=><div className="testnet-quote" key={p.address}>
      <div><strong>{assetLabel(p.token0)} / {assetLabel(p.token1)}</strong>
       <p className="muted-small">{short(p.address)} · LP supply {formatUnits(p.totalSupply,18)}</p></div>
      <button type="button" disabled={!assets.some(a=>same(a.address,p.token0))||!assets.some(a=>same(a.address,p.token1))} onClick={()=>{setA(assetLabel(p.token0));setB(assetLabel(p.token1));setAck(false);}}>Select</button>
     </div>)}
     {!directory.length&&<p>No demo pools found. Create one after claiming test assets.</p>}
     <div className="testnet-wallet-actions">
      <button type="button" disabled={page===0||loading} onClick={()=>setPage(p=>p-1)}>Previous</button>
      <span>Page {page+1}</span>
      <button type="button" disabled={BigInt((page+1)*10)>=poolCount||loading}
       onClick={()=>setPage(p=>p+1)}>Next</button>
     </div>
    </section>
   </div>
   {error&&<p role="alert" className="form-error">{error}</p>}
   {status&&<p role="status" className="notice">{status}</p>}
   {tx&&<a className="testnet-receipt" href={net!.explorerUrl.replace(/\/$/,"")+"/tx/"+tx} target="_blank" rel="noreferrer">Test LP transaction ↗ {short(tx)}</a>}
  </>}
 </div>;
}
