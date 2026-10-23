"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useChainId } from "wagmi";
import { useTokenRegistry } from "@/hooks/use-token-registry";
import { useSwapQuote } from "@/hooks/use-swap-quote";
import { useSwapExecution } from "@/hooks/use-swap-execution";
import { parseSlippage, minimumReceived } from "@/lib/swap/math.mjs";
import { isTradingEnabled } from "@/lib/release-gate.mjs";
import { very } from "@/lib/very";
import deployments from "@/config/deployments.json";
import type { SwapDeployment } from "@/lib/swap/execution-policy.mjs";

const deployment: SwapDeployment = deployments as SwapDeployment;

type Direction = "very-to-token" | "token-to-very";

function conciseError(error: unknown) {
  if (!error) return "";
  return error instanceof Error ? error.message : "Unable to retrieve an on-chain quote.";
}

export function SwapTerminal() {
  const { tokens } = useTokenRegistry();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [direction, setDirection] = useState<Direction>("very-to-token");
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [deadline, setDeadline] = useState(20);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { phase, hash, error: submitError, estimatedGasFee, execute } = useSwapExecution();

  const token = useMemo(() => tokens.find(t=>t.address === selectedAddress) ?? null, [tokens, selectedAddress]);
  const { data: quote, configured, isFetching, isError, error: quoteError, refetch } =
    useSwapQuote(token, direction, amount);
  const swapEnabled = isTradingEnabled(deployment);
  let slippageBps: number | null = null;
  let minReceived: bigint | null = null;
  let settingError = "";
  try {
    slippageBps = parseSlippage(slippage);
    if (quote) minReceived = minimumReceived(quote.amountOut, slippageBps);
  } catch (err) { settingError = conciseError(err); }

  const inSymbol = direction === "very-to-token" ? "VERY" : token?.symbol ?? "Token";
  const outSymbol = direction === "very-to-token" ? token?.symbol ?? "Token" : "VERY";
  const awaiting = phase === "validating" || phase === "awaiting-signature" || phase === "pending";
  const canSwap = Boolean(swapEnabled && token?.verified && quote && minReceived &&
    isConnected && chainId === very.id && slippageBps !== null && !awaiting && !isFetching);
  const warning = !swapEnabled ? "No audited and approved Lidde router is deployed. This screen cannot submit transactions." :
    !token ? "Select a reviewed token to request a live quote." :
    !token.verified ? "Imported token is unverified. Trading is blocked; importing never grants verification." :
    !isConnected ? "Connect a wallet to trade." :
    chainId !== very.id ? "Switch your wallet to VERY Mainnet." :
    !configured ? "Verified factory, WVERY and confirmed AMM fee are required." :
    !quote && amount && !isFetching ? "No executable pool route found." :
    "";

  return (
    <div className="swap-container m04-terminal">
      <div className="swap-heading">
        <strong>Swap assets</strong>
        <div className="swap-heading-actions">
          <span className="status-pill">● {swapEnabled ? "Configured" : "Not live"}</span>
          <button className="swap-tool-button" type="button" onClick={() => setSettingsOpen(v=>!v)}
            aria-expanded={settingsOpen} aria-controls="swap-settings">⚙ Settings</button>
        </div>
      </div>
      {settingsOpen && <div id="swap-settings" className="swap-settings">
        <label htmlFor="swap-slippage">Maximum slippage (%)</label>
        <div className="slippage-presets">
          {["0.1","0.5","1"].map(v=><button type="button" className={slippage===v?"selected":""} onClick={()=>setSlippage(v)} key={v}>{v}%</button>)}
          <input id="swap-slippage" type="text" inputMode="decimal" aria-label="Custom slippage percent" value={slippage} onChange={e=>setSlippage(e.target.value)}/>
        </div>
        <label htmlFor="swap-deadline">Transaction deadline (minutes)</label>
        <select id="swap-deadline" value={deadline} onChange={e=>setDeadline(Number(e.target.value))}>
          {[5,10,20,30,60].map(v=><option key={v} value={v}>{v} minutes</option>)}
        </select>
        {settingError && <p className="form-error" role="alert">{settingError}</p>}
      </div>}
      <div className="token-box">
        <label className="field-label" htmlFor="swap-amount">YOU PAY</label>
        <div className="token-row">
          <input id="swap-amount" type="text" inputMode="decimal" autoComplete="off" placeholder="0.00"
            value={amount} onChange={(event)=>setAmount(event.target.value)} />
          <span className="token-chip">◈ {inSymbol}</span>
        </div>
        <span className="muted-small">Quotes are calculated from actual on-chain pool reserves, never simulated balances.</span>
      </div>
      <button type="button" className="swap-direction-button"
        aria-label="Reverse swap direction" onClick={()=>setDirection(v=>v==="very-to-token"?"token-to-very":"very-to-token")}>↕</button>
      <div className="token-box">
        <label className="field-label" htmlFor="swap-token">YOU RECEIVE</label>
        <div className="token-row">
          <output aria-label="Estimated output" className="quote-output">
            {!token || !amount ? "—" : isFetching ? "Updating…" : quote ? formatUnits(quote.amountOut, quote.outputDecimals) : "—"}
          </output>
          {direction === "very-to-token" ? (
            <select id="swap-token" className="token-dropdown" value={selectedAddress}
              onChange={(event)=>setSelectedAddress(event.target.value)}>
              <option value="">Select token</option>
              {tokens.map(t=><option key={t.address} value={t.address}>
                {t.symbol} · {t.address.slice(0,6)}…{t.address.slice(-4)} {t.verified ? "✓" : "unverified"}
              </option>)}
            </select>
          ) : <span className="token-chip">◈ VERY</span>}
        </div>
        {direction === "token-to-very" && (
          <label className="swap-token-in" htmlFor="swap-input-token">
            Pay using
            <select id="swap-input-token" className="token-dropdown" value={selectedAddress}
              onChange={(event)=>setSelectedAddress(event.target.value)}>
              <option value="">Select token</option>
              {tokens.map(t=><option key={t.address} value={t.address}>
                {t.symbol} · {t.address.slice(0,6)}…{t.address.slice(-4)} {t.verified ? "✓" : "unverified"}
              </option>)}
            </select>
          </label>
        )}
        <span className="muted-small">A token import is not an endorsement or guarantee that it can be sold.</span>
      </div>
      <div className="swap-quote-details" aria-live="polite">
        <div><span>Estimated output</span><strong>{quote ? `${formatUnits(quote.amountOut,quote.outputDecimals)} ${outSymbol}` : "—"}</strong></div>
        <div><span>Minimum received</span><strong>{minReceived && quote ? `${formatUnits(minReceived,quote.outputDecimals)} ${outSymbol}` : "—"}</strong></div>
        <div><span>Price impact (includes fees)</span><strong>{quote ? `${(quote.priceImpactBps/100).toFixed(2)}%` : "—"}</strong></div>
        <div><span>Liquidity provider fee</span><strong>{deployment.feeBps===null ? "Unconfigured" : `${deployment.feeBps/100}% per hop`}</strong></div>
        <div><span>Network fee (estimated)</span><strong>{estimatedGasFee ? `${formatUnits(estimatedGasFee,18)} VERY` : "Not available"}</strong></div>
        <div><span>Route</span><strong>{quote ? quote.path.map(p=>p.toLowerCase()===deployment.wrappedVery?.toLowerCase()?"WVERY":p.slice(0,8)+"…").join(" → ") : "No verified pool"}</strong></div>
        <div><span>Quote refreshed</span><strong>{quote ? new Date(quote.checkedAt).toLocaleTimeString() : "—"}</strong></div>
      </div>
      {quote && quote.priceImpactBps >= 500 && <p className="inline-notice">High price impact ({(quote.priceImpactBps/100).toFixed(2)}%). Confirm liquidity and expected outcome before trading.</p>}
      {warning && <div className="notice">{warning}</div>}
      {isError && <p className="form-error" role="alert">Quote error: {conciseError(quoteError)}</p>}
      <div className="swap-bottom-actions">
        <button type="button" className="refresh-quote" disabled={!configured || isFetching} onClick={()=>void refetch()}>
          {isFetching ? "Refreshing…" : "↻ Refresh quote"}
        </button>
        <Link href="/approvals">Manage approvals ↗</Link>
      </div>
      <button type="button" className="swap-submit" disabled={!canSwap}
        onClick={()=>{ if(canSwap && token && quote && slippageBps!==null) void execute({token,direction,quote,slippageBps,deadlineMinutes:deadline}); }}>
        {phase === "validating" ? "Revalidating and simulating…" :
         phase === "awaiting-signature" ? "Confirm in wallet…" :
         phase === "pending" ? "Transaction pending…" :
         !swapEnabled ? "Trading not yet enabled" : !token?.verified ? "Reviewed tokens only" :
         !quote ? "No executable quote" : "Review & execute swap"}
      </button>
      {submitError && <p className="form-error" role="alert">{submitError}</p>}
      {hash && <div className="transaction-alert" role="status">
        <strong>{phase === "confirmed" ? "Swap confirmed on VERY Mainnet" : phase === "failed" ? "Review transaction status" : "Transaction submitted"}</strong>
        <a href={`https://veryscan.io/tx/${hash}`} target="_blank" rel="noreferrer">Verify transaction on VeryScan ↗</a>
      </div>}
      <p className="muted-small" style={{ marginTop: 16 }}>Missing an asset? <Link className="link-accent" href="/explore">Import token address ↗</Link>. Imported tokens remain unverified and blocked from trading.</p>
    </div>
  );
}
