import {describe,it,expect} from "vitest";
import {buildPayload,escapeWifi,safeUrl} from "../lib/payloads";
import {defaultDesign,frames,applyFrame,importDesign,quality} from "../lib/qr/design";
import {renderQR} from "../lib/qr/render";
import {runTool,colorConvert,toBase64,fromBase64} from "../lib/tools";
import jsQR from "jsqr";
import sharp from "sharp";
describe("payload validation and escaping",()=>{
it("escapes Wi-Fi separators and backslashes",()=>expect(escapeWifi('Cafe;A:B,C\\D"')).toBe('Cafe\\;A\\:B\\,C\\\\D\\"'));
it("builds a hidden WPA network",()=>expect(buildPayload("Wi-Fi",{ssid:"Café;guest",password:"a:b",hidden:"true"})).toBe("WIFI:T:WPA;S:Café\\;guest;P:a\\:b;H:true;;"));
it("rejects executable links",()=>expect(()=>safeUrl("javascript:alert(1)")).toThrow());
it("rejects missing inputs and invalid latitude",()=>{expect(()=>buildPayload("Website",{})).toThrow();expect(()=>buildPayload("Location",{lat:"91",lon:"0"})).toThrow()});
it("encodes payment details",()=>expect(buildPayload("UPI",{upi:"name@bank",payee:"A & B",amount:"20.50"})).toBe("upi://pay?pa=name%40bank&pn=A+%26+B&cu=INR&am=20.50"));
it("escapes contact lines against injection",()=>{const p=buildPayload("Contact",{first:"Zoë",last:"李",notes:"hello\nEND:VCARD"});expect(p).toContain("NOTE:hello\\nEND:VCARD");expect(p).toContain("N:李;Zoë;;;")});
it("validates event ordering and UTC output",()=>{expect(()=>buildPayload("Calendar",{title:"A",start:"2026-01-01T10:00Z",end:"2026-01-01T09:00Z"})).toThrow();expect(buildPayload("Calendar",{title:"A",start:"2026-01-01T10:00Z",end:"2026-01-01T11:00Z"})).toContain("DTSTART:20260101T100000Z")});
it("supports Unicode and international phones",()=>{expect(buildPayload("Text",{text:"مرحبا नमस्ते 你好"})).toBe("مرحبا नमस्ते 你好");expect(buildPayload("Phone",{phone:"+91 98765 43210"})).toBe("tel:+919876543210")});
});
describe("design safety",()=>{
it("validates imported settings",()=>{expect(()=>importDesign(JSON.stringify({...defaultDesign,foreground:'red"><script>'}))).toThrow();expect(()=>importDesign(JSON.stringify({...defaultDesign,logo:"data:image/svg+xml,<svg/>"}))).toThrow()});
it("flags poor contrast and missing quiet zone",()=>expect(quality({...defaultDesign,foreground:"#ffffff",margin:0},21).label).toBe("Risky"));
it("includes and escapes frame text in shared SVG",()=>{const d={...applyFrame(defaultDesign,"rounded"),frameText:"<script>&"};const s=renderQR("https://example.com",d).svg;expect(s).toContain("&lt;script&gt;&amp;");expect(s).not.toContain("<script>")});
it("keeps every frame inside the export",()=>{for(const f of frames){const result=renderQR("https://example.com",applyFrame(defaultDesign,f.id));expect(result.svg).toContain('viewBox="0 0 512 512"');if(f.id!=="none")expect(result.svg).toContain(f.text)}});
});
describe("scan round trips",()=>{
const samples=[["Website",{url:"https://example.com"}],["Text",{text:"Hello नमस्ते 世界"}],["Wi-Fi",{ssid:"Café;guest",password:"p:a;ss",hidden:"true"}],["Contact",{first:"Ada",last:"Lovelace",phone:"+442012345678"}],["Email",{email:"a@example.com",subject:"Hi & hello"}],["SMS",{phone:"+919876543210",body:"Hello"}],["Phone",{phone:"+442012345678"}],["WhatsApp",{phone:"+919876543210",body:"Hello"}],["Location",{lat:"28.6",lon:"77.2"}],["UPI",{upi:"a@bank",payee:"A"}],["Calendar",{title:"Meeting",start:"2026-09-20T10:00Z",end:"2026-09-20T11:00Z"}]] as const;
for(const [kind,fields]of samples)it("decodes "+kind,async()=>{const payload=buildPayload(kind,fields);const svg=renderQR(payload,{...defaultDesign,size:1024}).svg;const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});expect(jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data).toBe(payload)});
for(const pattern of ["Rounded","Dots","Classy","Classy Rounded","Extra Rounded"] as const)it("decodes "+pattern+" with a frame",async()=>{const payload="https://example.com/menu";const svg=renderQR(payload,{...applyFrame(defaultDesign,"menu"),pattern,corner:"Rounded",size:1024}).svg;const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});expect(jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data).toBe(payload)});
it("decodes a QR with a centered logo",async()=>{const logo="data:image/png;base64,"+(await sharp({create:{width:32,height:32,channels:4,background:"#1957cc"}}).png().toBuffer()).toString("base64");const payload="https://example.com/logo";const svg=renderQR(payload,{...defaultDesign,logo,size:1024}).svg;const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});expect(jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data).toBe(payload)});
});
describe("developer utilities",()=>{
it("round trips Unicode base64",()=>expect(fromBase64(toBase64("你好 🌍 مرحبا"))).toBe("你好 🌍 مرحبا"));
it("formats and validates JSON",async()=>{expect(await runTool("JSON Minifier",' { "a": 1 } ',"")).toBe('{"a":1}');await expect(runTool("JSON Formatter","{","")).rejects.toThrow()});
it("keeps repeated query values and unsafe property names as data",async()=>{expect(JSON.parse(await runTool("Query String Parser","a=1&a=2&__proto__=x",""))).toEqual({a:["1","2"],["__proto__"]:["x"]})});
it("computes the published SHA-256 test vector",async()=>expect(await runTool("SHA-256","abc","")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"));
it("converts colors",()=>{expect(colorConvert("rgb(255, 0, 0)").hex).toBe("#ff0000");expect(colorConvert("hsl(120, 100%, 50%)").hex).toBe("#00ff00")});
it("limits YAML alias expansion",async()=>{await expect(runTool("YAML → JSON","a: &a [1,2]\nb: *a","")).resolves.toContain('"b"')});
});
