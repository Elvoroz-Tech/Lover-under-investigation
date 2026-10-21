# 13 · Folder structure

```
.
├── .env.example            all config, documented
├── .gitignore
├── changelogs.md           history of every major change
├── docs/                   you are here
├── next.config.ts          security headers + CSP, GA-aware
├── package.json / tsconfig.json
├── public/                 robots.txt, sitemap.xml, humans.txt, llms.txt, .well-known/security.txt
└── src/
    ├── proxy.ts            request guard + rate limiting (Next 16 "proxy", formerly middleware)
    ├── fonts/              self-hosted WOFF2 fonts for the site
    ├── og-fonts/           WOFF fonts for OG image rendering
    ├── lib/
    │   ├── config.ts       brand name, URL, email, nav/footer links (single source of truth)
    │   ├── crimes.ts       the accusations + categories
    │   ├── caseCode.ts     encode/decode/validate case links, case number & date formatting
    │   ├── sanitize.ts     nickname cleaning + multilingual abuse matcher
    │   ├── blocklist.ts    English / Hinglish / Hindi word lists
    │   ├── share.ts        teasers, platform intents, clipboard, PNG export, native share
    │   ├── history.ts      on-device recent cases + wipe
    │   ├── rateLimit.ts    hashed-IP limiter, memory or MongoDB
    │   └── og.tsx          shared OG image frame + font loader
    ├── components/
    │   ├── Certificate.tsx the product (cqw-scaled, animated or export mode)
    │   ├── ShareDock.tsx   all sharing UI + off-screen export renders + bottom sheet
    │   ├── Hero.tsx, TiltCard.tsx, Floaties.tsx, WhatsAppMock.tsx   home page pieces
    │   ├── Navbar.tsx, Footer.tsx, Background.tsx, CautionTape.tsx  shell
    │   ├── Reveal.tsx, Toast.tsx, Providers.tsx                    motion/feedback utilities
    │   ├── PrivacySeal.tsx, PlatformIcon.tsx, ProsePage.tsx, WipeButton.tsx, NotFoundView.tsx
    │   ├── ThemeToggle.tsx dark/light switch with circular reveal
    │   ├── Effects.tsx     scroll progress, cursor glow, back-to-top
    │   ├── SplitText.tsx   letter-by-letter animated headings
    │   └── Analytics.tsx   optional GA4 with case redaction + track()
    └── app/
        ├── layout.tsx      fonts, metadata, verification tags, no-flash theme script, shell
        ├── template.tsx    page-transition curtain on every navigation
        ├── globals.css     the whole design system
        ├── page.tsx        home
        ├── investigate/    picker (page + InvestigateClient)
        ├── case/[code]/    page (server decode), CaseClient, opengraph-image
        ├── how-it-works/ rules/ privacy/ terms/ opt-out/ contact/
        ├── case-not-found/, not-found.tsx, error.tsx
        ├── api/health/     uptime endpoint
        ├── opengraph-image.tsx, manifest.ts, icon.svg
```
