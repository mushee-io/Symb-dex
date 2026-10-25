import {createServer} from "node:http";
import {decodeRpcRequest,maxBodyBytes} from "./policy.mjs";
const upstream=process.env.ANVIL_INTERNAL_URL??"http://anvil:8545";
const port=Number(process.env.GATEWAY_PORT??"8080");
const rate=Number(process.env.RPC_REQUESTS_PER_MINUTE??"120");
const origins=(process.env.RPC_ALLOWED_ORIGINS??"").split(",").map(x=>x.trim()).filter(Boolean);
if(upstream!=="http://anvil:8545"||!Number.isInteger(port)||port<1||port>65535||
 !Number.isInteger(rate)||rate<10||rate>1000||!origins.length)
 throw Error("Invalid sandbox RPC gateway configuration.");
const buckets=new Map();
function throttle(key){
 const minute=Math.floor(Date.now()/60000);
 const prior=buckets.get(key),next=prior?.minute===minute?prior:{minute,count:0};
 if(next.count>=rate)return false;
 next.count++;buckets.set(key,next);
 if(buckets.size>20000)for(const [k,v] of buckets)if(v.minute<minute)buckets.delete(k);
 return true;
}
const app=createServer(async(req,res)=>{
 const origin=req.headers.origin;
 const originOK=!origin||origins.includes(origin);
 if(originOK&&origin){res.setHeader("Access-Control-Allow-Origin",origin);res.setHeader("Vary","Origin");
  res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS");res.setHeader("Access-Control-Allow-Headers","Content-Type");}
 res.setHeader("Cache-Control","no-store");res.setHeader("X-Content-Type-Options","nosniff");
 const reply=(status,body)=>{res.writeHead(status,{"Content-Type":"application/json"});res.end(JSON.stringify(body));};
 if(req.url==="/health"&&req.method==="GET")return reply(200,{status:"gateway-up",chainVerified:false});
 if(!originOK)return reply(403,{error:"Browser origin denied"});
 if(req.method==="OPTIONS"){res.writeHead(204);return res.end();}
 if(req.url!=="/"||req.method!=="POST")return reply(404,{error:"Use POST /"});
 if(!throttle(req.socket.remoteAddress??"unknown"))return reply(429,{error:"Rate limit exceeded"});
 if(!/application\/json/i.test(req.headers["content-type"]??""))return reply(415,{error:"JSON required"});
 try{
  const parts=[];let size=0;
  for await(const part of req){size+=part.length;if(size>maxBodyBytes)throw Error("Too large");parts.push(part);}
  const parsed=decodeRpcRequest(JSON.parse(Buffer.concat(parts).toString("utf8")));
  const result=await fetch(upstream,{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify(parsed),signal:AbortSignal.timeout(10000)});
  if(!result.ok)return reply(502,{error:"Internal RPC unavailable"});
  const raw=await result.text();
  if(raw.length>2_000_000)throw Error("Response too large");
  res.writeHead(200,{"Content-Type":"application/json"});res.end(JSON.stringify(JSON.parse(raw)));
 }catch{return reply(400,{error:"Malformed, blocked, or unavailable JSON-RPC request"});}
});
app.requestTimeout=12000;app.headersTimeout=8000;
app.listen(port,"0.0.0.0",()=>console.log("Restricted sandbox RPC gateway ready on "+port));
