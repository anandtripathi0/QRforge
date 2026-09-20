/* Effects synchronize IndexedDB, browser preferences or the imperative renderer after SSR. */
/* eslint-disable react-hooks/set-state-in-effect */
/* Generated local data images must bypass remote image optimization. */
/* eslint-disable @next/next/no-img-element */
"use client";
import {useEffect,useState} from "react";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from "@/components/ui/dialog";
import {SavedQR,listSaved,deleteQR,saveQR,clearSaved} from "@/lib/storage";
import {renderQR,svgURL} from "@/lib/qr/render";
import {exportBlob,downloadBlob,filename} from "@/lib/export";
import {toast} from "sonner";
import {Toggle} from "./controls";
export default function Library({open,onClose,onOpen,enabled,setEnabled}:{open:boolean;onClose:()=>void;onOpen:(s:SavedQR)=>void;enabled:boolean;setEnabled:(v:boolean)=>void}){
const [items,setItems]=useState<SavedQR[]>([]),[loading,setLoading]=useState(false),[clear,setClear]=useState(false);
async function refresh(){setLoading(true);try{setItems((await listSaved()).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)))}catch(e){toast.error((e as Error).message)}finally{setLoading(false)}}
useEffect(()=>{if(open)void refresh()},[open]);
async function act(fn:()=>Promise<unknown>){try{await fn();await refresh()}catch(e){toast.error((e as Error).message)}}
return <Dialog open={open} onOpenChange={v=>!v&&onClose()}><DialogContent className="library-dialog"><DialogHeader><DialogTitle>My library</DialogTitle><DialogDescription>Saved on this browser only. Sensitive content is saved only when you choose Save.</DialogDescription></DialogHeader><Toggle label="Allow saving history and templates" checked={enabled} onChange={setEnabled}/>{loading&&<p>Loading saved codes…</p>}{!loading&&!items.length&&<p className="empty">Nothing saved yet. Create a code and save it here to return to it later.</p>}<div className="library-list">{items.map(item=>{let svg="";try{svg=renderQR(item.payload,item.design).svg}catch{}return <article className="saved-card" key={item.id}>{svg&&<img src={svgURL(svg)} alt="Saved QR"/>}<div><h3>{item.name||item.type+" QR"}</h3><p>{item.template?"Template":"History"} · {new Date(item.createdAt).toLocaleDateString()}</p><div className="button-row"><button onClick={()=>onOpen(item)}>Open / edit</button><button onClick={()=>void act(()=>saveQR({...item,id:crypto.randomUUID(),name:(item.name||item.type)+" copy",createdAt:new Date().toISOString()}))}>Duplicate</button><button disabled={!svg} onClick={()=>void act(async()=>downloadBlob(await exportBlob(svg,item.design.size,"PNG"),filename(item.name,"png")))}>Download</button><button onClick={()=>void act(()=>deleteQR(item.id))}>Delete</button></div></div></article>})}</div>{items.length>0&&(clear?<div className="button-row"><span>Delete all saved codes?</span><button className="secondary" onClick={()=>void act(async()=>{await clearSaved();setClear(false)})}>Delete all</button><button className="secondary" onClick={()=>setClear(false)}>Cancel</button></div>:<button className="secondary" onClick={()=>setClear(true)}>Clear library</button>)}</DialogContent></Dialog>
}
