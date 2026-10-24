import test from "node:test";
import assert from "node:assert/strict";
import {assessWrapper} from "../lib/wrapper-assessment.mjs";
const ok={code:"0x60016000",name:"Wrapped VERY",symbol:"WVERY",decimals:18,supply:10n,nativeBalance:10n};
test("even a properly collateralized wrapper is never automatically canonical",()=>{
 const result=assessWrapper(ok);
 assert.equal(result.checksPassed,true);
 assert.equal(result.canonicalVerified,false);
 assert.match(result.conclusion,/UNVERIFIED/);
});
test("reject an explorer token label pointing to EOA, fake symbol or unbacked supply",()=>{
 assert.equal(assessWrapper({...ok,code:"0x"}).checksPassed,false);
 assert.equal(assessWrapper({...ok,symbol:"TEST"}).checksPassed,false);
 assert.equal(assessWrapper({...ok,nativeBalance:9n}).checksPassed,false);
 assert.equal(assessWrapper({...ok,supply:0n}).checksPassed,false);
});
