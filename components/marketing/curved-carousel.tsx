"use client";
import Link from "next/link";
import {useEffect,useRef,useState,type PointerEvent} from "react";
import {ProductPreview,productPreviews} from "@/components/marketing/product-preview";
const COUNT=productPreviews.length;
export function CurvedCarousel(){
 const container=useRef<HTMLDivElement>(null);
 const refs=useRef<Array<HTMLDivElement|null>>([]);
 const state=useRef({offset:0,last:0,down:false,start:0,startOffset:0,priorX:0,priorTime:0,velocity:0,dragged:false,reduced:false,visible:true});
 const [isDragging,setDragging]=useState(false);
 useEffect(()=>{
  const root=container.current;if(!root)return;
  const stateRef=state.current;
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  stateRef.reduced=media.matches;
  const setMedia=()=>{stateRef.reduced=media.matches;};
  media.addEventListener("change",setMedia);
  const observer=new IntersectionObserver(entries=>{stateRef.visible=entries[0]?.isIntersecting??true;},{threshold:0.01});
  observer.observe(root);
  let frame=0;
  const paint=(time:number)=>{
    const s=stateRef;
    const dt=s.last?Math.min(.06,(time-s.last)/1000):0;
    s.last=time;
    if(s.visible&&!s.reduced&&!s.down){
      if(Math.abs(s.velocity)>2){s.offset+=s.velocity*dt;s.velocity*=Math.pow(.05,dt);}
      else {s.velocity=0;s.offset-=50*dt;}
    }
    const width=root.clientWidth;
    const scale=width<=720?Math.max(.76,Math.min(1,width/480)):Math.min(1,width/1440);
    const pitch=(width<=720?145:196)*scale;
    const cycle=COUNT*pitch;
    if(cycle>0){s.offset=((s.offset%cycle)+cycle)%cycle;}
    const cardBase=(width<=720?148:170)*scale;
    refs.current.forEach((node,i)=>{
      if(!node)return;
      const raw=(i-(COUNT-1)/2)*pitch+s.offset;
      const t=((raw+cycle/2)%cycle+cycle)%cycle-cycle/2;
      const normalized=Math.min(1,Math.abs(t)/(Math.max(250,width/2)));
      const curve=t*(1+.083*normalized*normalized);
      const cw=cardBase*(1+.25*normalized*normalized);
      const tall=(width<=720?245:280)*scale+90*scale*Math.pow(normalized,2.6);
      const edgeInset=10*scale*normalized;
      node.style.width=cw+"px";node.style.height=tall+"px";
      node.style.transform=`translate3d(${curve-cw/2}px,${-tall/2+12*normalized*normalized*scale}px,0)`;
      node.style.clipPath=`polygon(0 ${edgeInset}px,100% 0,100% 100%,0 calc(100% - ${edgeInset}px))`;
      node.style.opacity=Math.abs(curve)>width*.66?"0":"1";
      node.style.zIndex=String(Math.round(100-normalized*50));
    });
    frame=window.requestAnimationFrame(paint);
  };
  frame=window.requestAnimationFrame(paint);
  return ()=>{window.cancelAnimationFrame(frame);observer.disconnect();media.removeEventListener("change",setMedia);}
 },[]);
 const onDown=(event:PointerEvent<HTMLDivElement>)=>{
   if(event.pointerType==="mouse"&&event.button!==0)return;
   const s=state.current;s.down=true;s.dragged=false;s.start=event.clientX;s.startOffset=s.offset;s.priorX=event.clientX;s.priorTime=performance.now();s.velocity=0;
   event.currentTarget.setPointerCapture(event.pointerId);setDragging(true);
 };
 const onMove=(event:PointerEvent<HTMLDivElement>)=>{
   const s=state.current;if(!s.down)return;
   const dx=event.clientX-s.start;
   if(Math.abs(dx)>5)s.dragged=true;
   const now=performance.now();const dt=Math.max(8,now-s.priorTime);
   s.velocity=(event.clientX-s.priorX)/dt*1000;
   s.offset=s.startOffset+dx;s.priorX=event.clientX;s.priorTime=now;
 };
 const onUp=()=>{state.current.down=false;setDragging(false);};
 return <div ref={container} className={"curved-carousel"+(isDragging?" is-dragging":"")} aria-label="Interactive Symb product previews" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
  {productPreviews.map((data,i)=><div className="curved-item" key={data.kind} ref={node=>{refs.current[i]=node;}}>
   <Link href={data.href} draggable={false} onClick={e=>{if(state.current.dragged){e.preventDefault();state.current.dragged=false;}}} aria-label={`Open ${data.title} in Symb Dex`}>
    <ProductPreview data={data}/>
   </Link>
  </div>)}
 </div>;
}
