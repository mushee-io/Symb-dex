import type {Metadata} from "next";
import {CinematicHome} from "@/components/marketing/cinematic-home";
import "./cinematic-home.css";

/* The site-wide exchange app and /testnet routes are not affected by this page. */
export const metadata:Metadata={
 title:"Symb Dex — Trade Without Limits",
 description:"Explore the new Symb Dex homepage for VERY. Trading tools are in development; live mainnet transactions remain disabled.",
};

export default function HomePage(){return <CinematicHome/>;}
