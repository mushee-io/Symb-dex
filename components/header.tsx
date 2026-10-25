import Link from "next/link";
import {WalletConnect} from "@/components/wallet-connect";

export function Header(){
  return <header className="site-header">
    <div className="header-inner">
      <Link href="/" className="brand" aria-label="Symb Dex homepage">
        <span className="brand-mark">↗</span>
        <span>Symb<span className="brand-dot"> Dex</span></span>
      </Link>
      <nav className="top-nav" aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/testnet">Trade</Link>
        <Link href="/testnet/markets">Markets</Link>
        <Link href="/testnet/pools">Pools</Link>
        <Link href="/testnet/launch">Launch</Link>
        <Link href="/testnet/status">Status</Link>
      </nav>
      <WalletConnect/>
    </div>
  </header>;
}
