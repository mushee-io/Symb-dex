// Dedicated continuous valueless chain indexer; bounded, safe on restart.
import {spawn} from "node:child_process";
const interval=Number(process.env.TESTNET_INDEXER_POLL_SECONDS??"10");
if(!Number.isInteger(interval)||interval<5||interval>300)throw Error("Invalid indexer poll period");
let stopped=false,errors=0;
for(const signal of ["SIGINT","SIGTERM"])process.once(signal,()=>{stopped=true;});
while(!stopped){
 const start=Date.now();
 const exit=await new Promise(resolve=>{
  const p=spawn(process.execPath,["scripts/index-testnet.mjs"],{stdio:"inherit",env:process.env});
  p.once("error",e=>{console.error("Indexer process failure",e.message);resolve(1);});
  p.once("exit",code=>resolve(code??1));
 });
 errors=exit===0?0:Math.min(errors+1,7);
 if(exit!==0)console.error("Indexer could not advance canonical cursor. Failures:",errors);
 if(stopped)break;
 const sleep=Math.min(300000,interval*1000*2**errors);
 await new Promise(r=>setTimeout(r,Math.max(0,sleep-(Date.now()-start))));
}
