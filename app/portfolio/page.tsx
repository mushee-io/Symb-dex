export const metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return <main className="shell subpage">
    <div className="page-heading"><span className="eyebrow">YOUR ASSETS</span><h1>Portfolio</h1><p>Wallet-native and non-custodial. Your VERY balance is read directly from your wallet in the header.</p></div>
    <div className="empty-panel"><h2>LP positions are not yet available.</h2><p>No user funds are held by Lidde. Position tracking and verified pool balances will arrive in the liquidity milestone.</p></div>
  </main>;
}
