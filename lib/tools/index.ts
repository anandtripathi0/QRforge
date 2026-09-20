import {parse as parseYaml,stringify as stringifyYaml} from "yaml";
import {diffLines} from "diff";
import {contrast} from "../qr/design";
export const utilities=["JSON Formatter","JSON Validator","JSON Minifier","JSON → YAML","YAML → JSON","Base64 Encode","Base64 Decode","URL Encode","URL Decode","Query String Parser","UTM Builder","HTML Encode","HTML Decode","JWT Decoder","UUID Generator","Secure Random String","Timestamp Converter","Unix Time Converter","SHA-256","SHA-384","SHA-512","Text Diff","Character Counter","Word Counter","Case Converter","Lorem Ipsum Generator","Color Converter","Contrast Checker","Gradient Generator","Regex Tester","QR Payload Inspector"] as const;
export type Utility=typeof utilities[number];
export function toBase64(text:string){let s="";for(const b of new TextEncoder().encode(text))s+=String.fromCharCode(b);return btoa(s)}
export function fromBase64(text:string){return new TextDecoder("utf-8",{fatal:true}).decode(Uint8Array.from(atob(text.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0)))}
export function colorConvert(input:string){let r=0,g=0,b=0;const str=input.trim();if(/^#[0-9a-f]{6}$/i.test(str)){[r,g,b]=str.slice(1).match(/../g)!.map(x=>parseInt(x,16))}else if(/^#[0-9a-f]{3}$/i.test(str)){[r,g,b]=str.slice(1).split("").map(x=>parseInt(x+x,16))}else if(/^rgb/i.test(str)){const v=str.match(/[\d.]+/g)?.map(Number);if(!v||v.length!==3||v.some(x=>x<0||x>255))throw Error("Use RGB values between 0 and 255.");[r,g,b]=v}else if(/^hsl/i.test(str)){const v=str.match(/-?[\d.]+/g)?.map(Number);if(!v||v.length!==3||v[1]<0||v[1]>100||v[2]<0||v[2]>100)throw Error("Use hsl(hue, saturation%, lightness%).");const h=((v[0]%360)+360)%360/60,s=v[1]/100,l=v[2]/100,c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs(h%2-1)),m=l-c/2;const vals=h<1?[c,x,0]:h<2?[x,c,0]:h<3?[0,c,x]:h<4?[0,x,c]:h<5?[x,0,c]:[c,0,x];[r,g,b]=vals.map(a=>Math.round((a+m)*255))}else throw Error("Enter HEX, rgb() or hsl().");
const [rn,gn,bn]=[r,g,b].map(x=>x/255),max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn),delta=max-min,l=(max+min)/2,s=delta===0?0:delta/(1-Math.abs(2*l-1));let h=delta===0?0:max===rn?60*(((gn-bn)/delta)%6):max===gn?60*((bn-rn)/delta+2):60*((rn-gn)/delta+4);if(h<0)h+=360;return {hex:"#"+[r,g,b].map(x=>Math.round(x).toString(16).padStart(2,"0")).join(""),rgb:"rgb("+[r,g,b].map(Math.round).join(", ")+")",hsl:"hsl("+Math.round(h)+", "+Math.round(s*100)+"%, "+Math.round(l*100)+"%)"}}
export async function runTool(tool:Utility,input:string,second:string,options:Record<string,string>={}):Promise<string>{
if(input.length>250000||second.length>250000)throw Error("Input exceeds the 250 KB tool limit.");
switch(tool){
case "JSON Formatter":return JSON.stringify(JSON.parse(input),null,2);
case "JSON Validator":JSON.parse(input);return "Valid JSON.";
case "JSON Minifier":return JSON.stringify(JSON.parse(input));
case "JSON → YAML":return stringifyYaml(JSON.parse(input));
case "YAML → JSON":return JSON.stringify(parseYaml(input,{maxAliasCount:50}),null,2);
case "Base64 Encode":return toBase64(input);
case "Base64 Decode":return fromBase64(input.trim());
case "URL Encode":return encodeURIComponent(input);
case "URL Decode":return decodeURIComponent(input);
case "Query String Parser":{const q=new URLSearchParams(input.includes("?")?input.slice(input.indexOf("?")+1):input);const result:Record<string,string[]>={};for(const [k,v]of q){if(!Object.hasOwn(result,k))Object.defineProperty(result,k,{value:[],enumerable:true,writable:true});result[k].push(v)}return JSON.stringify(result,null,2)}
case "UTM Builder":{const u=new URL(input);if(!["https:","http:"].includes(u.protocol))throw Error("Use an HTTP or HTTPS URL.");for(const key of ["source","medium","campaign","term","content"])if(options[key])u.searchParams.set("utm_"+key,options[key]);return u.href}
case "HTML Encode":return input.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
case "HTML Decode":return input.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(_,e:string)=>{if(e[0]==="#"){const n=e[1].toLowerCase()==="x"?parseInt(e.slice(2),16):parseInt(e.slice(1),10);return n>=0&&n<=0x10ffff?String.fromCodePoint(n):"�"}return ({amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "}[e.toLowerCase()]||_)});
case "JWT Decoder":{const p=input.trim().split(".");if(p.length!==3)throw Error("A JWT must have three dot-separated parts.");return JSON.stringify({header:JSON.parse(fromBase64(p[0])),payload:JSON.parse(fromBase64(p[1])),notice:"Decoding a JWT does not verify its signature."},null,2)}
case "UUID Generator":return Array.from({length:Math.max(1,Math.min(100,Number(input)||1))},()=>crypto.randomUUID()).join("\n");
case "Secure Random String":{const n=Math.max(8,Math.min(256,Number(input)||32));const bytes=crypto.getRandomValues(new Uint8Array(Math.ceil(n/2)));return Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("").slice(0,n)}
case "Timestamp Converter":case "Unix Time Converter":{const v=input.trim();const d=/^\d+$/.test(v)?new Date(Number(v)*(v.length<=10?1000:1)):new Date(v);if(!Number.isFinite(+d))throw Error("Use Unix seconds, milliseconds or an ISO date.");return JSON.stringify({iso:d.toISOString(),local:d.toLocaleString(),unixSeconds:Math.floor(+d/1000),unixMilliseconds:+d},null,2)}
case "SHA-256":case "SHA-384":case "SHA-512":return Array.from(new Uint8Array(await crypto.subtle.digest(tool,new TextEncoder().encode(input))),b=>b.toString(16).padStart(2,"0")).join("");
case "Text Diff":return diffLines(input,second).map(p=>(p.added?"+ ":p.removed?"- ":"  ")+p.value).join("");
case "Character Counter":return JSON.stringify({unicodeCodePoints:[...input].length,utf16CodeUnits:input.length,utf8Bytes:new TextEncoder().encode(input).length},null,2);
case "Word Counter":return JSON.stringify({words:[...new Intl.Segmenter(undefined,{granularity:"word"}).segment(input)].filter(s=>s.isWordLike).length,lines:input.split("\n").length},null,2);
case "Case Converter":return options.case==="upper"?input.toLocaleUpperCase():options.case==="lower"?input.toLocaleLowerCase():input.toLocaleLowerCase().replace(/(^|\s)\S/g,s=>s.toLocaleUpperCase());
case "Lorem Ipsum Generator":return Array.from({length:Math.max(1,Math.min(20,Number(input)||3))},()=>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lectus vel nibh facilisis interdum. Donec at sem a justo viverra feugiat.").join("\n\n");
case "Color Converter":return JSON.stringify(colorConvert(input),null,2);
case "Contrast Checker":{const a=colorConvert(input).hex,b=colorConvert(second).hex,ratio=contrast(a,b);return JSON.stringify({ratio:ratio.toFixed(2)+":1",normalTextAA:ratio>=4.5,largeTextAA:ratio>=3,normalTextAAA:ratio>=7},null,2)}
case "Gradient Generator":{const a=colorConvert(input).hex,b=colorConvert(second).hex;return "linear-gradient("+Math.max(0,Math.min(360,Number(options.angle)||90))+"deg, "+a+", "+b+")"}
case "Regex Tester":return regexTest(input,second,options.flags||"g");
case "QR Payload Inspector":return JSON.stringify({format:input.startsWith("WIFI:")?"Wi-Fi":input.includes("BEGIN:VCARD")?"vCard":input.includes("BEGIN:VCALENDAR")?"Calendar":input.startsWith("upi:")?"UPI":input.startsWith("geo:")?"Location":/^https?:/.test(input)?"Website":"Text / URI",characters:[...input].length,utf8Bytes:new TextEncoder().encode(input).length,content:input},null,2);
}
}
export function regexTest(pattern:string,text:string,flags:string):Promise<string>{return new Promise((resolve,reject)=>{const src="onmessage=e=>{try{const [p,t,f]=e.data;const r=new RegExp(p,f.includes('g')?f:f+'g');const out=[];let m;while((m=r.exec(t))&&out.length<1000){out.push({match:m[0],index:m.index,groups:m.slice(1)});if(!m[0])r.lastIndex++}postMessage({result:out})}catch(e){postMessage({error:e.message})}}";const url=URL.createObjectURL(new Blob([src],{type:"text/javascript"})),worker=new Worker(url);const done=()=>{worker.terminate();URL.revokeObjectURL(url);clearTimeout(timer)};const timer=setTimeout(()=>{done();reject(Error("Regex exceeded the one-second time limit."))},1000);worker.onmessage=e=>{done();if(e.data.error)reject(Error(e.data.error));else resolve(JSON.stringify(e.data.result,null,2))};worker.onerror=()=>{done();reject(Error("Regex worker failed."))};worker.postMessage([pattern,text,flags])})}
