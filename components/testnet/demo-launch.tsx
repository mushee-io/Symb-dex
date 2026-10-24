"use client";
import {useMemo,useState} from "react";
import {createPublicClient,http,parseAbi,parseEventLogs,parseUnits,type Address,type Hash} from "viem";
import {useAccount,useChainId,useWriteContract,useSwitchChain} from "wagmi";
import {demoChain,demoDeployment,demoNetwork,testnetReady} from "@/lib/testnet/network";
const abi=parseAbi([
 "function createToken(string name,string symbol,uint8 decimals,uint256 initialSupply,uint256 maxSupply) returns(address)",
 "function creatorOf(address) view returns(address)",
 "function createdTokensLength() view returns(uint256)",
 "event DemoTokenCreated(address indexed creator,address indexed token,string symbol,uint8 decimals,uint256 initialSupply,uint256 maxSupply)"
]);
const errorText=(e:unknown)=>e instanceof Error?e.message:"Unknown testchain error.";
export function DemoLaunch(){
 const {address,isConnected}=useAccount();
 const walletChain=useChainId();const {switchChainAsync}=useSwitchChain();
 const {writeContractAsync}=useWriteContract();
 const [name,setName]=useState("My Test Token"),[symbol,setSymbol]=useState("tGEM");
 const [decimals,setDecimals]=useState(18),[supply,setSupply]=useState("10000"),[cap,setCap]=useState("100000");
 const [working,setWorking]=useState(false),[status,setStatus]=useState(""),[error,setError]=useState("");
 const [token,setToken]=useState<Address|null>(null),[tx,setTx]=useState<Hash|null>(null);
 const network=demoNetwork,registry=demoDeployment;
 const client=useMemo(()=>demoChain&&network?createPublicClient({
  chain:demoChain,transport:http(network.rpcUrl,{timeout:12000})
 }):null,[network]);
 const factory=registry?.tokenCreator;
 const ready=Boolean(testnetReady&&network&&registry&&client&&factory);
 const proper=Boolean(ready&&isConnected&&address&&walletChain===network?.chainId);
 const valid=/^t[A-Za-z0-9]{1,13}$/.test(symbol)&&name.length>=3&&name.length<=64&&
  [6,8,18].includes(decimals)&&/^\d+(?:\.\d+)?$/.test(supply)&&/^\d+(?:\.\d+)?$/.test(cap);
 async function deploy(){
  if(!client||!network||!factory||!address||!proper||!valid||working)return;
  setError("");setStatus("");setWorking(true);setToken(null);setTx(null);
  try{
   const initial=parseUnits(supply,decimals),maximum=parseUnits(cap,decimals);
   if(initial<=0n||maximum<initial||maximum>(2n**192n-1n))throw new Error("Invalid or excessive fake token supply.");
   if(await client.getChainId()!==network.chainId||network.chainId===4613)throw new Error("Wrong test chain.");
   const code=await client.getBytecode({address:factory});
   if(!code||code==="0x")throw new Error("Demo creator contract is missing from this chain.");
   const simulation=await client.simulateContract({account:address,address:factory,abi,functionName:"createToken",
    args:[name,symbol,decimals,initial,maximum]});
   const hash=await writeContractAsync({...simulation.request,chainId:network.chainId});
   setTx(hash);setStatus("Token creation submitted. Waiting for confirmed block…");
   const receipt=await client.waitForTransactionReceipt({hash,timeout:120000});
   if(receipt.status!=="success")throw new Error("Token creation reverted.");
   const emitted=parseEventLogs({abi,eventName:"DemoTokenCreated",logs:receipt.logs,strict:true});
   const match=emitted.find(log=>log.address.toLowerCase()===factory.toLowerCase() &&
    log.args.creator.toLowerCase()===address.toLowerCase());
   if(!match)throw new Error("Confirmed transaction contained no expected creator event.");
   setToken(match.args.token);
   setStatus("Demo token deployed and assigned to your wallet. This token is unverified, valueless and user-mintable.");
  }catch(e){setError(errorText(e));}
  finally{setWorking(false);}
 }
 return <div className="testnet-board">
  <div className="testnet-banner"><strong>DEMO TOKEN CREATOR · TESTNET ONLY</strong><span>No real value or issuer backing</span></div>
  {!ready?<section className="testnet-panel"><h2>Demo creator not yet deployed</h2><p>Source and tests exist. This screen becomes active only when a verified dedicated test network and token creator contract are configured.</p></section>:
  <div className="testnet-grid">
   <section className="testnet-panel">
    <h2>Create a test ERC-20</h2>
    {!proper?<p>Connect your wallet on the configured demo chain.
     {isConnected&&<button type="button" onClick={()=>void switchChainAsync({chainId:network!.chainId})}>Switch test chain</button>}
     </p>:null}
    <label>Token name<input maxLength={64} value={name} onChange={e=>setName(e.target.value)}/></label>
    <label>Symbol — must start with t<input maxLength={14} value={symbol} onChange={e=>setSymbol(e.target.value)}/></label>
    <label>Decimals<select value={decimals} onChange={e=>setDecimals(Number(e.target.value))}>
     {[6,8,18].map(n=><option key={n}>{n}</option>)}</select></label>
    <label>Initial supply<input inputMode="decimal" value={supply} onChange={e=>setSupply(e.target.value)}/></label>
    <label>Maximum mintable supply<input inputMode="decimal" value={cap} onChange={e=>setCap(e.target.value)}/></label>
    <button type="button" disabled={!proper||working||!valid} onClick={()=>void deploy()}>
     {working?"Awaiting testnet confirmation…":"Create fake-value token"}
    </button>
    <p className="muted-small">The creating wallet controls later minting up to the cap. This is an UNVERIFIED demonstration asset. Other users must not mistake it for a real stablecoin or security.</p>
   </section>
   <section className="testnet-panel">
    <h2>Token creation receipt</h2>
    {token?<><div className="testnet-quote"><span>New token</span><strong>{token}</strong></div>
     <p>Use this address in <a href="/testnet/pools">Testnet Pools</a> to provide your own fake-value liquidity.</p>
     <button type="button" onClick={()=>navigator.clipboard?.writeText(token)}>Copy contract address</button>
    </>:<p>After confirmation, your deployed token address and explorer transaction will appear here. No wallet seed phrase is needed.</p>}
    {status&&<p role="status" className="notice">{status}</p>}
    {error&&<p role="alert" className="form-error">{error}</p>}
    {tx&&<a target="_blank" rel="noreferrer" className="testnet-receipt"
     href={network!.explorerUrl.replace(/\/$/,"")+"/tx/"+tx}>Inspect real testnet receipt ↗</a>}
   </section>
  </div>}
 </div>;
}
