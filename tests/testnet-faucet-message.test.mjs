import test from "node:test";
import assert from "node:assert/strict";
import {dayUtc,claimMessage} from "../lib/testnet/faucet-message.mjs";
const wallet="0x1111111111111111111111111111111111111111";
test("signed faucet claims are bounded to one chain and UTC day",()=>{
 assert.equal(dayUtc(0),0);
 assert.equal(dayUtc(86_400_000),1);
 assert.match(claimMessage(wallet,31337,1),/Chain: 31337/);
 assert.notEqual(claimMessage(wallet,31337,0),claimMessage(wallet,31337,1));
});
test("cannot sign real mainnet faucet claim",()=>{
 assert.throws(()=>claimMessage(wallet,4613,1),/Invalid/);
 assert.throws(()=>claimMessage(wallet,1,1),/Invalid/);
 assert.throws(()=>claimMessage("0x000",31337,1),/Invalid/);
});
