"use client";

import Link from "next/link";
import {useCallback, useEffect, useRef, useState} from "react";

const FILM_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4";

function ArrowIcon(){
 return <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 12 12 2M5 2h7v7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function PlayIcon(){
 return <svg width="17" height="19" viewBox="0 0 17 19" aria-hidden="true"><path d="M3 2.5 14 9.5 3 16.5z" fill="currentColor"/></svg>;
}

export function CinematicHome(){
 const [menuOpen,setMenuOpen]=useState(false);
 const [demoOpen,setDemoOpen]=useState(false);
 const [motionPending,setMotionPending]=useState(true);
 const menuRef=useRef<HTMLDivElement>(null);
 const toggleRef=useRef<HTMLButtonElement>(null);
 const dialogCloseRef=useRef<HTMLButtonElement>(null);
 const demoWasOpen=useRef(false);

 const closeMenu=useCallback(()=>setMenuOpen(false),[]);
 useEffect(()=>{
   const compact=window.matchMedia("(max-width: 790px), (min-width: 791px) and (max-width: 1100px) and (orientation: portrait)");
   const syncInert=()=>{if(menuRef.current) menuRef.current.inert=compact.matches&&!menuOpen;};
   syncInert();
   compact.addEventListener("change",syncInert);
   function outside(e:PointerEvent){
     const node=e.target;
     if(menuOpen && node instanceof Node && !menuRef.current?.contains(node) && !toggleRef.current?.contains(node)) closeMenu();
   }
   function escape(e:KeyboardEvent){
     if(e.key==="Escape"){if(menuOpen){closeMenu();toggleRef.current?.focus();}if(demoOpen)setDemoOpen(false);}
   }
   document.addEventListener("pointerdown",outside);
   document.addEventListener("keydown",escape);
   return ()=>{compact.removeEventListener("change",syncInert);document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
 },[menuOpen,demoOpen,closeMenu]);

 useEffect(()=>{
   const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
   if(reduce.matches){setMotionPending(false);return;}
   const timer=window.setTimeout(()=>setMotionPending(false),3500);
   return ()=>window.clearTimeout(timer);
 },[]);
 useEffect(()=>{
   if(menuOpen)window.requestAnimationFrame(()=>menuRef.current?.querySelector("a")?.focus());
 },[menuOpen]);
 useEffect(()=>{
   if(demoOpen){demoWasOpen.current=true;dialogCloseRef.current?.focus();}
   else if(demoWasOpen.current){demoWasOpen.current=false;document.querySelector<HTMLButtonElement>(".cinematic-home-viewport .watch-button")?.focus();}
 },[demoOpen]);

 return <main className={"cinematic-home-viewport viewport"+(motionPending?" motion-pending":"")}>
  <section className="screen" id="screen">
   <video className="background" autoPlay muted loop playsInline disablePictureInPicture aria-hidden="true" preload="metadata">
    <source src={FILM_URL} type="video/mp4"/>
   </video>

   <header className={"header"+(menuOpen?" menu-open":"")}>
    <Link className="brand" href="/" aria-label="Symb Dex home" onClick={closeMenu}>
      <span className="brand-emblem"><img src="/brand/symb-fish.svg" width="27" height="19" alt=""/></span>
      <span className="brand-type">SYMB <b>DEX</b></span>
    </Link>
    <div className="header-actions" id="tablet-navigation" ref={menuRef}>
      <nav className="nav" aria-label="Main navigation">
       <Link aria-current="page" href="/" onClick={closeMenu}>Home</Link>
       <Link href="/testnet/status" onClick={closeMenu}>About</Link>
       <Link href="/app/swap" onClick={closeMenu}>Services</Link>
       <a href="https://github.com/mushee-io/Symb-dex" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Contact</a>
      </nav>
      <div className="time-panel" aria-label="Network information">
        <span className="time-label">Network</span>
        <span className="time-value">VERY Mainnet&nbsp; • &nbsp;4613</span>
      </div>
      <Link className="sign-up" href="/app/swap" onClick={closeMenu}>Launch App</Link>
    </div>
    <button ref={toggleRef} type="button" className="menu-toggle" aria-label={menuOpen?"Close menu":"Open menu"} aria-controls="tablet-navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}>
     <span className="menu-bars" aria-hidden="true"><i/><i/></span>
    </button>
   </header>

   <section className="hero" aria-labelledby="symb-hero-title">
    <div className="hero-content">
      <h1 id="symb-hero-title" className="hero-title">
       <span className="line line-one"><span className="line-reveal">Trade Without</span></span>
       <span className="line line-two"><span className="line-reveal">Limits on VERY.</span></span>
      </h1>
      <p className="hero-copy">Explore swaps, liquidity, and onchain markets on VERY.<br/>
       Symb Dex brings the exchange into one clear experience.<br/>
       Mainnet trading is not live yet.
      </p>
      <Link href="/app/swap" className="primary-cta">
       <span className="label">Get Started</span><span className="arrow-box"><ArrowIcon/></span>
      </Link>
    </div>

    <article className="demo-card" aria-label="Symb visual preview" onAnimationEnd={event=>{if(event.target===event.currentTarget)setMotionPending(false);}}>
     <div className="demo-visual">
      <img src="/brand/symb-smoke-thumbnail.svg" alt="Abstract red and blue smoke"/>
      <button className="play" type="button" aria-label="Play demo" onClick={()=>setDemoOpen(true)}><PlayIcon/></button>
     </div>
     <button className="watch-button" type="button" onClick={()=>setDemoOpen(true)}>Watch Demo <span aria-hidden="true">↗</span></button>
    </article>
   </section>
  </section>

  {demoOpen&&<div className="demo-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setDemoOpen(false);}}>
    <section role="dialog" aria-modal="true" aria-label="Symb visual preview video" className="demo-dialog">
      <div className="demo-dialog-top"><span>Symb Dex · Cinematic preview footage</span><button ref={dialogCloseRef} type="button" onClick={()=>setDemoOpen(false)} aria-label="Close demo">×</button></div>
      <video controls playsInline autoPlay muted src={FILM_URL}>Your browser cannot play this preview.</video>
      <p>This is the homepage film, not a demonstration of live trading. Symb Dex remains under development.</p>
    </section>
  </div>}
 </main>;
}
