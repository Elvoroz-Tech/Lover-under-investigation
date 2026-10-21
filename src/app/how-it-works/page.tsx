import type { Metadata } from "next";
import Link from "next/link";
import ProsePage, { Card } from "@/components/ProsePage";
import { APP_NAME } from "@/lib/config";
import { CRIMES } from "@/lib/crimes";

export const metadata: Metadata = {
  title: "How it works",
  description: `How ${APP_NAME} works: pick a crime, get a certificate, send the link. No signup, no database.`,
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorks() {
  return (
    <ProsePage eyebrow="The process" title="How it" accent="works." lede="Three taps. Zero accounts. One very confused partner.">
      <Card icon="👆" title="1. Pick their crime">
        <p>Choose one of {CRIMES.length} ready-made accusations — from “replying after 3 business days” to stealing your fries. No typing, no quiz.</p>
        <p>Want it personal? Optionally add their nickname. Want credit? Optionally sign it with an alias. Both are off by default.</p>
      </Card>
      <Card icon="🏆" title="2. The verdict is issued" delay={0.05}>
        <p>Your browser instantly builds an official-looking certificate: award title, citation, sentence, red-flag level and a big case-status stamp.</p>
      </Card>
      <Card icon="📨" title="3. Send the evidence" delay={0.1}>
        <p>Hit <b>Send to Partner</b>. On phones this opens your share sheet with the certificate image <i>and</i> the link — WhatsApp, Instagram, Snapchat, Telegram, iMessage, anything. On desktop you get one-tap buttons for every major platform, plus image download and a 9:16 story version.</p>
      </Card>
      <Card icon="📂" title="4. They open the case" delay={0.15}>
        <p>The link preview only says a case was opened — never what the crime is. They tap, break the seal on the case file, and the certificate is revealed. Then they can file a counter-case against you in five seconds.</p>
      </Card>
      <Card icon="🧬" title="Under the hood" delay={0.2}>
        <p>Every case is packed into the link itself (a short encoded code containing the crime, a decorative case number, the date and any optional names). There is no database of cases. The certificate image is rendered on your device. Read the details on the <Link href="/privacy">Privacy</Link> page.</p>
      </Card>
      <div style={{ marginTop: 10 }}>
        <Link href="/investigate" className="btn btn--lg btn--block">🕵️ Try it now <span className="btn__arrow">→</span></Link>
      </div>
    </ProsePage>
  );
}
