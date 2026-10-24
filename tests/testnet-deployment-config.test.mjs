import test from "node:test";
import assert from "node:assert/strict";
import {deploymentAddresses} from "../lib/testnet/deployment-config.mjs";
const address=i=>"0x"+i.toString(16).padStart(40,"0");
const example=[
 "LiddeFactory","LiddeWrappedVery","LiddeRouter",
 ...Array(6).fill("LiddeTestToken"),"LiddeTestFaucet"
].map((contractName,i)=>({contractName,contractAddress:address(i+1)}));
test("broadcast-derived config uses deployment order and immutable fake asset metadata",()=>{
 const value=deploymentAddresses(example);
 assert.equal(value.tokens.length,6);
 assert.equal(value.tokens[0].symbol,"tUSD");
 assert.equal(value.tokens[3].decimals,8);
 assert.equal(value.router.toLowerCase(),address(3));
});
test("reject missing or duplicated deployments",()=>{
 assert.throws(()=>deploymentAddresses(example.slice(1)),/Factory/);
 assert.throws(()=>deploymentAddresses([...example,example[0]]),/Factory/);
 assert.throws(()=>deploymentAddresses(example.map(x=>({...x,contractAddress:address(1)}))),/overlap/);
});
