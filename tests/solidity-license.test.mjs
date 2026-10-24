import test from "node:test";
import assert from "node:assert/strict";
import {readFile,readdir} from "node:fs/promises";

test("root contains the explicit MIT license and npm metadata",async()=>{
 const license=await readFile(new URL("../LICENSE",import.meta.url),"utf8");
 const pkg=JSON.parse(await readFile(new URL("../package.json",import.meta.url),"utf8"));
 assert.match(license,/MIT License/);
 assert.match(license,/Copyright \(c\) 2026 Mushee contributors/);
 assert.equal(pkg.license,"MIT");
});
test("every new Solidity source and test file declares MIT",async()=>{
 for(const folder of ["src","test"]){
   const folderUrl=new URL("../contracts/"+folder+"/",import.meta.url);
   const names=await readdir(folderUrl,{recursive:true});
   for(const name of names.filter(n=>n.endsWith(".sol"))){
     const content=await readFile(new URL(name,folderUrl),"utf8");
     assert.match(content,/SPDX-License-Identifier: MIT/);
   }
 }
});
test("mainnet contract registry remains fail closed despite Solidity sources",async()=>{
 const d=JSON.parse(await readFile(new URL("../config/deployments.json",import.meta.url),"utf8"));
 assert.equal(d.status,"not-deployed");
 for(const field of ["factory","router","wrappedVery","feeBps"])assert.equal(d[field],null);
 assert.equal(d.releaseApproved,false);assert.equal(d.auditReviewed,false);
});
