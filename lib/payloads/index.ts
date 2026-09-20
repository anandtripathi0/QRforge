export const kinds = ["Website","Text","Wi-Fi","Contact","Email","Phone","WhatsApp","Location","SMS","Calendar","UPI","Social","App","Crypto","Menu","Event","Coupon","File","Image","Raw"] as const;
export type Kind=typeof kinds[number];
export type Fields=Record<string,string>;
export type Field={key:string;label:string;type?:string;placeholder?:string;required?:boolean};
const urlField={key:"url",label:"Website URL",type:"url",placeholder:"https://your-website.com",required:true};
export const fields:Record<Kind,Field[]>={
Website:[urlField],Text:[{key:"text",label:"Your text",type:"textarea",required:true}],Raw:[{key:"text",label:"Raw content",type:"textarea",required:true}],
"Wi-Fi":[{key:"ssid",label:"Network name (SSID)",required:true},{key:"password",label:"Password",type:"password"},{key:"security",label:"Security",type:"security"},{key:"hidden",label:"Hidden network",type:"checkbox"}],
Contact:[...["first","last","company","title","phone","mobile","email","website","address","city","state","postal","country","notes"].map((key,i)=>({key,label:["First name","Last name","Company","Job title","Phone","Mobile","Email","Website","Address","City","State","Postal code","Country","Notes"][i]}))],
Email:[{key:"email",label:"Email address",type:"email",required:true},{key:"subject",label:"Subject"},{key:"body",label:"Message",type:"textarea"}],
Phone:[{key:"phone",label:"Phone number",placeholder:"+44 7700 900123",required:true}],
WhatsApp:[{key:"phone",label:"International phone number",placeholder:"+91 98765 43210",required:true},{key:"body",label:"Message",type:"textarea"}],
SMS:[{key:"phone",label:"Phone number",required:true},{key:"body",label:"Message",type:"textarea"}],
Location:[{key:"lat",label:"Latitude",type:"number",required:true},{key:"lon",label:"Longitude",type:"number",required:true}],
Calendar:[{key:"title",label:"Event title",required:true},{key:"start",label:"Start (your local time)",type:"datetime-local",required:true},{key:"end",label:"End (your local time)",type:"datetime-local",required:true},{key:"location",label:"Location"},{key:"notes",label:"Description",type:"textarea"}],
UPI:[{key:"upi",label:"UPI ID",placeholder:"name@bank",required:true},{key:"payee",label:"Payee name",required:true},{key:"amount",label:"Amount (INR)",type:"number"},{key:"note",label:"Payment note"},{key:"reference",label:"Transaction reference"}],
Social:[{...urlField,label:"Social profile URL"}],App:[{...urlField,label:"App download URL"}],Crypto:[{key:"scheme",label:"Currency",type:"crypto"},{key:"address",label:"Wallet address",required:true}],Menu:[{...urlField,label:"Menu URL"}],Event:[{...urlField,label:"Event registration URL"}],Coupon:[{...urlField,label:"Coupon / offer URL"}],File:[{...urlField,label:"File URL"}],Image:[{...urlField,label:"Image URL"}]};
const clean=(s:string)=>s.replace(/[\r\n]/g," ");
export const escapeWifi=(s:string)=>s.replace(/([\\;,:"])/g,"\\$1");
export const escapeV=(s:string)=>s.replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/;/g,"\\;").replace(/,/g,"\\,");
function phone(s:string){const n=s.replace(/[\s().-]/g,"");if(!/^\+?\d{5,16}$/.test(n))throw Error("Enter a valid international phone number.");return n;}
export function safeUrl(s:string){let u:URL;try{u=new URL(s)}catch{throw Error("Enter a complete URL, including https://.")}if(!["http:","https:"].includes(u.protocol))throw Error("Only http and https links are allowed.");return u.href;}
export function buildPayload(kind:Kind,f:Fields):string{
for(const field of fields[kind])if(field.required&&!f[field.key]?.trim())throw Error("Enter "+field.label.toLowerCase()+".");
let out="";
switch(kind){
case "Website":case "Social":case "App":case "Menu":case "Event":case "Coupon":case "File":case "Image":out=safeUrl(f.url);break;
case "Text":case "Raw":out=f.text;break;
case "Wi-Fi":{const security=f.security||"WPA";if(!["WPA","WEP","nopass"].includes(security))throw Error("Invalid Wi-Fi security.");out="WIFI:T:"+security+";S:"+escapeWifi(f.ssid)+";P:"+escapeWifi(security==="nopass"?"":f.password||"")+";H:"+(f.hidden==="true") +";;";break}
case "Phone":out="tel:"+phone(f.phone);break;
case "SMS":out="sms:"+phone(f.phone)+"?body="+encodeURIComponent(f.body||"");break;
case "WhatsApp":out="https://wa.me/"+phone(f.phone).replace(/^\+/,"")+"?text="+encodeURIComponent(f.body||"");break;
case "Email":if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))throw Error("Enter a valid email address.");out="mailto:"+encodeURIComponent(f.email)+"?"+new URLSearchParams({subject:f.subject||"",body:f.body||""});break;
case "Location":{const lat=Number(f.lat),lon=Number(f.lon);if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)throw Error("Latitude must be −90 to 90; longitude −180 to 180.");out="geo:"+lat+","+lon;break}
case "UPI":{if(!/^[\w.\-]+@[\w.\-]+$/.test(f.upi))throw Error("Enter a valid UPI ID.");if(f.amount&&(!Number.isFinite(+f.amount)||+f.amount<=0))throw Error("Amount must be positive.");const p=new URLSearchParams({pa:f.upi,pn:f.payee,cu:"INR"});if(f.amount)p.set("am",f.amount);if(f.note)p.set("tn",f.note);if(f.reference)p.set("tr",f.reference);out="upi://pay?"+p;break}
case "Crypto":{const scheme=f.scheme||"bitcoin";if(!["bitcoin","ethereum","litecoin"].includes(scheme)||!/^[a-zA-Z0-9]{14,120}$/.test(f.address))throw Error("Check the currency and wallet address. Address checksums are not verified.");out=scheme+":"+f.address;break}
case "Contact":{if(!f.first&&!f.last)throw Error("Enter at least one name.");const lines=["BEGIN:VCARD","VERSION:3.0","N:"+[f.last,f.first,"","",""].map(v=>escapeV(v||"")).join(";"),"FN:"+escapeV([f.first,f.last].filter(Boolean).join(" "))];for(const [key,label] of [["company","ORG"],["title","TITLE"],["phone","TEL;TYPE=WORK,VOICE"],["mobile","TEL;TYPE=CELL"],["email","EMAIL"],["website","URL"],["notes","NOTE"]])if(f[key]){if(key==="website")safeUrl(f[key]);lines.push(label+":"+escapeV(f[key]))}if(f.address||f.city||f.country)lines.push("ADR;TYPE=WORK:;;"+[f.address,f.city,f.state,f.postal,f.country].map(x=>escapeV(x||"")).join(";"));lines.push("END:VCARD");out=lines.join("\r\n");break}
case "Calendar":{const start=new Date(f.start),end=new Date(f.end);if(!Number.isFinite(+start)||!Number.isFinite(+end)||end<=start)throw Error("Choose an end time after the start time.");const stamp=(d:Date)=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");out=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//QRForge//Calendar//EN","BEGIN:VEVENT","UID:"+stamp(start)+"-"+encodeURIComponent(clean(f.title))+"@qrforge.local","DTSTAMP:"+stamp(start),"DTSTART:"+stamp(start),"DTEND:"+stamp(end),"SUMMARY:"+escapeV(f.title),"LOCATION:"+escapeV(f.location||""),"DESCRIPTION:"+escapeV(f.notes||""),"END:VEVENT","END:VCALENDAR"].join("\r\n");break}
}
if(new TextEncoder().encode(out).length>2200)throw Error("This content is too long. Keep it below 2,200 UTF-8 bytes for reliable QR generation.");return out;
}
