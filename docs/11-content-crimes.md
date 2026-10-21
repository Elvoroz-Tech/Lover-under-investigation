# 11 · Content: crimes & teasers

## Crimes — `src/lib/crimes.ts`
Each crime:
```ts
{ id: "bmn", emoji: "🫠", label: "Giving “bare minimum” a whole new meaning", category: "effort",
  award: "The Bare Minimum Award",
  citation: "replying “hmm” after disappearing for 6 hours and calling it communication.", // follows "For outstanding achievement in"
  sentence: "One apology and unlimited snacks.",
  status: "Romantically Suspicious", severity: 5 }
```
Rules:
- **Never change or reuse an `id`** — it lives inside every shared link. Add new crimes with new ids (2–4 chars).
- `citation` must read naturally after "For outstanding achievement in …".
- Keep it affectionate. No body-shaming, cheating accusations, abuse, or anything that could escalate a real fight.
- Categories: `texting`, `food`, `gaming`, `memory`, `effort`, `social`, `sleep` (add more in `CrimeCategory` + `CATEGORY_META`).
- Keep `status` short (≤ ~32 chars) so it fits the stamp.

Currently 25 crimes.

## Teasers — `src/lib/share.ts` (`TEASERS`)
Must never reveal the crime. Current: Dramatic, Official, Chaotic, Soft, Desi.

## Rules page, legal copy
`src/app/rules`, `privacy`, `terms`, `opt-out`, `contact` — plain TSX, edit freely. Brand name comes from config.

## Nickname abuse filter — `src/lib/blocklist.ts` + `src/lib/sanitize.ts`
Languages: English, Hinglish (romanised Hindi), Hindi (Devanagari), plus common Punjabi/Urdu slang.

| List | Matching | Use for |
|---|---|---|
| `SUBSTRING` | anywhere in the text, after removing spaces/dots/symbols | distinctive terms (`madarchod`, `chutiya`, `fuck`, `मादरचोद`) |
| `WORD` | whole words only (plus plural `s`/`es`) and fully spaced-out text | short/ambiguous terms (`gand`, `chut`, `mc`, `nazi`, `गांड`) |
| `ALLOW` | removed before substring checks | innocent names containing a blocked substring (Sheetal, Akshita, Scunthorpe) |

What the matcher handles automatically, so you don't need variants:
leetspeak (`ch00tiya`, `$hit`, `r4ndi`, `g@ndu`), look-alike letters (Cyrillic `fuсk`, fullwidth `ｆｕｃｋ`), separators
(`b h e n c h o d`, `chu.tiya`), repeated letters (`fuuuuck`), accents, `ph→f`, Devanagari nukta/chandrabindu/long-vowel
spelling differences (`भोसड़ी` = `भोसडी`). It also rejects links, `@handles` and 7+ digit phone numbers.

**Workflow:** add a term → add a sample to `scripts/test-filter.ts` → `npm run test:filter`. If a real name gets blocked,
add it to `ALLOW` (for substring hits) or move the term from `SUBSTRING` to `WORD`.
