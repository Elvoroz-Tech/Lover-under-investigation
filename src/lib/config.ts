/**
 * Single source of truth for brand + site settings.
 * The brand name comes ONLY from NEXT_PUBLIC_APP_NAME — never hard-code it elsewhere.
 */

const rawName = process.env.NEXT_PUBLIC_APP_NAME?.trim();
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const APP_NAME = rawName && rawName.length > 0 ? rawName : "Lover Under Investigation";

export const APP_TAGLINE =
  process.env.NEXT_PUBLIC_APP_TAGLINE?.trim() ||
  "A relationship roast disguised as an official investigation.";

export const SITE_URL = (rawUrl && rawUrl.length > 0 ? rawUrl : "http://localhost:3000").replace(/\/+$/, "");

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@example.com";

/** "Lover Under Investigation" → "LUI". Used for case numbers & the logo mark. */
export const APP_INITIALS =
  APP_NAME.split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4) || "CASE";

/** The bureau that "issues" certificates — derived from the brand name. */
export const BUREAU_NAME = `Bureau of ${APP_NAME}`;

export const NAV_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/rules", label: "Rules" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/investigate", label: "Open a case" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/rules", label: "Rules" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/opt-out", label: "Opt out" },
  { href: "/contact", label: "Contact" },
] as const;
