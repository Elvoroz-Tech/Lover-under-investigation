# 15 · Status

## ✅ Completed (v1.0.0)
- Home, Investigate, Case (sender + recipient), How it works, Rules, Privacy, Terms, Opt-out, Contact, 404s, error page
- 25 preset crimes in 7 categories, "Surprise me", category filters
- Optional nickname + truly optional signed alias (anonymous default)
- Link-encoded cases with strict validation — no database
- Certificate component with stamp, flags, case number, brand-driven text
- On-device PNG export: post + 9:16 story
- Native share (image + text + link), 12 platform buttons, guided Instagram/Snapchat flow, copy, download
- 5 teaser vibes that never reveal the crime
- Teaser OG images per case + home OG image
- Envelope reveal, confetti, haptics, extensive motion system, reduced-motion support
- On-device recent cases + wipe
- Security headers/CSP, proxy guards, IP-hashed rate limiting (memory / optional MongoDB), takedown list
- Env-driven brand name, Search Console & Bing verification, GA4 with redaction
- Generated apple-icon from brand initials
- Crimson Noir red/black theme, dark + light mode with saved preference, extra animations on every page
- Multilingual nickname filter (English, Hinglish, Hindi) with test script
- Static robots.txt, sitemap.xml, security.txt, humans.txt, llms.txt
- Docs folder + changelog
- Verified: production build, mobile & desktop screenshots, PNG exports, 404/405/429 behaviour, GA/GSC toggles

## ⏳ Left / needs you
- Choose final name + domain → update `.env` and the `example.com` placeholders in `public/`
- Real contact email
- Optional: GA / Search Console IDs, MongoDB URI for serverless
- Real-device QA on iOS Safari + Android Chrome share sheets (headless browsers have no share sheet)
