# QRForge
A local-first QR toolkit with a crystal-white interface.

## Features
20 payload types, live SVG rendering, solid/gradient ink, six patterns, three corner and eye styles, safe raster logos, reusable frames, PNG/JPG/WebP/SVG/PDF exports, clipboard/share/print, IndexedDB library, image/camera scanner, CSV batch generation and SVG ZIP download, barcode and image utilities, 31 developer utilities, light/dark/system theme, locale selector and Arabic RTL.

## Run locally
Node 22.13 or newer.
```sh
npm ci
npm run dev
```
Open http://localhost:5173. No API keys are needed.

```sh
npm run typecheck
npm test
npm run lint
npm run test:e2e
npm run build
```
The browser tests use a locally installed Edge on Windows; set PLAYWRIGHT_EXECUTABLE_PATH to override it.

## Structure
- app/ — application routes, metadata and global visual tokens
- components/generator/ — content, design, preview and local library
- components/scanner/ — local QR decoding and camera lifecycle
- components/tools/ — bulk, barcode, image and developer interfaces
- lib/payloads/ — typed payload construction and validation
- lib/qr/ — versioned design schema, frame configurations, shared SVG renderer
- lib/export/ — one SVG-to-export pipeline
- lib/storage/ — IndexedDB persistence
- lib/tools/ — local developer utilities
- i18n/ — ten navigation/intro dictionaries and locale definitions
- public/ — PWA manifest, icons, service worker and offline fallback
- tests/ — unit and browser acceptance tests

## Architecture
All user content stays in the browser. Server rendering only serves the interface. The rendered SVG is the single source for preview and every export. PDF retains QR vector paths via svg2pdf for ASCII frame labels; labels containing other scripts use a high-resolution raster PDF to preserve browser-rendered glyphs. Raster logos remain raster. Library writes are explicit to avoid automatically persisting Wi-Fi passwords and other sensitive input. A logo forces error correction H. The quality indicator is a heuristic, not a scanner guarantee.

## Extending
Add QR types in lib/payloads/index.ts with fields and a validated builder; include payload and decode tests. Add frame templates to lib/qr/design.ts and a renderer variation when necessary. Add developer tools to lib/tools/index.ts and the tools interface. Imported designs are validated with Zod and restricted to raster data URLs for logos.

## Deployment
The current starter uses Vinext's Next-compatible React application on Cloudflare Workers through Sites. Run npm run build. No D1, R2 or backend service is required. The application also uses standard Next route/component conventions to support migration to a Next.js static export on a static hosting service; that deployment configuration is not tested in this build.

## Privacy and security
No tracking or paid API calls. Links accept HTTP/HTTPS only. Scanned links require an explicit open action. QR text is XML-escaped; SVG uploads are excluded to avoid active SVG content. Regex tests run in a worker with a one-second timeout. CSV batches are limited to 100 rows, input to 2,200 QR bytes, and raster export to 4096 pixels. Uploaded files and output image dimensions are bounded. Browser storage can be cleared by the user. Clipboard, camera and share support vary by browser and secure-context policy.

## Internationalization
Navigation and introductory copy support English, Hindi, Spanish, French, German, Portuguese, Arabic, Japanese, Korean and Simplified Chinese. Detailed forms and utility descriptions currently fall back to English; full translation is unfinished. Arabic sets document direction to RTL. Payloads support Unicode and international addresses/phone numbers.

## Offline
Visited application pages and static resources are cached after service-worker installation on the hosted site. The service worker never caches API requests, query-string requests or user-generated content. First use requires a connection. Browser PWA installation and offline behavior depend on browser support and the host's authentication requirements.

## Environment variables
No application environment variables are required. Contact information is intentionally unconfigured in app/[slug]/page.tsx and should be set by the site owner before public launch.

## Limitations
No cloud accounts, sync or dynamic redirect analytics are implemented. No payment processing occurs. Crypto address checksums are not validated. Camera scanning requires a supported browser and user camera permission. Real-device print/scan tests are recommended. Complete translation, configurable owner contact information and real-device camera/PWA certification remain launch follow-ups.
