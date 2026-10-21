import type { Metadata } from "next";
import Link from "next/link";
import ProsePage, { Card } from "@/components/ProsePage";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for ${APP_NAME}.`,
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <ProsePage eyebrow="Terms of use" title="The" accent="terms." lede="Plain-English terms. Using the site means you agree to them." updated="21 Oct 2026">
      <Card icon="🎭" title="It's a joke">
        <p>{APP_NAME} creates humorous, fictional “certificates”. They are not legal, official, medical, or factual statements about anyone. The “Bureau” and every case are made up.</p>
      </Card>
      <Card icon="🤝" title="Use it kindly" delay={0.04}>
        <p>You agree not to use the site to harass, threaten, bully, or impersonate anyone, or to send cases to people who don&apos;t want them. See the <Link href="/rules">Rules</Link>.</p>
      </Card>
      <Card icon="✍️" title="Your content" delay={0.08}>
        <p>The only things you can type are an optional nickname and an optional alias. You are responsible for them. Abusive words are filtered, but filters aren&apos;t perfect — don&apos;t try to bypass them.</p>
      </Card>
      <Card icon="🔞" title="Age" delay={0.12}>
        <p>You must be at least 13 years old (or the minimum age of digital consent where you live) to use the site.</p>
      </Card>
      <Card icon="🛡️" title="Fair use & limits" delay={0.16}>
        <p>We rate-limit requests to keep the site fast and to prevent automated abuse. Scraping, flooding, or trying to break the service isn&apos;t allowed.</p>
      </Card>
      <Card icon="⚖️" title="No warranty" delay={0.2}>
        <p>The site is provided “as is”, free of charge, without warranties. We aren&apos;t liable for how a roast is received, relationship arguments about fries, or anything else arising from use of the site, to the extent permitted by law.</p>
      </Card>
      <Card icon="🔁" title="Changes" delay={0.24}>
        <p>We may update these terms; the date above will change when we do. Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </Card>
    </ProsePage>
  );
}
