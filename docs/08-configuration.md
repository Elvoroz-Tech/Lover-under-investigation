# 08 · Configuration (.env)

Copy `.env.example` → `.env` (or `.env.local`). Every variable is optional.

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | `Lover Under Investigation` | **The brand name, everywhere** (nav, certificates, titles, OG images, legal pages, share text, file names, case-number prefix, manifest). |
| `NEXT_PUBLIC_APP_TAGLINE` | "A relationship roast disguised…" | Footer + meta description |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical URL, OG `metadataBase`, domain printed on certificates |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@example.com` | Contact / Privacy / Opt-out pages |
| `RATE_LIMIT_WINDOW_SECONDS` | `60` | Rate-limit window |
| `RATE_LIMIT_PAGES_MAX` / `_OG_MAX` / `_API_MAX` | `120` / `40` / `30` | Per-bucket limits |
| `RATE_LIMIT_SALT` | dev salt | Secret used to hash IPs — **set a long random string in production** |
| `MONGODB_URI` | empty | Optional shared rate-limit store |
| `MONGODB_DB_NAME` | `lover_under_investigation` | DB name for the above |
| `BLOCKED_CASE_CODES` | empty | Comma-separated case codes to take down |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | empty | Google Search Console meta-tag value |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | empty | Bing Webmaster meta-tag value |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | empty | GA4 ID (`G-XXXXXXX`). Empty = no GA code loaded at all |

## Renaming the project
Change only `NEXT_PUBLIC_APP_NAME` (and `NEXT_PUBLIC_SITE_URL` once you have a domain), then **rebuild**. The name is
read from `src/lib/config.ts` (`APP_NAME`, `APP_INITIALS`, `BUREAU_NAME`) — no other file hard-codes it.
The only places that still say `example.com` are the static SEO files in `public/` (see 09).

## Important: rebuild after changes
`NEXT_PUBLIC_*` variables are inlined at **build time**. After editing them run `npm run build` again (your host does
this automatically on redeploy).
