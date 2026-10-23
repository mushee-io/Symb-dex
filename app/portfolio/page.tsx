import { PortfolioAssets } from "@/components/portfolio-assets";

export const metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return <main className="shell subpage">
    <div className="page-heading">
      <span className="eyebrow">YOUR ASSETS</span>
      <h1>Portfolio</h1>
      <p>Read native VERY and imported ERC-20 balances directly from VERY Mainnet. Your wallet keeps custody.</p>
    </div>
    <PortfolioAssets />
  </main>;
}
