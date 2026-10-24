import type {Metadata} from "next";
import "./globals.css";
import {Header} from "@/components/header";
import {AppProviders} from "@/components/providers";
export const metadata:Metadata={
 title:{default:"Lidde — Testnet DEX in development",template:"%s | Lidde"},
 description:"Lidde is building a separate valueless test network for decentralized trading. No public test contracts are currently deployed.",
 robots:{index:false,follow:false},
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
 return <html lang="en"><body><AppProviders><Header/>{children}
  <footer className="footer">
   <span>© 2026 Lidde · Testnet-first development</span>
   <span>Zero-value test assets · Mainnet writes disabled</span>
   <a href="https://github.com/mushee-io/lidde-dex/blob/main/MILESTONE-10.md" target="_blank" rel="noreferrer">Milestone 10 ↗</a>
  </footer>
 </AppProviders></body></html>;
}
