import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
test("single composition replaces old homepage without adding sections",()=>{
 const source=read("app/page.tsx");
 const view=read("components/marketing/cinematic-home.tsx");
 assert.match(source,/CinematicHome/);
 assert.doesNotMatch(source,/CurvedCarousel|sy-home-after|sy-home-proof/);
 assert.equal((view.match(/<section /g)||[]).length,3); // screen + hero + transient dialog
 assert.match(view,/className="demo-card"/);
 assert.match(view,/className="hero-content"/);
 assert.match(view,/className="background"/);
 assert.match(view,/\/app\/swap/);
 assert.match(view,/symb-fish\.svg/);
});
test("video and exact full-screen glass architecture are retained",()=>{
 const view=read("components/marketing/cinematic-home.tsx");
 const css=read("app/cinematic-home.css");
 assert.match(view,/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05\.mp4/);
 assert.match(view,/autoPlay muted loop playsInline disablePictureInPicture/);
 for(const text of ["--gutter-start","--gutter-end","--hero-bottom","--card-width","backdrop-filter:blur(14px)","entrance-line","entrance-card","prefers-reduced-motion","overflow:hidden"])assert.ok(css.includes(text),text);
 assert.match(css,/body:has\(\.cinematic-home-viewport\)/);
});
test("other routes retain original chrome while root uses dedicated page",()=>{
 const chrome=read("components/layout/site-chrome.tsx");
 assert.match(chrome,/path==="\/"/);
 assert.match(chrome,/path==="\/app"/);
 assert.match(chrome,/<Header\/>/);
 assert.match(chrome,/footer/);
});
