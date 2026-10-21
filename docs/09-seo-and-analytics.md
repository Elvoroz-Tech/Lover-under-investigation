# 09 · SEO & analytics

## Static SEO files (`public/`)
| File | Notes |
|---|---|
| `robots.txt` | Allows all, disallows `/case/`, `/case-not-found`, `/api/`. Points to the sitemap. |
| `sitemap.xml` | All public pages. |
| `.well-known/security.txt` | Security contact (RFC 9116). |
| `humans.txt` | Credits. |
| `llms.txt` | Short site description for AI crawlers. |

👉 **Replace `https://www.example.com` with your real domain** in `robots.txt`, `sitemap.xml`, `.well-known/security.txt`
and `llms.txt`, and the email in `security.txt`. That's all.

## Built-in metadata
- Per-page titles/descriptions/canonicals, Open Graph + Twitter cards (`src/app/layout.tsx` and each page).
- Dynamic OG images: `/opengraph-image` (home) and `/case/[code]/opengraph-image` (teaser, never reveals the crime).
- `manifest.webmanifest`, SVG favicon, theme colour.
- Case pages are `noindex, nofollow`.

## Google Search Console
1. Search Console → add property → **HTML tag** method.
2. Copy only the `content="…"` value into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
3. Rebuild/redeploy → click Verify → submit `https://yourdomain/sitemap.xml`.
(Bing: same with `NEXT_PUBLIC_BING_SITE_VERIFICATION`.)

## Google Analytics 4
1. Create a GA4 property → copy the Measurement ID (`G-…`).
2. Put it in `NEXT_PUBLIC_GA_MEASUREMENT_ID`, rebuild.
3. Done: gtag loads, the CSP automatically allows Google's domains, page views fire on every route change.

Privacy guards in `src/components/Analytics.tsx`: case URLs are sent as `/case/[redacted]`, case numbers are removed from
titles, Google signals + ad personalisation are disabled. Custom events (no case data): `case_created` (category),
`case_another`, `case_opened`, `share_primary`, `share_platform` (platform), `share_copy`, `download` (post/story).
The Privacy page automatically switches its analytics paragraph on/off depending on the env var.
