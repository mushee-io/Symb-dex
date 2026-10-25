import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";
const text=(file)=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
test("new Symb double-fish logo is a local SVG brand asset",()=>{
 assert.equal(existsSync(new URL("../public/brand/symb-fish.svg",import.meta.url)),true);
 const svg=text("public/brand/symb-fish.svg");
 assert.match(svg,/viewBox="0 0 320 212"/);
 assert.match(svg,/fill-rule="evenodd"/);
 assert.match(svg,/<path/);
 assert.ok(svg.length>3500);
});
test("new fish replaces temporary stars in branding locations",()=>{
 for(const f of ["components/header.tsx","components/layout/app-shell.tsx","components/marketing/product-preview.tsx","components/marketing/cinematic-home.tsx"]){
  assert.match(text(f),/\/brand\/symb-fish\.svg/,f);
 }
 assert.match(text("app/layout.tsx"),/\/icon\.svg/);
 const icon=text("app/icon.svg");
 assert.match(icon,/viewBox="0 0 128 128"/);
 assert.match(icon,/fill="#080808"/);
});
