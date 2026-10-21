# Lover Under Investigation 🕵️

A relationship roast disguised as an official investigation. Pick your partner's "crime", get an official-looking
certificate, send them the evidence. **No signup. No database. Certificates are generated on your device.**

> The project name is a variable — set `NEXT_PUBLIC_APP_NAME` in `.env` and it changes everywhere.

## Quick start
```bash
npm install
cp .env.example .env   # optional, defaults work
npm run dev            # http://localhost:3000
```
Production: `npm run build && npm start`.

## Stack
Next.js 16 (App Router, TypeScript) · React 19 · Motion · html-to-image · canvas-confetti · optional MongoDB (rate-limit
counters only). No Cloudinary/Twilio needed: nothing is uploaded and there are no accounts.

## Before going live
1. Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `RATE_LIMIT_SALT` in `.env`.
2. Replace `https://www.example.com` in `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`,
   `public/.well-known/security.txt`.
3. Optional: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `MONGODB_URI`.

Full documentation lives in [`docs/`](docs/README.md). Change history: [`changelogs.md`](changelogs.md).
