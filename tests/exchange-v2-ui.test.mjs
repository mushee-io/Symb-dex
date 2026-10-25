import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const source=(name)=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
test("public homepage leads to the actual app with an original curved carousel",()=>{
 const home=source("app/page.tsx");
 const carousel=source("components/marketing/curved-carousel.tsx");
 const tiles=source("components/marketing/product-preview.tsx");
 assert.match(home,/Trade Without Limits/);
 assert.match(home,/Built for VERY/);
 assert.match(home,/href="\/app\/swap"/);
 assert.match(home,/CurvedCarousel/);
 assert.equal((tiles.match(/title:"/g)||[]).length,10);
 assert.match(carousel,/requestAnimationFrame/);
 assert.match(carousel,/prefers-reduced-motion/);
 assert.match(carousel,/onPointerMove/);
 assert.match(carousel,/IntersectionObserver/);
});
test("exchange app exposes all user-visible routes, with no dead-end page files",()=>{
 for(const page of [
 "swap","limit","pools","pools/create","pools/[address]",
 "mining","mining/create","launchpad","launchpad/crowdpooling","launchpad/create",
 "orders","portfolio","settings"
 ])assert.equal(existsSync(new URL("../app/app/"+page+"/page.tsx",import.meta.url)),true,page);
 const shell=source("components/layout/app-shell.tsx");
 for(const route of ["/app/swap","/app/limit","/app/pools","/app/mining","/app/launchpad","/app/portfolio","/app/orders"])
 assert.ok(shell.includes(route),route);
 assert.match(shell,/reviewed VERY tokens/i);
});
test("visual-only screens do not advertise unverified functionality",()=>{
 const ui=source("app/app/mining/page.tsx")+source("app/app/launchpad/crowdpooling/page.tsx")+source("app/app/limit/page.tsx");
 assert.match(ui,/not deployed|not yet deployed|not live/i);
 assert.match(ui,/No APR figures are simulated/);
 assert.match(ui,/No fabricated/);
 assert.match(source("components/exchange/order-history.tsx"),/No orders to display/);
 assert.match(source("app/page.tsx"),/product previews are illustrations/i);
 const limit=source("app/app/limit/page.tsx");
 assert.match(limit,/button disabled/);
});
test("mainnet and independent testnet remain clearly distinct",()=>{
 const mainnet=JSON.parse(source("config/very-mainnet.json"));
 const testnet=JSON.parse(source("config/networks.testnet.json"));
 assert.equal(mainnet.chainId,4613);
 assert.equal(testnet.status,"not-configured");
 assert.equal(testnet.realFundsAllowed,false);
 assert.doesNotMatch(source("app/app/limit/page.tsx"),/writeContractAsync/);
 assert.doesNotMatch(source("app/app/mining/page.tsx"),/writeContractAsync/);
 assert.doesNotMatch(source("app/app/launchpad/crowdpooling/page.tsx"),/writeContractAsync/);
});
