# 14 · Main functions reference

| Function / component | File | What it does |
|---|---|---|
| `encodeCase(data)` | lib/caseCode.ts | Sanitises names and packs a case into a base64url code |
| `decodeCase(code)` | lib/caseCode.ts | Strictly validates and unpacks a code → `ResolvedCase` or `null` |
| `formatCaseNumber(prefix, data)` | lib/caseCode.ts | `LUI-2026-4720` |
| `randomCaseNo()`, `todayDay()` | lib/caseCode.ts | Crypto-random 4-digit number; UTC day index |
| `cleanName`, `safeName`, `isNameAllowed` | lib/sanitize.ts | Normalise/strip/cap nicknames; blocklist check |
| `getCrime`, `randomCrime` | lib/crimes.ts | Lookup by id; random (optionally excluding one) |
| `nodeToPng(node)` | lib/share.ts | DOM → PNG blob in the browser |
| `nativeShare(data)` | lib/share.ts | Web Share wrapper returning shared/cancelled/unsupported |
| `platformUrl(p, text, url)` | lib/share.ts | Share-intent URL per platform |
| `copyText`, `downloadBlob`, `canShareFiles` | lib/share.ts | Clipboard, download, capability check |
| `readHistory`, `addHistory`, `wipeDevice` | lib/history.ts | Local-only recent cases |
| `rateLimit(ip, bucket)` | lib/rateLimit.ts | Counts a hit, returns ok/remaining/reset |
| `proxy(req)` | proxy.ts | Method/URL/code guards + rate limiting |
| `track(event, params)` | components/Analytics.tsx | Anonymous GA event (no-op if GA off) |
| `<Certificate data animated exportWidth />` | components | Renders the award |
| `<ShareDock data code recipient onAnother />` | components | Sharing UI and image pipeline |
| `<CaseClient data code fresh />` | app/case/[code] | Sender verdict vs recipient envelope reveal |
| `<InvestigateClient />` | app/investigate | Picker, optional names, scan overlay |
