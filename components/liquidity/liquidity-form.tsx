"use client";

import Link from "next/link";
import { useMemo,useState } from "react";
import { erc20Abi, formatUnits,parseUnits, type Address } from "viem";
import { useAccount,useChainId,useReadContract } from "wagmi";
import deployments from "@/config/deployments.json";
import { very } from "@/lib/very";
import { useTokenRegistry,type SymbToken } from "@/hooks/use-token-registry";
import { useLiquidityPair } from "@/hooks/use-liquidity-pools";
import { useLiquidityExecution } from "@/hooks/use-liquidity-execution";
import { previewAdd,previewRemove,percentageOfBalance,applySlippage } from "@/lib/liquidity/math.mjs";
import { parseSlippage } from "@/lib/swap/math.mjs";
import { isTradingEnabled } from "@/lib/release-gate.mjs";

type Asset=SymbToken & {native?:boolean};
const zero="0x0000000000000000000000000000000000000000" as Address;
const short=(a:string)=>a.slice(0,7)+"…"+a.slice(-4);

export function LiquidityForm({fixedPair}:{fixedPair?:{token0:Address;token1:Address}}) {
  const {trusted}=useTokenRegistry();
  const {address}=useAccount();
  const chainId=useChainId();
  const write=useLiquidityExecution();
  const reviewedAssets:Asset[]=[...trusted];
  if (deployments.wrappedVery) reviewedAssets.unshift({
    address:deployments.wrappedVery as Address,name:"Native VERY",symbol:"VERY",
    decimals:18,verified:true,native:true,
  });
  const [first,setFirst]=useState(fixedPair?.token0??"");
  const [second,setSecond]=useState(fixedPair?.token1??"");
  const [amount0,setAmount0]=useState("");
  const [amount1,setAmount1]=useState("");
  const [mode,setMode]=useState<"add"|"remove">("add");
  const [withdrawPercent,setWithdrawPercent]=useState(50);
  const [slippage,setSlippage]=useState("0.5");
  const [deadline,setDeadline]=useState(20);
  const [initialConfirmed,setInitialConfirmed]=useState(false);
  const asset0=reviewedAssets.find(t=>t.address.toLowerCase()===first.toLowerCase());
  const asset1=reviewedAssets.find(t=>t.address.toLowerCase()===second.toLowerCase());
  const pairQuery=useLiquidityPair(asset0?.address,asset1?.address);
  const pool=pairQuery.data;
  const selected=Boolean(asset0 && asset1 && asset0.address!==asset1.address);
  const live=isTradingEnabled(deployments);
  const walletReady=Boolean(address && chainId===very.id);

  const router=deployments.router as Address|null;
  const allow0=useReadContract({address:asset0?.address??zero,abi:erc20Abi,functionName:"allowance",
    args:[address??zero,router??zero],chainId:very.id,
    query:{enabled:Boolean(live && walletReady && asset0 && !asset0.native && router)}});
  const allow1=useReadContract({address:asset1?.address??zero,abi:erc20Abi,functionName:"allowance",
    args:[address??zero,router??zero],chainId:very.id,
    query:{enabled:Boolean(live && walletReady && asset1 && !asset1.native && router)}});
  const allowLp=useReadContract({address:pool?.address??zero,abi:erc20Abi,functionName:"allowance",
    args:[address??zero,router??zero],chainId:very.id,
    query:{enabled:Boolean(live && walletReady && pool && router)}});

  const plan=useMemo(()=>{
    if (!selected || !asset0 || !asset1) return null;
    try {
      const bps=parseSlippage(slippage);
      if (mode==="remove") {
        if (!pool || pool.walletLpBalance===0n) return null;
        const burn=percentageOfBalance(pool.walletLpBalance,withdrawPercent);
        const {amount0:out0,amount1:out1}=previewRemove(burn,pool.totalSupply,pool.reserve0,pool.reserve1);
        const oriented=pool.token0.toLowerCase()===asset0.address.toLowerCase()?{a:out0,b:out1}:{a:out1,b:out0};
        return {type:"remove" as const,burn,amountA:oriented.a,amountB:oriented.b,
          minA:applySlippage(oriented.a,bps),minB:applySlippage(oriented.b,bps),bps};
      }
      const a=parseUnits(amount0,asset0.decimals),b=parseUnits(amount1,asset1.decimals);
      if (a<=0n || b<=0n) return null;
      const oriented=pool ? pool.token0.toLowerCase()===asset0.address.toLowerCase()
        ? {a:pool.reserve0,b:pool.reserve1}:{a:pool.reserve1,b:pool.reserve0} : {a:0n,b:0n};
      const result=previewAdd(a,b,oriented.a,oriented.b,pool?.totalSupply??0n);
      return {type:"add" as const,amountA:a,amountB:b,minted:result.minted,
        usedA:result.usedA,usedB:result.usedB,initial:result.initial,
        minA:applySlippage(result.usedA,bps),minB:applySlippage(result.usedB,bps),bps};
    } catch {return null;}
  },[selected,asset0,asset1,amount0,amount1,mode,withdrawPercent,slippage,pool]);
  const safePlan=plan;
  const amountNeeded0=safePlan?.type==="add"?safePlan.amountA:0n;
  const amountNeeded1=safePlan?.type==="add"?safePlan.amountB:0n;
  const missingApproval0=Boolean(live && walletReady && safePlan?.type==="add" && asset0 && !asset0.native &&
    (allow0.data===undefined || allow0.data<amountNeeded0));
  const missingApproval1=Boolean(live && walletReady && safePlan?.type==="add" && asset1 && !asset1.native &&
    (allow1.data===undefined || allow1.data<amountNeeded1));
  const missingLP=Boolean(live && walletReady && safePlan?.type==="remove" && pool && (allowLp.data===undefined || allowLp.data<safePlan.burn));
  const waiting=["validating","awaiting-signature","pending"].includes(write.phase);
  const canSend=Boolean(live && walletReady && selected && safePlan && !waiting && !pairQuery.isFetching &&
    (safePlan.type!=="add" || (!missingApproval0 && !missingApproval1 && (!safePlan.initial || initialConfirmed))) &&
    (safePlan.type!=="remove" || !missingLP));
  const showApproval=(asset:Asset|undefined,required:bigint,current:bigint|undefined,pair?:Address)=>{
    if (!asset || asset.native || !live || !walletReady || required<=0n) return null;
    return <div className="lp-approval">
      <span>{asset.symbol} allowance: {current===undefined?"Loading…":formatUnits(current,asset.decimals)}</span>
      {current!==undefined && current<required && <button type="button" disabled={waiting} onClick={()=>void write.approve(asset,current>0n?0n:required,current>0n,pair)}>
        {current>0n?"Revoke old allowance":`Approve exact ${asset.symbol}`}
      </button>}
    </div>;
  };
  return <div className="lp-form">
    <div className="lp-form-tabs">
      <button type="button" className={mode==="add"?"active":""} onClick={()=>{setMode("add");write.reset();}}>Add liquidity</button>
      <button type="button" className={mode==="remove"?"active":""} onClick={()=>{setMode("remove");write.reset();}}>Remove liquidity</button>
    </div>
    {!selected && <p className="inline-notice">Only independently reviewed tokens can be deposited. Symb currently has no configured approved pool contracts or reviewed token pairs.</p>}
    {!live && <div className="inline-notice"><strong>Transactions locked.</strong> No audited Symb factory, router and WVERY are approved for production. These forms are a development preview.</div>}
    <div className="lp-input-grid">
      <label>Token A
        <select value={first} disabled={Boolean(fixedPair)} onChange={e=>{setFirst(e.target.value);setAmount0("");setInitialConfirmed(false);}}>
          <option value="">Choose reviewed token</option>
          {reviewedAssets.map(t=><option key={t.address} value={t.address}>{t.symbol} · {short(t.address)}</option>)}
        </select>
      </label>
      <label>Token B
        <select value={second} disabled={Boolean(fixedPair)} onChange={e=>{setSecond(e.target.value);setAmount1("");setInitialConfirmed(false);}}>
          <option value="">Choose reviewed token</option>
          {reviewedAssets.map(t=><option key={t.address} value={t.address}>{t.symbol} · {short(t.address)}</option>)}
        </select>
      </label>
    </div>
    {mode==="add"? <div className="lp-input-grid">
      <label>Maximum {asset0?.symbol??"Token A"} deposit
        <input inputMode="decimal" aria-label="Maximum token A deposit" placeholder="0.00" value={amount0} onChange={e=>setAmount0(e.target.value)} autoComplete="off"/>
      </label>
      <label>Maximum {asset1?.symbol??"Token B"} deposit
        <input inputMode="decimal" aria-label="Maximum token B deposit" placeholder="0.00" value={amount1} onChange={e=>setAmount1(e.target.value)} autoComplete="off"/>
      </label>
    </div> : <div className="lp-percentage">
      <label htmlFor="lp-percent">Withdrawal: <strong>{withdrawPercent}%</strong> of wallet LP balance</label>
      <input id="lp-percent" type="range" min="1" max="100" step="1" value={withdrawPercent}
        onChange={e=>setWithdrawPercent(Number(e.target.value))}/>
      <div className="lp-percent-buttons">{[25,50,75,100].map(n=>
        <button key={n} type="button" onClick={()=>setWithdrawPercent(n)}>{n}%</button>)}</div>
    </div>}
    <div className="lp-input-grid lp-settings">
      <label>Slippage tolerance (%)
        <input type="text" inputMode="decimal" value={slippage} onChange={e=>setSlippage(e.target.value)}/>
      </label>
      <label>Transaction deadline
        <select value={deadline} onChange={e=>setDeadline(Number(e.target.value))}>
          {[5,10,20,30,60].map(n=><option key={n} value={n}>{n} minutes</option>)}
        </select>
      </label>
    </div>
    <div className="lp-preview">
      <div><span>Existing pool</span><strong>{pairQuery.isFetching?"Checking chain…":pool?short(pool.address):"None verified"}</strong></div>
      <div><span>LP balance</span><strong>{pool?formatUnits(pool.walletLpBalance,18):"—"}</strong></div>
      <div><span>Wallet share</span><strong>{pool?(Number(pool.walletShareBps)/100).toFixed(2)+"%":"—"}</strong></div>
      <div><span>{mode==="add"?"LP tokens estimated":"LP tokens to burn"}</span>
        <strong>{safePlan ? formatUnits(safePlan.type==="add"?safePlan.minted:safePlan.burn,18):"—"}</strong></div>
      <div><span>{mode==="add"?"Estimated token A used":"Token A returned"}</span>
        <strong>{safePlan&&asset0?formatUnits(safePlan.type==="add"?safePlan.usedA:safePlan.amountA,asset0.decimals):"—"}</strong></div>
      <div><span>{mode==="add"?"Estimated token B used":"Token B returned"}</span>
        <strong>{safePlan&&asset1?formatUnits(safePlan.type==="add"?safePlan.usedB:safePlan.amountB,asset1.decimals):"—"}</strong></div>
      <div><span>Minimum A / B</span>
        <strong>{safePlan&&asset0&&asset1?`${formatUnits(safePlan.minA,asset0.decimals)} / ${formatUnits(safePlan.minB,asset1.decimals)}`:"—"}</strong></div>
    </div>
    {safePlan?.type==="add" && safePlan.initial && <label className="acknowledge-row">
      <input type="checkbox" checked={initialConfirmed} onChange={e=>setInitialConfirmed(e.target.checked)}/>
      <span>This is an empty/new pool. I understand my deposit establishes its initial price and may be immediately arbitraged.</span>
    </label>}
    {safePlan?.type==="add" && <>
      {showApproval(asset0,amountNeeded0,allow0.data)}
      {showApproval(asset1,amountNeeded1,allow1.data)}
    </>}
    {safePlan?.type==="remove" && pool && showApproval({
      address:pool.address,name:"Symb LP",symbol:"LP",decimals:18,verified:true
    },safePlan.burn,allowLp.data,pool.address)}
    <button className="lp-submit" type="button" disabled={!canSend}
      onClick={()=>{
        if(!safePlan || !asset0 || !asset1) return;
        if(safePlan.type==="add") void write.addLiquidity(asset0,asset1,safePlan.amountA,safePlan.amountB,safePlan.bps,deadline,initialConfirmed);
        else if(pool) void write.removeLiquidity(asset0,asset1,pool.address,withdrawPercent,safePlan.bps,deadline);
      }}>{waiting ? `Transaction: ${write.phase}…` : !live?"Liquidity not enabled":!safePlan?"Enter a valid liquidity amount":
        mode==="add"?"Add liquidity":"Remove liquidity"}</button>
    {write.error && <p className="form-error" role="alert">{write.error}</p>}
    {pairQuery.error && <p className="form-error" role="alert">{pairQuery.error instanceof Error?pairQuery.error.message:"Unable to read pool."}</p>}
    {write.hash && <p className="lp-receipt" role="status">
      {write.phase==="confirmed"?"Transaction confirmed":write.phase==="unknown"?"Status unknown — check explorer":"Submitted"}
      {" · "}<a href={`https://veryscan.io/tx/${write.hash}`} target="_blank" rel="noreferrer">View VeryScan receipt ↗</a>
    </p>}
    <p className="muted-small">Only the connected wallet can authorize an action. Fee returns and dollar values are not estimated without a real pool and reliable market data. <Link href="/approvals" className="link-accent">Review allowances ↗</Link></p>
  </div>;
}
