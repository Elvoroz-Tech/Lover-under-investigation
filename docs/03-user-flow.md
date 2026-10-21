# 03 · User flow

## Pages
| Route | Purpose |
|---|---|
| `/` | Hero ("Your partner has been nominated for something…"), live sample certificate, how-it-works, WhatsApp preview demo, bento of promises, CTA |
| `/investigate` | The picker: optional names, "Surprise me" dice, category filter, crime cards, recent cases |
| `/case/[code]` | Sender view (verdict + share dock) or recipient view (sealed envelope → reveal → counter-case) |
| `/how-it-works`, `/rules`, `/privacy`, `/terms`, `/opt-out`, `/contact` | Public pages (navbar + footer) |
| `/case-not-found`, 404, error | Friendly failure screens |
| `/api/health` | Uptime check |

## Sender
1. **Home** → "INVESTIGATE THEM".
2. **Investigate** → tap a crime (or 🎲). Optional: "Add names" → their nickname; "sign it" switch → alias.
3. A 1.5 s "scanning evidence" overlay plays while the case code is created locally and the route is prefetched.
4. **Case page (`?new=1`)** → certificate inks in, stamp slams, confetti. `?new=1` is immediately stripped from the
   address bar so a copied URL still gives the partner the envelope experience.
5. **Share dock**: big glowing **Send to Partner**, **New award** (re-rolls a different crime, same names), **Copy link**,
   teaser vibe chips (Dramatic / Official / Chaotic / Soft / Desi) with live preview, platform grid, save image, story size.

## Recipient
1. Receives teaser text + link (+ certificate image if shared natively — see note below).
2. Link preview card: "CASE NO. LUI-2026-1234 · You are under investigation." Crime hidden.
3. Opens link → "A case has been opened against you." + wobbling sealed envelope → tap.
4. Certificate rises in, stamp slams, confetti, haptic buzz (Android).
5. "Revenge is a dish best served with a certificate" → **File a counter-case**, or **Send it back** / share.

> Note: when the sender uses the native share sheet with the image attached, the image itself shows the crime. That
> is the sender's choice; the text-only paths (WhatsApp/Telegram buttons, Copy link) keep the surprise intact.
