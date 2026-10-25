import type {Metadata} from "next";
import "./globals.css";
import "./home.css";
import {Header} from "@/components/header";
import {AppProviders} from "@/components/providers";

export const metadata:Metadata={
  title:{default:"Symb Dex — The market. Your move.",template:"%s | Symb Dex"},
  description:"Explore decentralized swaps, liquidity, token creation and demo orders with Symb Dex. An isolated public testnet is in development. No real-value trading is live.",
  robots:{index:false,follow:false},
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  return <html lang="en"><body>
    <AppProviders>
      <Header/>
      {children}
      <footer className="footer">
        <span>© 2026 Symb Dex. All rights reserved.</span>
        <span>Public testnet in development · No real-value trading</span>
        <a href="https://github.com/mushee-io/Symb-dex" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      </footer>
    </AppProviders>
  </body></html>;
}
