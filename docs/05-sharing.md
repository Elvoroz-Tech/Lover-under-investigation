# 05 · Sharing

Files: `src/components/ShareDock.tsx`, `src/lib/share.ts`, `src/components/PlatformIcon.tsx`

## Image pre-rendering
On the case page two hidden, fixed-size certificates are mounted off-screen:
- **Post**: 1080 px wide (≈1080×1500), for chats, feeds, downloads.
- **Story**: 1080×1920 with "Case closed" tape and "Make one back 👀 + domain".

600 ms after mount, both are converted to PNG `File`s in the browser with `html-to-image` (a warm-up pass is done first
for Safari font embedding). The UI shows "⏳ rendering" → "🟢 image ready". Pre-rendering matters because
`navigator.share()` must be called inside the user's tap — waiting for a render would lose the gesture on iOS.

## Send to Partner (primary)
1. If the device can share files → native sheet with **image + teaser text + link** (WhatsApp, Instagram, Snapchat,
   iMessage, Telegram… whatever is installed).
2. Else if Web Share exists → native sheet with **text + link**.
3. Else (desktop) → bottom sheet with every platform button.

## Platform buttons
| Platform | Method |
|---|---|
| WhatsApp | `https://wa.me/?text=` |
| Telegram | `https://t.me/share/url` |
| X | `https://twitter.com/intent/tweet` |
| Facebook | `sharer.php` |
| Messenger | `fb-messenger://share` (mobile app) |
| Reddit | `reddit.com/submit` |
| Threads | `threads.net/intent/post` |
| LinkedIn | `share-offsite` |
| SMS / iMessage | `sms:?&body=` |
| Email | `mailto:` |
| **Instagram** | No web intent exists → native share of the **story image** (link copied at the same time); fallback: guided sheet "save image + copy link → add to Story → link sticker". |
| **Snapchat** | Native share of the post image; fallback: same guided sheet. |
| Copy link | Clipboard API with `execCommand` fallback |
| Save image / Story size | Direct PNG download |

## Teasers
Five vibes in `TEASERS` (Dramatic, Official, Chaotic, Soft, Desi). None reveals the crime. Add more in `src/lib/share.ts`.

## Referrer safety
`Referrer-Policy: no-referrer` means opening any platform link never leaks the case URL to that platform.
