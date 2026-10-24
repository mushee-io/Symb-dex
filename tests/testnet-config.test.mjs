import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {validateTestnet,DEMO_TOKEN_SYMBOLS} from "../lib/testnet/config.mjs";
const read=async p=>JSON.parse(await readFile(new URL(p,import.meta.url),"utf8"));
const network=await read("../config/networks.testnet.json");
const d=await read("../config/deployments.testnet.json");
const addr=n=>"0x"+n.toString(16).padStart(40,"0");
const configured=()=>({
 network:{...network,status:"configured",chainId:31337,rpcUrl:"http://127.0.0.1:8545",explorerUrl:"http://localhost:8545"},
 deployments:{...d,status:"configured",chainId:31337,factory:addr(1),router:addr(2),wrappedTestNative:addr(3),faucet:addr(4),
 tokens:DEMO_TOKEN_SYMBOLS.map((symbol,i)=>({symbol,address:addr(i+5),decimals:i===3?8:i===4||i===5?18:6,verifiedDemo:true}))}
});
test("unprovisioned network is not usable for signing",()=>{
 assert.equal(validateTestnet({network,deployments:d}).ready,false);
 assert.equal(network.chainId,null);
 assert.equal(d.factory,null);
});
test("distinct configured demo network with reviewed contracts is accepted",()=>{
 assert.equal(validateTestnet(configured()).ready,true);
});
test("mainnet and chain mismatch fail closed",()=>{
 const x=configured();
 x.network.chainId=4613;x.deployments.chainId=4613;
 assert.equal(validateTestnet(x).ready,false);
 x.network.chainId=31337;x.deployments.chainId=1;
 assert.equal(validateTestnet(x).ready,false);
});
test("unsafe addresses, symbols or unverified official claims fail closed",()=>{
 const x=configured();x.deployments.tokens[0].address=addr(1);
 assert.equal(validateTestnet(x).ready,false);
 const y=configured();y.network.isOfficialVeryTestnet=true;
 assert.equal(validateTestnet(y).ready,false);
 const z=configured();z.deployments.tokens[0].verifiedDemo=false;
 assert.equal(validateTestnet(z).ready,false);
});
