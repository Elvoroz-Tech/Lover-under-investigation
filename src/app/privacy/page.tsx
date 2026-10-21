import type { Metadata } from "next";
import Link from "next/link";
import ProsePage, { Card } from "@/components/ProsePage";
import PrivacySeal from "@/components/PrivacySeal";
import Reveal from "@/components/Reveal";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy",
  description: `${APP_NAME} is zero-storage by design: no accounts, no database of cases, certificates generated on your device.`,
  alternates: { canonical: "/privacy" },
};

const gaOn = !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const dbOn = !!process.env.MONGODB_URI?.trim();

export default function Privacy() {
  return (
    <ProsePage
      eyebrow="Privacy"
      title="Your data stays"
      accent="yours."
      lede="We built this so there is nothing to leak. Here is exactly what happens — no fine-print tricks."
      updated="21 Oct 2026"
    >
      <Reveal>
        <PrivacySeal />
      </Reveal>

      <Card icon="📦" title="What we store: nothing about you">
        <ul>
          <li>No accounts, logins, emails or phone numbers. Ever.</li>
          <li>No database of cases, certificates, nicknames or messages.</li>
          <li>No advertising trackers, no data selling, no profiling.</li>
        </ul>
      </Card>

      <Card icon="🔗" title="Where a case lives: inside the link" delay={0.04}>
        <p>When you pick a crime, your browser encodes the case — crime id, a random decorative case number, the date, and any <i>optional</i> nickname or alias you typed — into the link itself. That&apos;s why there&apos;s nothing to store: whoever has the link has the case, and nobody else does.</p>
        <p><b>Honest note:</b> the link is encoded, not encrypted. Anyone you share it with (or who sees it) can read what&apos;s on the certificate. Only type names you&apos;re happy to be on it.</p>
      </Card>

      <Card icon="📱" title="Generated on your device" delay={0.08}>
        <p>The certificate and the downloadable images are rendered in your browser. Images are never uploaded. Sharing uses your device&apos;s own share sheet or the platform&apos;s public share link.</p>
      </Card>

      <Card icon="🎭" title="Anonymous by default" delay={0.12}>
        <p>Your name is not in the link unless you switch on “sign it” and type an alias. If you don&apos;t, the certificate says “Anonymous” — and there is genuinely nothing else in the link that identifies you.</p>
      </Card>

      <Card icon="🛰️" title="What our server does see" delay={0.16}>
        <ul>
          <li>Like every website, our server receives the page address you request (which includes the case link) so it can show the page and build the teaser preview card. It does not save it.</li>
          <li>To stop abuse we count requests per IP address. The IP is <b>one-way hashed with a secret salt</b> first, and counters expire within minutes.{dbOn ? " These short-lived hashed counters are kept in our rate-limit database; they contain no case data." : " These counters live only in server memory."}</li>
          <li>Our hosting provider may keep standard, short-lived server logs for security and reliability.</li>
        </ul>
      </Card>

      <Card icon="📊" title="Analytics" delay={0.2}>
        {gaOn ? (
          <p>We use Google Analytics to count anonymous visits (which pages are popular, which share buttons get used). Case links are <b>redacted before anything is sent</b> — Google only ever sees <code>/case/[redacted]</code>, never the crime, nickname or alias. Google signals and ad personalisation are disabled.</p>
        ) : (
          <p>No analytics are running on this site right now.</p>
        )}
      </Card>

      <Card icon="💾" title="On your device" delay={0.24}>
        <p>“Your recent cases” is stored only in your browser&apos;s local storage so you can find them again. It never leaves your device. Wipe it any time on the <Link href="/opt-out">Opt-out</Link> page.</p>
      </Card>

      <Card icon="✉️" title="Questions" delay={0.28}>
        <p>Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Because we store no case data, we can&apos;t look up, edit or delete a case — but you can simply stop sharing the link.</p>
      </Card>
    </ProsePage>
  );
}
