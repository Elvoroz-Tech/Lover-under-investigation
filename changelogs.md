# Changelogs

All notable changes. Newest first. Each entry explains **what** changed, **how**, and the **reasoning/plan** behind it.

---

## [1.2.0] — 2026-10-21 · Crimson Noir theme, dark/light mode, more motion

### Why
Requested: a red + black look, more animation on every page, and a dark/light switch for the whole site.

### Plan / approach
- **Tokenised the palette first.** Every hard-coded colour in `globals.css` that changes between modes became a CSS
  variable (`--glass-hi`, `--nav-bg`, `--input-bg`, `--overlay-bg`, `--prose-text`, `--on-tape`, `--blob-op`…). The
  existing accent token names were kept (so components didn't need rewriting) but remapped: `--tape` is now red,
  `--pink` rose, `--violet` wine, `--lime` gold. Text on the accent uses the new `--on-tape`.
- **Light mode** is one `:root[data-theme="light"]` block overriding those tokens (warm blush white, deep crimson
  accents). The certificate, WhatsApp demo, story export and OG images keep a fixed look in both modes.
- **No-flash theme**: an inline script in `<head>` picks saved choice → device preference → dark, before paint.
  `ThemeToggle` stores the choice in `localStorage` (`lui.theme`, wiped by Opt-out like other `lui.*` keys) and uses
  the View Transitions API for a circular reveal (cross-fade fallback; disabled for reduced motion).
- **Motion added globally**: page-transition curtain (`app/template.tsx`, clears its transform/filter afterwards so
  fixed overlays still work), scroll progress bar, cursor glow, back-to-top with progress ring (`Effects.tsx`), tap
  ripples (`Providers.tsx`), rising hearts + vignette (`Background.tsx`), heartbeat brand mark.
- **Motion added per page**: letter-by-letter titles (`SplitText.tsx`) on home sections and all public pages; cards
  slide in from alternating sides with hover lift/glow and icon wiggle; wobbling "do?" on the picker; animated
  gradient dice card; envelope glow; shimmering contact email; animated footer underlines.
- Recoloured confetti, platform tiles, favicon, apple-icon, OG images and the 429 page to the new palette.
- Applied the owner's local edits: sample nickname "Bubu" → "Delulu Bae" (Hero, WhatsApp demo, input placeholder)
  and a clearly visible footer marquee (now red outline + tint).

### Fixes during the change
- Active filter pill background was being pushed into normal flow by `.filter > span` → excluded `.filter__bg`.
- Rose button had low contrast with white text on dark → solid crimson.
- WhatsApp demo text inherited dark ink in light mode → fixed colour.

### Verified
Build + typecheck clean; screenshots of home, picker, case (sender + recipient), privacy in dark and light at mobile and
desktop sizes; theme toggle switches, persists across reloads; share sheet still pins to the viewport; no console errors.

---

## [1.1.0] — 2026-10-21 · Multilingual abuse filter

### Why
Nicknames/aliases are the only free text on a certificate that gets shared. The v1 list (~25 words) was English-heavy
and easy to bypass. Requested: much stronger coverage for English, Hinglish and Hindi.

### Approach
- Moved the word lists to `src/lib/blocklist.ts` (≈250 terms) split into `SUBSTRING`, `WORD` and `ALLOW` lists, so
  short/ambiguous words only block as whole words and real names are protected.
- Rewrote the matcher in `src/lib/sanitize.ts` as a normalisation pipeline: NFKD + accent removal → look-alike letter
  folding (Cyrillic/Greek/fullwidth) → leetspeak → `ph→f`/`vv→w` → Devanagari normalisation (nukta, chandrabindu,
  long-vowel matras). Text is then checked as squashed substrings (defeats spacing/dots), with repeated letters
  collapsed (defeats "fuuuck"), and word by word. Lists are normalised once with the same pipeline at load time.
- Added link, `@handle` and phone-number rejection (anti-spam / anti-doxxing).
- Added `scripts/test-filter.ts` (`npm run test:filter`) with 70+ block cases and 60+ must-allow cases (common Indian
  names like Sheetal, Akshita, Ishita, Gandhi, Kutti, Pagal; Hindi words like लड़की, गाड़ी, लंदन). All pass.
- Same filter runs on the device and on the server when a link is decoded, so hand-edited links are rejected too.

### Files
`src/lib/blocklist.ts` (new), `src/lib/sanitize.ts` (rewritten), `scripts/test-filter.ts` (new), `package.json`
(`tsx` dev dependency + `test:filter` script), docs 06 and 11 updated.

---

## [1.0.0] — 2026-10-21 · Initial complete build

### Plan & key decisions
- **No database for cases.** A case is tiny (crime id, case number, date, two optional names), so it is encoded into
  the link (`/case/<base64url>`). This makes the privacy promise *structurally* true — there is nothing to store, leak
  or delete — and keeps hosting free/cheap. MongoDB is supported **only** as an optional shared store for rate-limit
  counters (needed on serverless/multi-instance hosting), holding hashed keys + counters that auto-expire.
- **Cloudinary / Twilio not used.** Images are rendered on the device with `html-to-image`; there are no accounts,
  emails or OTPs. Adding them would contradict the zero-storage USP.
- **Certificate = product.** One tap from crime to verdict; names are optional and collapsed; the share button is the
  biggest thing on the result screen.
- **Surprise is protected.** Link previews (OG images, titles, teaser texts) never reveal the crime; recipients get a
  sealed-envelope reveal. `?new=1` (sender mode) is stripped from the address bar so copied links still surprise.
- **Mobile-first CSS** with only `min-width` breakpoints; the certificate uses container-query units so one component
  serves screen and 1080 px exports.
- **Next.js 16 conventions**: `proxy.ts` (formerly middleware, Node runtime), async `params`/`searchParams`.

### Added
- **Pages**: Home, Investigate, Case (sender & recipient modes), How it works, Rules, Privacy, Terms, Opt-out, Contact,
  case-not-found, 404, error; `/api/health`.
- **Content**: 25 preset crimes across 7 categories with award, citation, sentence, stamp status and red-flag severity.
- **Case links** (`src/lib/caseCode.ts`): versioned, UTF-8-safe, isomorphic encoder + strict decoder.
- **Sanitising** (`src/lib/sanitize.ts`): NFKC, control/zero-width/bidi stripping, 20-char cap, leetspeak-aware
  blocklist — applied on device and server.
- **Sharing** (`ShareDock`, `src/lib/share.ts`): background pre-rendered post + story PNGs, native share with image,
  12 platform intents, guided Instagram/Snapchat flow, copy link, downloads, 5 teaser vibes, draggable bottom sheet.
- **OG images**: home + per-case teaser (self-hosted WOFF fonts for Satori), apple-icon, SVG favicon, manifest.
- **Motion system**: aurora background, marquee tapes, masked headline, SVG scribble, 3D tilt card, floaties, scroll
  reveals, animated WhatsApp demo, pointer spotlight cards, shared-layout pills, scanner overlay, ink-in certificate,
  stamp slam, confetti + haptics, envelope reveal, toasts, sheen buttons, footer marquee; reduced-motion respected.
- **Privacy**: on-device recent cases (`localStorage`) with a wipe button; Privacy page that honestly states what the
  server sees and toggles its analytics paragraph based on config.
- **Security**: strict CSP and headers (`next.config.ts`), GET/HEAD-only proxy, URL length cap, case-code pre-checks,
  takedown list (`BLOCKED_CASE_CODES`), `noindex` on cases.
- **Rate limiting**: per-IP (salted SHA-256) fixed window, 3 buckets (page/og/api), styled 429 page + JSON, rate-limit
  headers, crawler-aware OG keys; memory store or optional MongoDB with TTL index and fail-open fallback.
- **SEO**: static `public/robots.txt`, `sitemap.xml`, `.well-known/security.txt`, `humans.txt`, `llms.txt`
  (replace `https://www.example.com` with the real domain); full metadata on every page.
- **Google Search Console / Bing / GA4**: enabled purely by `.env` values. GA loads only when an ID is set, the CSP
  opens Google domains only then, and case URLs are redacted to `/case/[redacted]` before sending.
- **Config**: single brand variable `NEXT_PUBLIC_APP_NAME` drives every visible name, case-number prefix, file names
  and metadata; `.env.example` documents every variable; `.gitignore` included.
- **Docs**: `docs/` with 16 topic files + index.

### Verified
- `tsc --noEmit` clean, `next build` clean.
- Headless Chromium screenshots (390 px mobile and 1440 px desktop) of home, picker, sender result, recipient envelope
  and reveal, privacy page; no console errors.
- PNG exports (1080×~1525 post, 1080×1920 story) render correctly with fonts.
- Proxy behaviour: malformed/tampered code → 404, POST → 405, API flood → 429 after the limit.
- GA + Search Console tags appear only when env values are set; CSP updates accordingly.

### Fixes during the build
- Navbar CTA leaking onto mobile (specificity) → scoped selector.
- Section gutters overridden by `.section` shorthand padding → split padding properties.
- Certificate stamp covering text → reserved footer space for the stamp, moved domain line.
- Filter pill background hidden behind button → `isolation: isolate`.
- Confetti worker blocked by CSP → added `worker-src 'self' blob:`.
- Envelope seal overlapping label → repositioned.
- Desktop hero headline too large in two-column layout → desktop clamp.
