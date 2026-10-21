# 10 · Design system & animations

## Direction — "Crimson Noir" (v1.2)
Black + red with a warm gold accent: near-black background with drifting wine/red glows, film grain, a faint grid,
rising hearts and a vignette; vivid red as the primary accent; a cream paper certificate with a red rubber stamp.
Big, tight, expressive type mixed with a mono "case file" voice and an italic serif for emphasis.

## Themes: dark (default) + light
All colours are CSS variables on `:root` (dark) and `:root[data-theme="light"]`. Never hard-code a colour in a
component — add a token instead.

| Token | Dark | Light | Meaning |
|---|---|---|---|
| `--bg` / `--bg-2` | `#080405` / `#130809` | `#fff5f4` / `#ffffff` | page / sheets |
| `--ink` / `--muted` | `#fbeff0` / `#b49ca0` | `#1a0709` / `#7d5c61` | text |
| `--tape` | `#ff2b44` | `#d90f28` | primary red accent |
| `--on-tape` | `#0a0405` | `#ffffff` | text on the red accent |
| `--pink` | `#ff6b7f` | `#c2183a` | secondary rose |
| `--violet` | `#8f0a1f` | `#ff9aa8` | wine glow (backgrounds) |
| `--lime` | `#ffc94d` | `#a8650a` | gold "safe/positive" (privacy seal, switch) |
| `--red` | `#e2253d` | same | rubber stamp |
| `--glass*`, `--line`, `--nav-bg`, `--menu-bg`, `--input-bg`, `--overlay-bg`, `--prose-text`, `--blob-op`, `--grain-op` | | | surfaces & effects |

**How the theme is chosen** (`src/app/layout.tsx` → `THEME_SCRIPT`, runs before first paint, no flash):
saved choice in `localStorage["lui.theme"]` → otherwise the device's light/dark setting → otherwise dark.
**Toggle:** `src/components/ThemeToggle.tsx` (sun/moon morph). Uses the View Transitions API for a circular
"ink spill" reveal from the button; falls back to a 0.5 s colour cross-fade. The certificate, WhatsApp demo,
story export and OG images intentionally look the same in both themes.

## Fonts (self-hosted in `src/fonts`)
- **Bricolage Grotesque** (variable 200–800) — display & body.
- **Space Mono** 400/700 — labels, case numbers, chips.
- **Instrument Serif Italic** — accent words ("nominated", "Obviously.") and names on certificates.
- OG images use static WOFF copies in `src/og-fonts` (Satori can't read WOFF2).

## Mobile-first rules
Base CSS targets ~360–430 px phones. Only `min-width` media queries are used (640 px, 960 px) and they only *add*
columns/size. Touch targets ≥ 42 px, primary buttons 56–64 px, safe-area insets respected, no horizontal scroll
(`overflow-x: clip`). The certificate uses **container-query units (`cqw`)** so the same component is pixel-perfect at
320 px on screen and 1080 px for export.

## Animation catalogue
| Where | Animation |
|---|---|
| Background | Three blurred blobs drifting (CSS), animated grain |
| Navbar | Spring drop-in, shared-layout hover pill, burger → X morph, circular clip-path menu reveal, staggered menu items |
| Hero | Masked line-by-line headline rise, hand-drawn SVG strike-through, blur-in subtitle, spring CTAs, floating emojis, 3D pointer-tilt certificate with glare + idle float |
| Tape | Two infinite marquees at opposite angles/directions |
| Sections | Scroll-triggered blur-up reveals with stagger |
| WhatsApp demo | Looping typing dots → message pop → partner "typing…" → reply |
| Picker | Card spotlight following the pointer, emoji wiggle, arrow rotate, shared-layout filter pill, popLayout filtering, dice spin, accordion details, spring switch |
| Case creation | Full-screen scanner (dual spinning rings, cycling status text, progress bar) |
| Certificate | Staggered "ink" blur-in of every line, rubber stamp slam (scale 2.6→1 spring) |
| Verdict | Canvas confetti (centre + side cannons), haptic vibration |
| Recipient | Wobbling sealed envelope, pulsing wax seal, blinking hint, exit blur, certificate rising from below |
| Share dock | Glowing pulse on primary button, staggered platform tiles, animated teaser swap, draggable bottom sheet |
| Toasts | Spring pop-in, blur exit |
| Buttons | Infinite sheen sweep, arrow nudge, press scale |
| Footer | Giant outlined wordmark marquee |
| 404 | Bouncing outlined "404" |
| **v1.2 additions** | |
| Every page | Red curtain lift + blur-in page transition (`src/app/template.tsx`) |
| Global | Scroll progress bar, cursor glow (mouse only), back-to-top button with progress ring (`Effects.tsx`) |
| Global | Tap ripple on buttons, platform tiles, crime cards, chips (`Providers.tsx`) |
| Background | Rising hearts/sparkles, vignette, wine/red/gold blobs |
| Brand mark | Heartbeat pulse |
| Titles | Letter-by-letter spring text (`SplitText.tsx`) on home sections and all public pages |
| Cards | Slide in from alternating sides; hover lift + red glow; emoji/icon wiggle |
| Investigate | Wobbling "do?", animated gradient dice card, red hover glow on crime cards |
| Recipient | Envelope glow pulse |
| Contact | Shimmering gradient email |
| Footer | Animated underline links; red outlined marquee wordmark |
| Theme switch | Circular reveal via View Transitions |

All motion respects `prefers-reduced-motion` (MotionConfig `reducedMotion="user"` + CSS override; confetti skipped).
