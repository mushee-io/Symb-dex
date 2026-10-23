"use client";
import { PoolDirectory } from "@/components/liquidity/pool-directory";
export function PortfolioLiquidity(){return <section className="lp-portfolio-section">
  <PoolDirectory portfolio/>
  <p className="muted-small">LP holdings are checked only for reviewed pools on the current factory page. Historical earnings require a verified event indexer and a reliable price feed.</p>
</section>;}
