import {PortfolioAssets} from "@/components/portfolio-assets";
export const metadata={title:"Portfolio"};
export default function PortfolioPage(){return <div className="dex-content-page"><div className="dex-page-heading"><span className="dex-eyebrow">ACCOUNT OVERVIEW</span><h1>My Portfolio</h1><p>Connect a wallet to inspect your actual VERY balance, imported ERC-20 assets and verified liquidity positions. Your wallet remains in control.</p></div><div className="dex-panel dex-portfolio-frame"><PortfolioAssets/></div></div>}
