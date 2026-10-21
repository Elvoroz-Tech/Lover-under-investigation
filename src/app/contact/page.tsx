import type { Metadata } from "next";
import ProsePage, { Card } from "@/components/ProsePage";
import Reveal from "@/components/Reveal";
import { APP_NAME, COMPANY_EMAIL, COMPANY_NAME, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${COMPANY_NAME} team behind ${APP_NAME}.`,
  alternates: { canonical: "/contact" },
};

const TOPICS = [
  ["💡", "Crime suggestion", "New crime suggestion"],
  ["🚨", "Report abuse", "Abuse report"],
  ["🤝", "Collab / press", "Collab or press"],
  ["🐛", "Something broke", "Bug report"],
] as const;

export default function Contact() {
  return (
    <ProsePage eyebrow="Contact" title="Talk to the" accent="bureau." lede="Got a crime we missed? Something broken? Want to collab? Email works best.">
      <Reveal className="glass contact-card">
        <span className="label">Write to us</span>
        <a className="contact-card__email shimmer-text" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <a className="btn btn--lg btn--block" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Hello ${APP_NAME}`)}`}>
          ✉️ Open my email app
        </a>
      </Reveal>
      <Card icon="🏢" title={`Business & partnerships · ${COMPANY_NAME}`} delay={0.03}>
        <p>
          {APP_NAME} is designed, developed and operated by <b>{COMPANY_NAME}</b>. For business enquiries,
          partnerships, media requests or legal matters, please contact {COMPANY_NAME} directly.
        </p>
        <a className="btn btn--ghost btn--block" href={`mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(`${APP_NAME} — business enquiry`)}`}>
          🏢 {COMPANY_EMAIL}
        </a>
      </Card>
      <Card icon="📮" title="Quick topics" delay={0.05}>
        <div style={{ display: "grid", gap: 8 }}>
          {TOPICS.map(([e, label, subject]) => (
            <a key={label} className="btn btn--ghost btn--block" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`} style={{ justifyContent: "flex-start" }}>
              <span aria-hidden="true">{e}</span> {label}
            </a>
          ))}
        </div>
      </Card>
      <Card icon="🔒" title="Privacy note" delay={0.1}>
        <p>We have no contact form on purpose — your message goes straight from your email app to ours, and nothing is stored on this website.</p>
      </Card>
    </ProsePage>
  );
}