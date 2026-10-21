# 07 · Rate limiting

Files: `src/proxy.ts`, `src/lib/rateLimit.ts`

| Bucket | Paths | Default limit (per window) |
|---|---|---|
| `page` | all pages | `RATE_LIMIT_PAGES_MAX=120` |
| `og` | `*/opengraph-image`, `*/twitter-image` | `RATE_LIMIT_OG_MAX=40` |
| `api` | `/api/*` | `RATE_LIMIT_API_MAX=30` |

Window: `RATE_LIMIT_WINDOW_SECONDS=60` (fixed window). Responses carry `X-RateLimit-Limit/Remaining/Reset`; over the
limit you get **429** with `Retry-After` — a styled "Slow down, detective" HTML page, or JSON for `/api`.

## Keys
`sha256(RATE_LIMIT_SALT + ":" + ip)` truncated — raw IPs are never stored. IP is read from `x-forwarded-for` (first hop),
`x-real-ip`, or `cf-connecting-ip`. Link-preview crawlers (WhatsApp, Facebook, Telegram, Discord…) get their own key on the
OG bucket so a viral link doesn't starve real users who share an IP with a crawler.

## Stores
- **Memory (default)**: `Map` with a periodic sweep and a 50k-entry safety valve. Perfect for one server/container.
- **MongoDB (optional)**: set `MONGODB_URI`. Collection `rate_limits`, `_id = key:windowStart`, atomic `$inc` upsert,
  TTL index on `expiresAt` so documents delete themselves. 1.5 s connect / 0.8 s query timeouts; on any failure it
  falls back to memory (fail-open) and retries the connection later.

Use MongoDB when you deploy to serverless (Vercel) or multiple instances, otherwise each instance counts separately.
