import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: { default: "Lidde — VERY Chain DEX", template: "%s | Lidde" },
  description: "Lidde is building non-custodial trading and liquidity on VERY Chain. Trading is not live.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <footer className="footer">
          <span>© 2026 Lidde · Built on VERY Chain</span>
          <span>Development preview · No live swaps</span>
          <a href="https://veryscan.io" target="_blank" rel="noreferrer">VeryScan ↗</a>
        </footer>
      </body>
    </html>
  );
}
