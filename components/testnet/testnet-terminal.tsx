"use client";

import {useEffect,useMemo,useState} from "react";
import {
 createPublicClient,http,parseAbi,erc20Abi,parseUnits,formatUnits,
 type Address,type Hash
} from "viem";
import {useAccount,useChainId,useConnect,useSwitchChain,useWriteContract,useSignMessage} from "wagmi";
import {demoNetwork,demoDeployment,demoChain,testnetReady,testnetConfigurationIssues} from "@/lib/testnet/network";
import {getDemoQuote} from "@/lib/testnet/market.mjs";
import {claimMessage,dayUtc} from "@/lib/testnet/faucet-message.mjs";

const routerAbi=parseAbi([
 "function factory() view returns (address)",
 "function WETH() view returns (address)",
 "function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline) returns (uint256[] amounts)",
 "function swapExactETHForTokens(uint256 amountOutMin,address[] path,address to,uint256 deadline) payable returns (uint256[] amounts)",
 "function swapExactTokensForETH(uint256 amountIn,uint256 amountOutMin,address[] path,address to,uint256 deadline) returns (uint256[] amounts)",
]);
const faucetAbi=parseAbi([
 "function claim()",
 "function lastClaim(address) view returns (uint256)",
 "function claimed(address) view returns (bool)",
 "function cooldown() view returns (uint64)",
 "function nativeAmount() view returns (uint256)",
]);
type Quote={amountIn:bigint;amountOut:bigint;priceImpactBps:number;path:Address[];pair:Address};
const readable=(error:unknown)=>error instanceof Error?error.message:"An unexpected wallet or RPC error occurred.";
const short=(x:string)=>x.slice(0,6)+"…"+x.slice(-4);

