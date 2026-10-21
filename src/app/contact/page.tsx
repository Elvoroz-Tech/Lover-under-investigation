import type { Metadata } from "next";
import ProsePage, { Card } from "@/components/ProsePage";
import Reveal from "@/components/Reveal";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the team behind ${APP_NAME}.`,
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
