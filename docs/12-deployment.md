# 12 · Running & deployment

## Requirements
Node.js ≥ 20.9 (tested on 22), npm.

## Local
```bash
npm install
cp .env.example .env      # optional — defaults work
npm run dev               # http://localhost:3000
npm run lint              # TypeScript check
npm run build && npm start
```

## Vercel (recommended)
1. Push to GitHub → import in Vercel (framework auto-detected).
2. Add env vars from `.env.example` (at least `NEXT_PUBLIC_SITE_URL`, `RATE_LIMIT_SALT`, and `MONGODB_URI` so rate
   limits are shared across serverless instances).
3. Deploy. Add your domain, update `NEXT_PUBLIC_SITE_URL`, redeploy.

## VPS / Docker / Render / Railway
`npm ci && npm run build && npm start` (port via `PORT`). Put it behind a proxy that sets `X-Forwarded-For`
(Nginx/Cloudflare do). In-memory rate limiting is fine for a single instance.

## Go-live checklist
- [ ] `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` set
- [ ] `RATE_LIMIT_SALT` = long random string
- [ ] `public/robots.txt`, `sitemap.xml`, `.well-known/security.txt`, `llms.txt`: replace `example.com`
- [ ] Optional: Search Console + GA IDs, then submit sitemap
- [ ] Optional: `MONGODB_URI` for multi-instance hosting
- [ ] Share a test case to WhatsApp to confirm the preview card shows
