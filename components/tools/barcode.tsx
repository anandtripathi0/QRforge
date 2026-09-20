/* Effects synchronize IndexedDB, browser preferences or the imperative renderer after SSR. */
/* eslint-disable react-hooks/set-state-in-effect */
/* Generated local data images must bypass remote image optimization. */
/* eslint-disable @next/next/no-img-element */
"use client";
import {useState,useEffect} from "react";
import JsBarcode from "jsbarcode";
import {Choice,Range,Color} from "@/components/generator/controls";
import {downloadBlob,filename} from "@/lib/export";
import {toast} from "sonner";
export default function Barcode(){
const [format,setFormat]=useState("CODE128"),[value,setValue]=useState("QRForge-2026"),[height,setHeight]=useState(100),[ink,setInk]=useState("#181d29"),[svg,setSVG]=useState(""),[error,setError]=useState("");
useEffect(()=>{try{const node=document.createElementNS("http://www.w3.org/2000/svg","svg");JsBarcode(node,value,{format,height,width:2,margin:20,lineColor:ink,background:"#ffffff",displayValue:true});setSVG(new XMLSerializer().serializeToString(node));setError("")}catch{setSVG("");setError("This value is not valid for "+format+". Check length, digits and checksum.")}},[value,format,height,ink]);
async function png(){try{const img=await import("@/lib/export");const image=await img.imageFrom("data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg));const canvas=document.createElement("canvas");canvas.width=image.width*3;canvas.height=image.height*3;canvas.getContext("2d")!.drawImage(image,0,0,canvas.width,canvas.height);canvas.toBlob(b=>b&&downloadBlob(b,filename("barcode","png")),"image/png")}catch(e){toast.error((e as Error).message)}}
return <div className="tool-layout"><section className="panel"><h2>Barcode settings</h2><label className="field">Format<Choice label="Barcode format" value={format} onChange={setFormat} items={["CODE128","CODE39","EAN13","EAN8","UPC","ITF","codabar"]}/></label><label className="field">Value<input value={value} maxLength={100} onChange={e=>setValue(e.target.value)}/></label><Range label="Bar height" value={height} min={40} max={250} onChange={setHeight}/><Color label="Bar color" value={ink} onChange={setInk}/>{error&&<p className="error" role="alert">{error}</p>}<p className="hint">EAN-13 uses 13 digits, EAN-8 uses 8, and UPC uses 12, including a valid checksum. ITF requires an even number of digits.</p></section><section className="panel"><h2>Barcode preview</h2><div className="barcode-preview">{svg?<img src={"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)} alt="Generated barcode"/>:<p className="empty">Enter a valid value.</p>}</div><div className="button-row"><button className="primary" disabled={!svg} onClick={()=>downloadBlob(new Blob([svg],{type:"image/svg+xml"}),filename("barcode","svg"))}>Download SVG</button><button className="secondary" disabled={!svg} onClick={()=>void png()}>Download PNG</button></div></section></div>
}
