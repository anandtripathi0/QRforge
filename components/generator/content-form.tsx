"use client";
import {useState} from "react";
import {Link2,Type,Wifi,Contact,Mail,Phone,MessageCircle,MapPin,Plus,ShieldCheck,QrCode} from "lucide-react";
import {Kind,Fields,kinds,fields} from "@/lib/payloads";
import {Choice,Toggle} from "./controls";
const icons=[Link2,Type,Wifi,Contact,Mail,Phone,MessageCircle,MapPin];
export default function ContentForm({kind,setKind,values,setValues,name,setName,error}:{kind:Kind;setKind:(k:Kind)=>void;values:Fields;setValues:(v:Fields)=>void;name:string;setName:(n:string)=>void;error:string}){
const [more,setMore]=useState(false),[show,setShow]=useState(false);
return <section className="panel content-panel"><div className="section-title"><span className="step">1</span><h2>Add your content</h2></div><p className="subtle">What would you like to share?</p><div className="type-grid">{kinds.slice(0,more?kinds.length:8).map((label,i)=>{const Icon=icons[i]||QrCode;return <button aria-pressed={kind===label} key={label} className={kind===label?"type selected":"type"} onClick={()=>setKind(label)}><Icon size={20}/><span>{label}</span></button>})}</div><button className="more-types" aria-expanded={more} onClick={()=>setMore(!more)}>{more?"Fewer types":"More QR types"}<Plus size={15}/></button><div className="rule"/>
{fields[kind].map(f=>{const val=values[f.key]||"",change=(v:string)=>setValues({...values,[f.key]:v});if(f.type==="security")return <label key={f.key} className="field">{f.label}<Choice label={f.label} value={val||"WPA"} items={[{value:"WPA",label:"WPA / WPA2"},{value:"WEP",label:"WEP"},{value:"nopass",label:"No password"}]} onChange={change}/></label>;if(f.type==="crypto")return <label key={f.key} className="field">{f.label}<Choice label={f.label} value={val||"bitcoin"} items={["bitcoin","ethereum","litecoin"]} onChange={change}/></label>;if(f.type==="checkbox")return <Toggle key={f.key} label={f.label} checked={val==="true"} onChange={v=>change(String(v))}/>;return <label className="field" key={f.key}>{f.label}{f.required&&<span aria-label="required">*</span>}{f.type==="textarea"?<textarea value={val} maxLength={2200} onChange={e=>change(e.target.value)} placeholder={f.placeholder}/>:<input value={val} maxLength={2200} type={f.type==="password"&&show?"text":f.type||"text"} step={f.type==="number"?"any":undefined} onChange={e=>change(e.target.value)} placeholder={f.placeholder}/>}</label>})}
{kind==="Wi-Fi"&&<Toggle label="Show password" checked={show} onChange={setShow}/>}
{kind==="Website"&&<p className="hint">Take people straight to your website.</p>}
{kind==="UPI"&&<p className="hint">Encodes payment details only. Payment completion depends on the payment app and provider. Confirm payee details before paying.</p>}
{kind==="Crypto"&&<p className="hint">Wallet address checksums are not verified. Confirm the address in your wallet before sharing.</p>}
{error&&<p className="error" role="status">{error}</p>}
<label className="field name-field">Name <span className="subtle">optional</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. My portfolio" maxLength={80}/></label><div className="privacy-note"><ShieldCheck size={18}/><p>Your content stays yours.<br/><span>QR codes are created on your device.</span></p></div></section>
}
