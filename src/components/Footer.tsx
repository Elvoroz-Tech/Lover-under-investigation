import Link from "next/link";
import { APP_NAME, APP_TAGLINE, COMPANY_EMAIL, COMPANY_NAME, FOOTER_LINKS } from "@/lib/config";

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
            {APP_NAME} is a product of <b style={{ color: "var(--ink)" }}>{COMPANY_NAME}</b>. Designed, built and operated
            by {COMPANY_NAME} ·{" "}
            <a href={`mailto:${COMPANY_EMAIL}`} style={{ color: "var(--tape)" }}>
              {COMPANY_EMAIL}
            </a>
          </span>
          <span>
            © {year} {COMPANY_NAME}. All rights reserved. {APP_NAME} is for entertainment only — not an actual investigation, court, or award body. No
            partners were harmed. Mildly roasted, maybe.
          </span>
        </div>
      </div>
    </footer>
  );
}