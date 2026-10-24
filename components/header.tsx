import Link from "next/link";
import {WalletConnect} from "@/components/wallet-connect";
export function Header(){
 return <header className="site-header"><div className="header-inner">
  <Link href="/" className="brand" aria-label="Lidde home"><span className="brand-mark">↔</span>
   <span>lidde<span className="brand-dot">.</span></span></Link>
  <nav className="top-nav" aria-label="Main navigation">
   <Link href="/testnet">Testnet</Link>
   <Link href="/swap">Mainnet Preview</Link>
   <Link href="/pools">Pools</Link>
   <Link href="/explore">Explore</Link>
   <Link href="/portfolio">Portfolio</Link>
  </nav><WalletConnect/>
 </div></header>;
}
