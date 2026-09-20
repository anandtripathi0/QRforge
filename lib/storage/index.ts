import {Design} from "../qr/design";
import {Kind,Fields} from "../payloads";
export type SavedQR={id:string;name:string;type:Kind;fields:Fields;payload:string;design:Design;createdAt:string;template:boolean};
function openDB():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open("qrforge",1);r.onupgradeneeded=()=>r.result.createObjectStore("codes",{keyPath:"id"});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(Error("Local storage is unavailable."))})}
async function transact<T>(mode:IDBTransactionMode,run:(s:IDBObjectStore)=>IDBRequest<T>){const db=await openDB();return new Promise<T>((resolve,reject)=>{const tx=db.transaction("codes",mode),req=run(tx.objectStore("codes"));tx.oncomplete=()=>{db.close();resolve(req.result)};tx.onerror=()=>{db.close();reject(Error("Could not save to local storage."))};tx.onabort=()=>{db.close();reject(Error("Local storage operation was cancelled."))}})}
export const listSaved=()=>transact("readonly",s=>s.getAll()) as Promise<SavedQR[]>;
export const saveQR=(entry:SavedQR)=>transact("readwrite",s=>s.put(entry));
export const deleteQR=(id:string)=>transact("readwrite",s=>s.delete(id));
export const clearSaved=()=>transact("readwrite",s=>s.clear());
