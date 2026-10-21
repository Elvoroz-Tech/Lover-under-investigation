# 02 · Architecture

## Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack), TypeScript | SSR for link previews, static pages, one codebase |
| UI | React 19 + hand-written CSS (`src/app/globals.css`) | Full control of a unique look; no template feel |
| Animation | `motion` (Framer Motion v12+, `motion/react`) + CSS keyframes | Springs, layout animations, scroll reveals |
| Image export | `html-to-image` (in the browser) | Certificate PNGs are rendered on the device |
| Confetti | `canvas-confetti` (lazy-loaded) | Celebration on verdict / reveal |
| Fonts | Self-hosted via `next/font/local` (Bricolage Grotesque, Space Mono, Instrument Serif) | No third-party font requests |
| OG images | `next/og` `ImageResponse` | Teaser cards for WhatsApp/iMessage/etc. |
| Rate limiting | `src/proxy.ts` + `src/lib/rateLimit.ts` | Per-IP, hashed; memory or optional MongoDB |
| Database | **None required.** MongoDB optional (rate-limit counters only) | Privacy USP |

Cloudinary and Twilio were evaluated and **not used**: there are no uploads (images are generated on-device) and no
emails/OTPs (no accounts).

## Why no database?
A case = `crime id + case number + date + optional nickname + optional alias`. That fits in ~40 characters, so it is
encoded directly into the URL (`/case/<code>`). Anyone with the link can render the certificate; nobody else can. No
storage means nothing to leak, nothing to moderate at rest, nothing to delete, and near-zero hosting cost.

MongoDB is used **only** if `MONGODB_URI` is set, and **only** to share rate-limit counters between multiple server
instances (serverless/horizontal scaling). Documents hold a hashed key, a counter and an expiry — no case data.

## Request flow
```
Browser ──► src/proxy.ts (Node runtime, every non-static request)
              1. GET/HEAD only (405 otherwise)
              2. URL length ≤ 1024 (414)
              3. /case/<code>: charset + length + takedown list → else rewrite /case-not-found (404)
              4. rate limit per hashed IP, bucket = page | og | api → 429 page/JSON
          ──► App Router page
              /case/[code]      → decodeCase() on the server (strict validation) → CaseClient
              /case/[code]/opengraph-image → teaser PNG (crime NOT revealed)
              everything else  → statically pre-rendered
```

## Client vs server responsibilities
| Work | Where |
|---|---|
| Building the case code | Browser (`encodeCase`) |
| Rendering the certificate | Browser (React) — server only pre-renders HTML |
| Exporting PNG (post 1080×~1500, story 1080×1920) | Browser (`html-to-image`) |
| Share sheet / platform intents | Browser |
| Recent cases list | Browser `localStorage` only |
| Decoding/validating links, OG teaser images | Server (stateless, nothing written) |
| Rate limiting | Server proxy |
