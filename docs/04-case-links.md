# 04 · Case links

File: `src/lib/caseCode.ts`

## Format
```
/case/<code>
code = base64url( "1" ␟ crimeId ␟ caseNo ␟ day ␟ to ␟ from )      (␟ = U+001F unit separator)
```
| Field | Example | Rules |
|---|---|---|
| version | `1` | Must equal `"1"`. Bump to `2` for any breaking change and keep decoding `1`. |
| crimeId | `bmn` | Must exist in `CRIMES`. **Never rename or reuse an id** — old links would break or change meaning. |
| caseNo | `4720` | Exactly 4 digits, random, decorative. |
| day | `20747` | Days since Unix epoch (UTC). Valid from 2024-01-01 to tomorrow. |
| to | `Bubu` | Optional nickname, cleaned by `safeName`. Empty → "The Accused". |
| from | `""` | Optional alias. Empty → "Anonymous". Only filled if the sender turned on "sign it". |

UTF-8 safe (emoji in nicknames work), isomorphic (`btoa`/`TextEncoder`, no `Buffer`), max 220 characters.

## Validation (`decodeCase`)
Rejects: wrong charset, too long, bad base64, invalid UTF-8, wrong field count/version, unknown crime, non-4-digit case
number, out-of-range day, and any name that fails sanitising or the blocklist. A rejected link shows the 404
"Case dismissed" page — tampered links can never render arbitrary text.

## Case number display
`formatCaseNumber(APP_INITIALS, data)` → `LUI-2026-4720`. The prefix comes from the brand initials, so it changes
automatically when you rename the app.

## Encoded ≠ encrypted
Anyone who has the link can decode it. This is stated honestly on the Privacy page. Names are optional for this reason.
