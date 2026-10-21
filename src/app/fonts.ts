import localFont from "next/font/local";

/** Self-hosted fonts — no request ever goes to a third-party font CDN. */

export const display = localFont({
  src: "../fonts/bricolage-var.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
});

export const mono = localFont({
  src: [
    { path: "../fonts/space-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/space-mono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const serif = localFont({
  src: "../fonts/instrument-serif-italic.woff2",
  variable: "--font-serif",
  weight: "400",
  style: "italic",
  display: "swap",
});
