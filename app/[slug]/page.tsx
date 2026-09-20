import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Workspace from "@/components/generator/workspace";
import SiteShell from "@/components/site-shell";
import Scanner from "@/components/scanner/scanner";
import Bulk from "@/components/tools/bulk";
import DeveloperTools from "@/components/tools/developer-tools";
import Barcode from "@/components/tools/barcode";
import Images from "@/components/tools/images";
import {Kind} from "@/lib/payloads";
const generator:Record<string,{kind:Kind;tab?:string;title:string}>={
"qr-code-generator":{kind:"Website",title:"Free QR code generator"},"url-qr-code":{kind:"Website",title:"Website URL QR code generator"},"wifi-qr-code":{kind:"Wi-Fi",title:"Wi-Fi QR code generator"},"vcard-qr-code":{kind:"Contact",title:"Contact vCard QR code builder"},"whatsapp-qr-code":{kind:"WhatsApp",title:"WhatsApp QR code generator"},"upi-qr-code":{kind:"UPI",title:"UPI payment QR code generator"},"qr-code-with-logo":{kind:"Website",tab:"logo",title:"Create a QR code with your logo"},"custom-qr-code":{kind:"Website",title:"Custom QR code designer"},"qr-code-frames":{kind:"Website",tab:"frame",title:"QR code frames and custom text"}};
const pages:Record<string,{title:string;description:string}>={
"qr-scanner":{title:"Read between the squares.",description:"Scan a code from your camera or an image. Privately, on your device."},
"bulk-qr-generator":{title:"More codes. Less busywork.",description:"Turn a list or CSV into a coordinated collection of QR codes."},
"developer-tools":{title:"Your everyday toolkit.",description:"Format, encode, inspect and create. Useful little tools that respect your privacy."},
"barcode-generator":{title:"From value to barcode.",description:"Create and download barcodes in common retail and inventory formats."},
"image-tools":{title:"Give your images a new shape.",description:"Resize, compress, convert and encode images in your browser."},
privacy:{title:"Your data stays close.",description:"How QRForge handles your information."},
terms:{title:"A few useful ground rules.",description:"Using QRForge responsibly."},
about:{title:"Made for a world of possibilities.",description:"Create. Customize. Scan. Anywhere."},
contact:{title:"Contact QRForge",description:"Contact information for this installation."}};
export function generateStaticParams(){return [...Object.keys(generator),...Object.keys(pages)].map(slug=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const title=generator[slug]?.title||pages[slug]?.title||"QRForge";const description=pages[slug]?.description||"Create, customize and export "+title.toLowerCase()+" with local processing and no account required.";return {title:title+" | QRForge",description,alternates:{canonical:"/"+slug},openGraph:{title,description,url:"/"+slug}}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(generator[slug]){const g=generator[slug];return <Workspace initialKind={g.kind} initialTab={g.tab}/>}const page=pages[slug];if(!page)notFound();let body;
if(slug==="qr-scanner")body=<Scanner/>;
else if(slug==="bulk-qr-generator")body=<Bulk/>;
else if(slug==="developer-tools")body=<DeveloperTools/>;
else if(slug==="barcode-generator")body=<Barcode/>;
else if(slug==="image-tools")body=<Images/>;
else body=<section className="panel prose-page">{slug==="privacy"?<><h2>Local processing</h2><p>QR payloads, Wi-Fi passwords, developer inputs and uploaded images are processed in your browser. QRForge does not send them to an external QR or image service. No analytics are added by default.</p><h2>Your saved library</h2><p>History and templates are stored in this browser only, when you choose to save them. Saved entries include your content and design, including a logo if present. You can disable saving, delete entries, or clear the library at any time. Browser storage can be removed by your browser, so keep separate copies of important exports.</p><h2>Hosting and camera access</h2><p>The hosting provider may process normal connection information to serve the site. Camera permission is requested only when you start the scanner. Camera streams stop when scanning ends or you leave the scanner.</p></>:slug==="terms"?<><h2>Use and reliability</h2><p>You are responsible for the content you encode and the destinations you share. Test exported codes with the devices and print sizes you intend to use. Quality guidance is an estimate, not a guarantee.</p><p>Static QR codes do not require a redirect service, but a destination URL or its content may stop working. Payment QR tools encode details; they do not process payments. Verify payment information in your payment app.</p><p>Do not use this service for unlawful content or to mislead others. The software is provided as available, without a guarantee of uninterrupted availability.</p></>:slug==="about"?<><h2>Useful by default</h2><p>QRForge is a free, local-first toolkit for QR codes, frames, scanning and everyday developer tasks. Core tools need no account and add no watermarks.</p><h2>Designed for sharing</h2><p>Share websites, contacts, Wi-Fi networks and more. Your exported static QR codes contain the content you chose directly.</p></>:<><h2>Contact not configured</h2><p>The owner of this installation has not provided a contact address yet. This page can be updated with the owner’s support details before public launch.</p></>}</section>;
return <SiteShell active={slug==="qr-scanner"?"scanner":slug==="bulk-qr-generator"?"bulk":"tools"}><div className="intro"><div><div className="eyebrow">QRFORGE / {slug.replaceAll("-"," ").toUpperCase()}</div><h1>{page.title}</h1><p>{page.description}</p></div></div>{body}<div className="page-spacer"/></SiteShell>}
