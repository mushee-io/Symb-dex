import type {Metadata} from "next";
import "./globals.css";
import "./home.css";
import "./exchange.css";
import {AppProviders} from "@/components/providers";
import {SiteChrome} from "@/components/layout/site-chrome";

export const metadata:Metadata={
 title:{default:"Symb Dex — Trade Without Limits",template:"%s | Symb Dex"},
 description:"Symb Dex is building the trading and liquidity layer for VERY. Explore swap, liquidity and onchain markets. Mainnet execution remains disabled while contracts and security reviews are pending.",
 icons:{icon:"/icon.svg",shortcut:"/icon.svg",apple:"/icon.svg"},
 robots:{index:false,follow:false},
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
 return <html lang="en"><head>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@600;700;800&display=swap" rel="stylesheet"/>
 </head><body><AppProviders><SiteChrome>{children}</SiteChrome></AppProviders></body></html>;
}