export function TestnetTerminal(){
 const {address,isConnected}=useAccount();
 const walletChainId=useChainId();
 const {connectors,connectAsync,isPending:connecting}=useConnect();
 const {switchChainAsync,isPending:switching}=useSwitchChain();
 const {writeContractAsync}=useWriteContract();
 const {signMessageAsync}=useSignMessage();
 const [walletChoice,setWalletChoice]=useState("");
 const [from,setFrom]=useState("tUSD");
 const [to,setTo]=useState("tBTC");
 const [amount,setAmount]=useState("10");
 const [slippage,setSlippage]=useState("0.5");
 const [quote,setQuote]=useState<Quote|null>(null);
 const [quoting,setQuoting]=useState(false);
 const [working,setWorking]=useState(false);
 const [message,setMessage]=useState("");
 const [error,setError]=useState("");
 const [hash,setHash]=useState<Hash|null>(null);
 const [balances,setBalances]=useState<Record<string,string>>({});
 const net=demoNetwork; const dep=demoDeployment;
 const client=useMemo(()=>{
  return demoChain && net
   ?createPublicClient({chain:demoChain,transport:http(net.rpcUrl,{timeout:15_000,retryCount:1})})
   :null;
 },[net]);

 const assets=useMemo(()=>{
  if(!dep)return [];
  return [{symbol:"tVERY",decimals:18,address:dep.wrappedTestNative,native:true},
   ...dep.tokens.map(t=>({...t,native:false}))];
 },[dep]);
 const a=assets.find(t=>t.symbol===from);
 const b=assets.find(t=>t.symbol===to);
 const correctNetwork=Boolean(isConnected&&net&&walletChainId===net.chainId);
 const ready=Boolean(testnetReady&&net&&dep&&client);
 const amountBig=useMemo(()=>{
  try {
   if(!a||!/^\d+(?:\.\d+)?$/.test(amount))return null;
   const x=parseUnits(amount,a.decimals);
   return x>0n?x:null;
  }catch{return null;}
 },[amount,a]);
 const tolerance=useMemo(()=>{
  const p=Number(slippage);
  return Number.isFinite(p)&&p>=0.1&&p<=5?Math.round(p*100):null;
 },[slippage]);

 useEffect(()=>{
  if(!client||!net||!dep||!a||!b||a.symbol===b.symbol||!amountBig){setQuote(null);return;}
  let active=true;
  setQuoting(true);setQuote(null);
  void (async()=>{
   try{
    const q=await getDemoQuote(client,{chainId:net.chainId,factory:dep.factory,
     inputAddress:a.address,outputAddress:b.address,amountIn:amountBig,feeBps:dep.feeBps});
    if(active)setQuote(q as Quote|null);
   }catch(err){if(active){setQuote(null);setError(readable(err));}}
   finally{if(active)setQuoting(false);}
  })();
  return()=>{active=false;};
 },[client,net,dep,a?.address,b?.address,amountBig]);

 async function refreshBalances(){
  if(!ready||!client||!net||!address)return;
  try{
   const values:Record<string,string>={};
   const gas=await client.getBalance({address});
   values.tVERY=formatUnits(gas,18);
   for(const token of dep!.tokens){
    const bal=await client.readContract({address:token.address,abi:erc20Abi,
     functionName:"balanceOf",args:[address]});
    values[token.symbol]=formatUnits(bal,token.decimals);
   }
   setBalances(values);
  }catch(err){setError(readable(err));}
 }
 useEffect(()=>{if(correctNetwork)void refreshBalances();else setBalances({});},
  [address,correctNetwork,net?.chainId]);

 async function connect(){
  if(!net)return;
  setError("");setMessage("");
  try{
   const selected=connectors.find(c=>c.uid===walletChoice)??connectors[0];
   if(!selected)throw new Error("Install an EVM wallet or configure WalletConnect first.");
   await connectAsync({connector:selected,chainId:net.chainId});
  }catch(err){setError(readable(err));}
 }
 async function switchNetwork(){
  if(!net)return;
  setError("");
  try{await switchChainAsync({chainId:net.chainId});}
  catch(err){setError(readable(err));}
 }
 async function claimFaucet(){
  if(!ready||!client||!net||!dep||!address||!correctNetwork||working)return;
  setWorking(true);setError("");setMessage("");setHash(null);
  try{
   const balance=await client.getBalance({address});
   if(balance===0n)throw new Error(
    "A first claim needs gas. Ask the testnet operator for a sponsored faucet claim. Never send real VERY."
   );
   const simulation=await client.simulateContract({account:address,address:dep.faucet,
    abi:faucetAbi,functionName:"claim"});
   const h=await writeContractAsync({...simulation.request,chainId:net.chainId});
   setHash(h);setMessage("Faucet claim submitted. Checking chain confirmation…");
   const receipt=await client.waitForTransactionReceipt({hash:h,confirmations:1,timeout:120_000});
   if(receipt.status!=="success")throw new Error("Faucet claim reverted.");
   setMessage("Free test tokens claimed on the demo network.");
   await refreshBalances();
  }catch(err){setError(readable(err));}
  finally{setWorking(false);}
 }
 async function requestSponsoredFaucet(){
  if(!ready||!client||!net||!address||!correctNetwork||working)return;
  setWorking(true);setError("");setMessage("");setHash(null);
  try{
   const day=dayUtc();
   const signed=await signMessageAsync({account:address,message:claimMessage(address,net.chainId,day)});
   const response=await fetch("/api/testnet/faucet",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({address,day,signature:signed}),cache:"no-store"
   });
   const data=await response.json() as {error?:string;hash?:Hash;status?:string};
   if(!response.ok)throw new Error(data.error??"Faucet sponsorship unavailable.");
   if(!data.hash)throw new Error("Faucet did not return a transaction hash.");
   setHash(data.hash);setMessage("Sponsored faucet claim submitted to the test chain.");
   const receipt=await client.waitForTransactionReceipt({hash:data.hash,timeout:120_000});
   if(receipt.status!=="success")throw new Error("Operator-sponsored claim reverted.");
   setMessage("Free test gas and tokens delivered. You can now trade.");
   await refreshBalances();
  }catch(err){setError(readable(err));}
  finally{setWorking(false);}
 }
 async function swap(){
  if(!ready||!client||!net||!dep||!address||!a||!b||!amountBig||!correctNetwork||working||tolerance===null)return;
  setWorking(true);setError("");setMessage("");setHash(null);
  try{
   if(a.symbol===b.symbol)throw new Error("Choose two different demo assets.");
   if(await client.getChainId()!==net.chainId || net.chainId===4613)
    throw new Error("Wrong test network. Never use VERY Mainnet.");
   const [factoryCode,routerCode,wrapperCode]=await Promise.all([
    client.getBytecode({address:dep.factory}),client.getBytecode({address:dep.router}),
    client.getBytecode({address:dep.wrappedTestNative})
   ]);
   if(!factoryCode||factoryCode==="0x"||!routerCode||routerCode==="0x"||!wrapperCode||wrapperCode==="0x")
    throw new Error("Verified deployed test contracts not found.");
   const [actualFactory,actualWrapper]=await Promise.all([
    client.readContract({address:dep.router,abi:routerAbi,functionName:"factory"}),
    client.readContract({address:dep.router,abi:routerAbi,functionName:"WETH"})
   ]);
   if(actualFactory.toLowerCase()!==dep.factory.toLowerCase() ||
      actualWrapper.toLowerCase()!==dep.wrappedTestNative.toLowerCase())
    throw new Error("Router does not match configured testnet contracts.");
   const fresh=await getDemoQuote(client,{chainId:net.chainId,factory:dep.factory,
    inputAddress:a.address,outputAddress:b.address,amountIn:amountBig});
   if(!fresh)throw new Error("No live pool for this demo pair.");
   const minOut=fresh.amountOut*BigInt(10_000-tolerance)/10_000n;
   if(minOut<=0n)throw new Error("Trade too small to protect against slippage.");
   const deadline=BigInt(Math.floor(Date.now()/1000)+20*60);
   if(!a.native){
    const available=await client.readContract({address:a.address,abi:erc20Abi,
     functionName:"balanceOf",args:[address]});
    if(available<amountBig)throw new Error("Insufficient demo tokens. Claim from the faucet.");
    const allowance=await client.readContract({address:a.address,abi:erc20Abi,
     functionName:"allowance",args:[address,dep.router]});
    if(allowance<amountBig){
     if(allowance!==0n)throw new Error("Revoke the old allowance before approving an exact new amount.");
     const sim=await client.simulateContract({account:address,address:a.address,abi:erc20Abi,
      functionName:"approve",args:[dep.router,amountBig]});
     const approvalHash=await writeContractAsync({...sim.request,chainId:net.chainId});
     setHash(approvalHash);setMessage("Approving exactly "+amount+" "+a.symbol+"…");
     const receipt=await client.waitForTransactionReceipt({hash:approvalHash,timeout:120_000});
     if(receipt.status!=="success")throw new Error("Token approval failed.");
     setMessage("Approval confirmed. Click Swap again to execute.");
     return;
    }
   }
   let h:Hash;
   const path=fresh.path;
   if(a.native){
    const sim=await client.simulateContract({account:address,address:dep.router,abi:routerAbi,
     functionName:"swapExactETHForTokens",args:[minOut,path,address,deadline],value:amountBig});
    h=await writeContractAsync({...sim.request,chainId:net.chainId});
   }else if(b.native){
    const sim=await client.simulateContract({account:address,address:dep.router,abi:routerAbi,
     functionName:"swapExactTokensForETH",args:[amountBig,minOut,path,address,deadline]});
    h=await writeContractAsync({...sim.request,chainId:net.chainId});
   }else{
    const sim=await client.simulateContract({account:address,address:dep.router,abi:routerAbi,
     functionName:"swapExactTokensForTokens",args:[amountBig,minOut,path,address,deadline]});
    h=await writeContractAsync({...sim.request,chainId:net.chainId});
   }
   setHash(h);setMessage("Swap submitted. Waiting for test-chain confirmation…");
   const receipt=await client.waitForTransactionReceipt({hash:h,timeout:120_000});
   if(receipt.status!=="success")throw new Error("Demo swap reverted on-chain.");
   setMessage("Demo swap confirmed in block "+receipt.blockNumber.toString()+".");
   await refreshBalances();
  }catch(err){setError(readable(err));}
  finally{setWorking(false);}
 }
 return <section className="testnet-board">
  <div className="testnet-banner"><strong>TESTNET ONLY · NO REAL FUNDS</strong>
   <span>{ready?net!.name+" · Chain "+net!.chainId:"Test network awaiting verified deployment"}</span>
  </div>
  {!ready?<div className="empty-panel">
   <h2>Test contracts are not deployed yet</h2>
   <p>The devnet RPC, faucet and test contract registry must be validated before wallet signing is enabled.
   No public VERY testnet address has been assumed or invented.</p>
   <p className="muted-small">{testnetConfigurationIssues.join(" · ")}</p>
   <a href="https://github.com/mushee-io/lidde-dex/blob/main/docs/M10-DEPLOYMENT.md"
    target="_blank" rel="noreferrer">Read testnet setup and deployment guide ↗</a>
  </div>:<>
   <div className="testnet-wallet-controls">
    <div><strong>Wallet: {isConnected&&address?short(address):"Not connected"}</strong>
     <p className="muted-small">Wallet signing is isolated to chain {net!.chainId}.</p></div>
    {!isConnected?<div className="testnet-wallet-actions">
     <select aria-label="Testnet wallet provider" value={walletChoice}
      onChange={e=>setWalletChoice(e.target.value)}>
      <option value="">Choose installed wallet</option>
      {connectors.map(c=><option key={c.uid} value={c.uid}>{c.name}</option>)}
     </select>
     <button type="button" onClick={()=>void connect()} disabled={connecting}>{connecting?"Connecting…":"Connect wallet"}</button>
    </div>:!correctNetwork?
     <button type="button" onClick={()=>void switchNetwork()} disabled={switching}>Switch to Symb Testnet</button>:
     <span className="testnet-connected">Connected to testnet ✓</span>}
   </div>
   <div className="testnet-grid">
    <section className="testnet-panel">
     <h2>Free test token faucet</h2>
     <p>Claim synthetic tokens and a small amount of test gas. No real money or seed phrase required.</p>
     <div className="testnet-faucet-assets">{dep!.tokens.map(t=><span key={t.address}>{t.symbol}</span>)}</div>
     <div className="testnet-wallet-actions">
      <button type="button" disabled={!correctNetwork||working} onClick={()=>void requestSponsoredFaucet()}>
       {working?"Processing…":"Request free sponsored claim"}
      </button>
      <button type="button" disabled={!correctNetwork||working} onClick={()=>void claimFaucet()}>
       Claim using wallet gas
      </button>
     </div>
     <p className="muted-small">Gas sponsorship works only after the operator provisions the
      separate Neon anti-abuse database, private signing key and trusted gateway.
      When unavailable, it fails closed; no real funds or seed phrases are requested.
      On-chain claims enforce a 24-hour wallet cooldown.</p>
    </section>
    <section className="testnet-panel">
     <h2>Testnet Swap</h2>
     <p>Real transactions on the configured demo EVM chain. The AMM fee is 0.30% per hop.</p>
     <label>Pay token<select value={from} onChange={e=>{setFrom(e.target.value);setQuote(null);}}>
      {assets.map(t=><option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
     </select></label>
     <label>Amount<input inputMode="decimal" autoComplete="off" value={amount} onChange={e=>setAmount(e.target.value)}
      placeholder="0.00" /></label>
     <label>Receive token<select value={to} onChange={e=>{setTo(e.target.value);setQuote(null);}}>
      {assets.map(t=><option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
     </select></label>
     <label>Slippage tolerance (%)<input inputMode="decimal" value={slippage}
      onChange={e=>setSlippage(e.target.value)} /></label>
     <div className="testnet-quote"><span>Estimated output</span>
      <strong>{quoting?"Checking reserves…":quote&&b?formatUnits(quote.amountOut,b.decimals)+" "+b.symbol:"No executable pool"}</strong>
     </div>
     {quote&&<div className="testnet-quote"><span>Price impact / pool</span>
      <strong>{(quote.priceImpactBps/100).toFixed(2)}% · {short(quote.pair)}</strong></div>}
     <button type="button" disabled={!correctNetwork||!quote||working||tolerance===null||from===to}
      onClick={()=>void swap()}>{working?"Confirming on test chain…":"Approve / Swap test tokens"}</button>
     <p className="muted-small">ERC-20 approval is a separate transaction if required. Only confirmed
      sandbox-chain balances change. Synthetic prices do not represent real markets.</p>
    </section>
   </div>
   <section className="testnet-panel testnet-wallet-balances">
    <div className="testnet-row"><h2>Wallet demo balances</h2>
     <button type="button" disabled={!correctNetwork} onClick={()=>void refreshBalances()}>↻ Refresh</button></div>
    <div className="testnet-balance-grid">
     {assets.map(t=><div key={t.symbol}><small>{t.symbol}</small>
      <strong>{balances[t.symbol]??"—"}</strong></div>)}
    </div>
   </section>
   {message&&<p role="status" className="notice">{message}</p>}
   {error&&<p role="alert" className="form-error">{error}</p>}
   {hash&&<a className="testnet-receipt" target="_blank" rel="noreferrer"
    href={net!.explorerUrl.replace(/\/$/,"")+"/tx/"+hash}>Test-chain transaction receipt ↗ {short(hash)}</a>}
  </>}
 </section>;
}
