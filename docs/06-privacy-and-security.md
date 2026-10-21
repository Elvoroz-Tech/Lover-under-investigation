# 06 · Privacy & security

## Privacy model (what we promise, and why it's true)
| Promise | Implementation |
|---|---|
| No accounts | There is no auth code at all. |
| No database of cases | Cases are encoded into the link; nothing is written server-side. |
| Generated on your device | Certificate + PNGs rendered in the browser; never uploaded. |
| Anonymous by default | `from` is empty unless the user turns on "sign it" and types an alias. |
| No third-party fonts/CDNs | Fonts self-hosted; CSP `default-src 'self'`. |
| Analytics can't see cases | If GA is enabled, paths are rewritten to `/case/[redacted]` and titles redact the case number. |
| Device history is local | `localStorage` key `lui.history.v1`, wipe button on `/opt-out`. |

What the server *does* see is disclosed on `/privacy`: the requested URL (needed to render), and an IP that is
immediately salted + SHA-256 hashed for rate limiting. Hosting providers may keep standard logs.

## Security layers
1. **Proxy** (`src/proxy.ts`): GET/HEAD only, 1024-char URL cap, case-code charset/length check, takedown list, rate limits.
2. **Strict decoding**: every field of a link is validated; unknown/invalid → 404.
3. **Input sanitising + abuse filter** (`src/lib/sanitize.ts`, data in `src/lib/blocklist.ts`): strips control/zero-width/
   bidi/markup characters, 20-code-point cap, then a multilingual filter (English, Hinglish, Hindi/Devanagari, some
   Punjabi/Urdu) that defeats leetspeak, look-alike Cyrillic/Greek/fullwidth letters, spaced/dotted letters and repeated
   letters, and rejects links, @handles and phone numbers. Applied on device *and* server. Details in `11-content-crimes.md`.
4. **React escaping**: names are only ever rendered as text, never as HTML.
5. **Security headers** (`next.config.ts`): strict CSP (`frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`,
   `worker-src 'self' blob:` for confetti), HSTS, `X-Frame-Options: DENY`, `nosniff`, `no-referrer`, COOP,
   Permissions-Policy denying camera/mic/geo/payment/FLoC/Topics. `poweredByHeader` off.
6. **No write endpoints**: nothing to inject into, no forms posting to the server.
7. **Takedowns**: add an abusive link's code to `BLOCKED_CASE_CODES` and it 404s everywhere (page + OG image).
8. **No indexing of cases**: `/case/*` is `noindex` + disallowed in robots.txt.

## Known trade-offs
- CSP uses `'unsafe-inline'` for scripts because Next.js injects inline hydration scripts on static pages. Moving to a
  nonce-based CSP would force every page to be dynamic. Acceptable here: there is no user HTML anywhere.
- No word filter is perfect. The filter is tuned to block abuse while keeping common Indian names/nicknames working
  (Sheetal, Akshita, Ishita, Gandhi, Kutti, Pagal, Sexy…). Run `npm run test:filter` after every list change.
