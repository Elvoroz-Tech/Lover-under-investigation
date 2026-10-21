import Link from "next/link";
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__big" aria-hidden="true">
        {APP_NAME} ✦ {APP_NAME} ✦ {APP_NAME} ✦ {APP_NAME} ✦{" "}
      </p>
      <div className="container footer__grid">
        <ul className="footer__links">
          {FOOTER_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <div className="footer__legal">
          <span>{APP_TAGLINE}</span>
          <span>
            © {year} {APP_NAME}. For entertainment only — not an actual investigation, court, or award body. No
            partners were harmed. Mildly roasted, maybe.
          </span>
        </div>
      </div>
    </footer>
  );
}
