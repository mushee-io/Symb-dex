"use client";

import { useState } from "react";
import { useAccount,useChainId,usePublicClient,useWalletClient } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { erc20Abi,getAddress,type Address,type Hash } from "viem";
import { very } from "@/lib/very";
import deployments from "@/config/deployments.json";
import { liquidityRouterAbi,liquidityPairAbi } from "@/lib/liquidity/abi";
import { getPoolByTokens,getPoolSnapshot } from "@/lib/liquidity/discovery";
import { assertLiquidityWrite,buildAddCall,buildRemoveCall,quoteLimits,deadlineFrom } from "@/lib/liquidity/policy.mjs";
import {previewAdd,previewRemove,percentageOfBalance} from "@/lib/liquidity/math.mjs";
import type { SymbToken } from "@/hooks/use-token-registry";

type Asset=SymbToken & {native?:boolean};
type Phase="idle"|"validating"|"awaiting-signature"|"pending"|"confirmed"|"unknown"|"failed";
const deployment=deployments as {
  chainId:number;status:string;releaseApproved:boolean;auditReviewed:boolean;
  factory:string|null;router:string|null;wrappedVery:string|null;
};
const same=(a:string,b:string)=>a.toLowerCase()===b.toLowerCase();

export function useLiquidityExecution() {
  const {address}=useAccount();
  const chainId=useChainId();
  const client=usePublicClient({chainId:very.id});
  const {data:wallet}=useWalletClient({chainId:very.id});
  const cache=useQueryClient();
  const [phase,setPhase]=useState<Phase>("idle");
  const [hash,setHash]=useState<Hash|null>(null);
  const [error,setError]=useState("");

  function reset(){setPhase("idle");setHash(null);setError("");}
  async function context(a:Asset,b:Asset) {
    assertLiquidityWrite({deployment,chainId,account:address,tokens:[a,b]});
    if (!client || !wallet || !address || !deployment.router || !deployment.factory || !deployment.wrappedVery)
      throw new Error("Verified router and an active wallet are required.");
    if (await client.getChainId()!==very.id || await wallet.getChainId()!==very.id)
      throw new Error("Wallet or RPC is not on VERY Mainnet.");
    const router=getAddress(deployment.router);
    const factory=getAddress(deployment.factory);
    const wrappedVery=getAddress(deployment.wrappedVery);
    // Refuse mismatched router deployments even if the config is accidentally pointed at a foreign router.
    const [routerCode,factoryCode,wrappedCode]=await Promise.all([
      client.getBytecode({address:router}),client.getBytecode({address:factory}),client.getBytecode({address:wrappedVery}),
    ]);
    if ([routerCode,factoryCode,wrappedCode].some(x=>!x || x==="0x"))
      throw new Error("Factory, router or wrapped VERY contract code is missing.");
    const [linkedFactory,linkedWrapper]=await Promise.all([
      client.readContract({address:router,abi:liquidityRouterAbi,functionName:"factory"}),
      client.readContract({address:router,abi:liquidityRouterAbi,functionName:"WETH"}),
    ]);
    if (!same(linkedFactory,factory) || !same(linkedWrapper,wrappedVery))
      throw new Error("Router does not match the approved factory and wrapped VERY configuration.");
    return {client,wallet,address,router,factory,wrappedVery};
  }
  async function ensureAllowance(asset:Asset,amount:bigint,router:Address) {
    if (asset.native) return;
    if (!client || !address) throw new Error("Wallet unavailable.");
    const current=await client.readContract({address:asset.address,abi:erc20Abi,functionName:"allowance",args:[address,router]});
    if (current<amount) throw new Error(`Approve the exact amount of ${asset.symbol} before depositing liquidity.`);
  }
  async function submit(request: {address:Address;abi:typeof liquidityRouterAbi;functionName:string;args:unknown[];value:bigint},
    ctx:Awaited<ReturnType<typeof context>>) {
    const {client,wallet,address}=ctx;
    // Mandatory contract simulation and gas affordability, including native asset value.
    const params={...request,account:address,chain:very};
    const simulation=await client.simulateContract(params as any);
    const [gas,price,nativeBalance]=await Promise.all([
      client.estimateContractGas(params as any),client.getGasPrice(),client.getBalance({address})
    ]);
    if (nativeBalance < request.value + gas*price*12n/10n)
      throw new Error("Not enough VERY to pay the deposit and network gas.");
    setPhase("awaiting-signature");
    const signed=await wallet.writeContract(simulation.request as any);
    setHash(signed);
    setPhase("pending");
    try {
      const receipt=await client.waitForTransactionReceipt({hash:signed,confirmations:1,timeout:120_000});
      if (receipt.status!=="success") {
        setPhase("failed");
        throw new Error("The liquidity transaction reverted. Inspect the receipt on VeryScan.");
      }
      setPhase("confirmed");
      await cache.invalidateQueries();
      return signed;
    } catch (e) {
      // A reverted receipt is a known failure; only an unresolved receipt has unknown status.
      setPhase(prev=>prev==="failed"?prev:"unknown");
      throw e;
    }
  }
  async function addLiquidity(a:Asset,b:Asset,amountA:bigint,amountB:bigint,slippageBps:number,
    deadlineMinutes:number,ackInitial:boolean) {
    if (phase==="pending"||phase==="awaiting-signature"||phase==="validating") return;
    reset();setPhase("validating");
    try {
      const ctx=await context(a,b);
      if (a.native && !same(a.address,ctx.wrappedVery) || b.native && !same(b.address,ctx.wrappedVery))
        throw new Error("Native VERY token must be the verified wrapped VERY address.");
      const pool=await getPoolByTokens(ctx.client,ctx.factory,a.address,b.address,ctx.address);
      if (!pool && !ackInitial) throw new Error("A new pool sets an initial market price. Acknowledge the risk first.");
      const oriented = !pool ? null : same(pool.token0,a.address)
        ? {ra:pool.reserve0,rb:pool.reserve1}
        : {ra:pool.reserve1,rb:pool.reserve0};
      // A newly created pool may exist but have no liquidity; the same risk acknowledgement is required.
      if (pool && pool.totalSupply===0n && !ackInitial)
        throw new Error("Confirm the initial price risk for an empty pool.");
      const calculation=previewAdd(amountA,amountB,oriented?.ra??0n,oriented?.rb??0n,pool?.totalSupply??0n);
      const [minA,minB]=quoteLimits(calculation.usedA,calculation.usedB,slippageBps);
      await ensureAllowance(a,amountA,ctx.router);
      await ensureAllowance(b,amountB,ctx.router);
      const call=buildAddCall({tokenA:a.address,tokenB:b.address,amountA,amountB,minA,minB,
        wrappedVery:ctx.wrappedVery,account:ctx.address,deadline:deadlineFrom(deadlineMinutes)});
      return await submit({address:ctx.router,abi:liquidityRouterAbi,...call},ctx);
    } catch(e) {
      setError(e instanceof Error?e.message:"Liquidity deposit failed.");
      setPhase(prev=>prev==="unknown"?prev:"failed");
      return null;
    }
  }
  async function removeLiquidity(a:Asset,b:Asset,pair:Address,percent:number,
    slippageBps:number,deadlineMinutes:number) {
    if (phase==="pending"||phase==="awaiting-signature"||phase==="validating") return;
    reset();setPhase("validating");
    try {
      const ctx=await context(a,b);
      const pool=await getPoolSnapshot(ctx.client,ctx.factory,pair,ctx.address);
      if (!((same(a.address,pool.token0)&&same(b.address,pool.token1)) ||
            (same(b.address,pool.token0)&&same(a.address,pool.token1))))
        throw new Error("Selected assets do not belong to this pool.");
      const amountLp=percentageOfBalance(pool.walletLpBalance,percent);
      const result=previewRemove(amountLp,pool.totalSupply,pool.reserve0,pool.reserve1);
      const allowance=await ctx.client.readContract({
        address:pool.address,abi:liquidityPairAbi,functionName:"allowance",args:[ctx.address,ctx.router]
      });
      if (allowance<amountLp) throw new Error("Approve LP tokens for the Symb router before withdrawing.");
      const [min0,min1]=quoteLimits(result.amount0,result.amount1,slippageBps);
      const call=buildRemoveCall({token0:pool.token0,token1:pool.token1,liquidity:amountLp,
        min0,min1,wrappedVery:ctx.wrappedVery,account:ctx.address,deadline:deadlineFrom(deadlineMinutes)});
      return await submit({address:ctx.router,abi:liquidityRouterAbi,...call},ctx);
    } catch(e) {
      setError(e instanceof Error?e.message:"Liquidity withdrawal failed.");
      setPhase(prev=>prev==="unknown"?prev:"failed");
      return null;
    }
  }
  async function approve(asset:Asset,amount:bigint,revoke=false,pair?:Address) {
    if (phase==="pending"||phase==="awaiting-signature"||phase==="validating") return;
    reset();setPhase("validating");
    try {
      if (!client || !wallet || !address || !deployment.router || !deployment.factory) throw new Error("Liquidity deployment is not available.");
      // LP tokens may be approved only after validation against factory-backed pool ownership.
      const ctx=await context(asset, {address:deployment.wrappedVery as Address, verified:true,name:"WVERY",symbol:"WVERY",decimals:18});
      if (asset.native) throw new Error("Native VERY does not need token approval.");
      if (pair) {
        const snapshot=await getPoolSnapshot(ctx.client,ctx.factory,pair,ctx.address);
        if (!same(snapshot.address,asset.address)) throw new Error("LP address mismatch.");
      }
      if (amount<=0n && !revoke) throw new Error("Use a positive exact approval amount.");
      const spender=ctx.router;
      const current=await ctx.client.readContract({address:asset.address,abi:erc20Abi,
        functionName:"allowance",args:[ctx.address,spender]});
      if (!revoke && current!==0n && current!==amount) throw new Error("Revoke old allowance before setting a different amount.");
      const value=revoke?0n:amount;
      const request={address:asset.address,abi:erc20Abi,functionName:"approve" as const,
        args:[spender,value] as const,account:ctx.address,chain:very};
      const simulated=await ctx.client.simulateContract(request);
      const [gas,gasPrice,native]=await Promise.all([
        ctx.client.estimateContractGas(request),ctx.client.getGasPrice(),ctx.client.getBalance({address:ctx.address})
      ]);
      if (native<gas*gasPrice*12n/10n) throw new Error("Insufficient VERY for the approval gas.");
      setPhase("awaiting-signature");
      const signed=await ctx.wallet.writeContract(simulated.request);
      setHash(signed);setPhase("pending");
      try {
        const receipt=await ctx.client.waitForTransactionReceipt({hash:signed,confirmations:1,timeout:120_000});
        if (receipt.status!=="success") {setPhase("failed");throw new Error("Approval reverted.");}
        setPhase("confirmed");await cache.invalidateQueries();return signed;
      } catch (e){setPhase(prev=>prev==="failed"?prev:"unknown");throw e;}
    } catch(e) {
      setError(e instanceof Error?e.message:"Approval failed.");
      setPhase(prev=>prev==="unknown"?prev:"failed");return null;
    }
  }
  return {phase,hash,error,reset,addLiquidity,removeLiquidity,approve};
}
