"use client";
import {usePathname} from "next/navigation";
import {Header} from "@/components/header";
import type {ReactNode} from "react";
export function SiteChrome({children}:{children:ReactNode}){
 const path=usePathname();
 if(path==="/") return <>{children}</>;
 if(path==="/app"||path.startsWith("/app/")) return <>{children}</>;
 return <><Header/>{children}<footer className="footer"><span>© 2026 Symb Dex</span><span>Building for VERY · Trading contracts not yet live</span><a href="https://github.com/mushee-io/Symb-dex" target="_blank" rel="noopener noreferrer">Source ↗</a></footer></>;
}
