/* Effects synchronize IndexedDB, browser preferences or the imperative renderer after SSR. */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {useState,useEffect,useMemo} from "react";
import {History} from "lucide-react";
import {toast} from "sonner";
import SiteShell,{LocalNote,useMessages} from "@/components/site-shell";
import ContentForm from "./content-form";
import DesignControls from "./controls";
import Preview from "./preview";
import Library from "./library";
import {Kind,Fields,buildPayload,kinds,fields as payloadFields} from "@/lib/payloads";
import {Design,defaultDesign} from "@/lib/qr/design";
import {renderQR} from "@/lib/qr/render";
import {SavedQR,saveQR} from "@/lib/storage";
export default function Workspace({initialKind="Website",initialTab="style"}:{initialKind?:Kind;initialTab?:string}){return <SiteShell active={initialTab==="frame"?"frames":"generator"}><Generator initialKind={initialKind} initialTab={initialTab}/></SiteShell>}
function Generator({initialKind,initialTab}:{initialKind:Kind;initialTab:string}){
const m=useMessages();const [kind,setKind]=useState<Kind>(initialKind),[values,setValues]=useState<Fields>(initialKind==="Website"?{url:"https://example.com"}:{}),[name,setName]=useState(""),[design,setDesign]=useState<Design>({...defaultDesign}),[svg,setSVG]=useState(""),[modules,setModules]=useState(21),[renderError,setRenderError]=useState(""),[busy,setBusy]=useState(false),[library,setLibrary]=useState(false),[enabled,setEnabled]=useState(true),[refresh,setRefresh]=useState(0);
const built=useMemo(()=>{try{return {payload:buildPayload(kind,values),error:""}}catch(e){return {payload:"",error:(e as Error).message}}},[kind,values]);
useEffect(()=>{setEnabled(localStorage.getItem("qrforge-history")!=="off");const url=new URLSearchParams(location.hash.slice(1)).get("url");if(url&&initialKind==="Website")setValues({url})},[initialKind]);
useEffect(()=>{setBusy(true);setSVG("");setRenderError("");const timer=setTimeout(()=>{if(!built.payload){setBusy(false);return}try{const result=renderQR(built.payload,design);setSVG(result.svg);setModules(result.modules)}catch(e){setRenderError((e as Error).message)}finally{setBusy(false)}},180);return()=>clearTimeout(timer)},[built.payload,design,refresh]);
useEffect(()=>{const listener=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();setRefresh(x=>x+1)}};window.addEventListener("keydown",listener);return()=>window.removeEventListener("keydown",listener)},[]);
useEffect(()=>{type Context={registerTool:(t:Record<string,unknown>,o:{signal:AbortSignal})=>void|Promise<void>};const context=(document as Document&{modelContext?:Context}).modelContext;if(!context)return;const lifecycle=new AbortController();Promise.resolve(context.registerTool({name:"stage_qr_content",title:"Set QR content",description:"Validate and stage content in the visible QR editor. Does not save or download.",inputSchema:{type:"object",properties:{type:{type:"string",enum:kinds},fields:{type:"object",additionalProperties:{type:"string"}}},required:["type","fields"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute(input:unknown){const v=input as {type:Kind;fields:Fields};if(!v||!kinds.includes(v.type)||!v.fields||Object.values(v.fields).some(x=>typeof x!=="string"))throw Error("Invalid QR input");const payload=buildPayload(v.type,v.fields);setKind(v.type);setValues(v.fields);return {staged:true,bytes:new TextEncoder().encode(payload).length}}},{signal:lifecycle.signal})).catch(()=>{});return()=>lifecycle.abort()},[]);
async function save(template:boolean){if(!enabled)throw Error("Library saving is disabled. Enable it in My library to save.");if(!built.payload||!svg)throw Error("Create a valid QR first.");await saveQR({id:crypto.randomUUID(),name,type:kind,fields:Object.fromEntries(payloadFields[kind].map(f=>[f.key,values[f.key]||""])),payload:built.payload,design,createdAt:new Date().toISOString(),template});toast.success(template?"Template saved":"Saved to history")}
function open(item:SavedQR){setKind(item.type);setValues(item.fields);setName(item.name);setDesign(item.design);setLibrary(false);toast.success("Saved code opened")}
return <><div className="intro"><div><div className="eyebrow">YOUR IDEAS. ONE SCAN AWAY.</div><h1>{m.title}</h1><p>{m.subtitle}</p></div><button className="secondary" onClick={()=>setLibrary(true)}><History size={17}/>{m.library}</button></div><div className="workspace"><ContentForm kind={kind} setKind={setKind} values={values} setValues={setValues} name={name} setName={setName} error={built.error||renderError}/><DesignControls design={design} setDesign={setDesign} initialTab={initialTab}/><Preview svg={svg} modules={modules} design={design} setDesign={setDesign} payload={built.payload} name={name} save={save} busy={busy}/></div><LocalNote/><Library open={library} onClose={()=>setLibrary(false)} onOpen={open} enabled={enabled} setEnabled={v=>{setEnabled(v);localStorage.setItem("qrforge-history",v?"on":"off")}}/></>
}
