import type { Metadata } from "next";
import ProsePage, { Card } from "@/components/ProsePage";
import WipeButton from "@/components/WipeButton";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Opt out",
  description: `How to opt out of ${APP_NAME} and wipe everything from your device.`,
  alternates: { canonical: "/opt-out" },
};

export default function OptOut() {
  return (
    <ProsePage eyebrow="Opt out" title="Want" accent="out?" lede="Easy. There's almost nothing to opt out of — but here's every switch we have.">
      <Card icon="🧽" title="Wipe this device">
        <p>Removes your “recent cases” list and anything else this site saved in this browser. One tap, instant, no account needed.</p>
        <div style={{ marginTop: 14 }}>
          <WipeButton />
        </div>
      </Card>
      <Card icon="🗄️" title="Delete my data from your servers" delay={0.05}>
        <p>There&apos;s nothing to delete. We never store cases, names, or messages, and rate-limit counters are anonymous hashes that expire within minutes.</p>
      </Card>
      <Card icon="🔗" title="A case about me is out there" delay={0.1}>
        <p>Cases only exist inside their link, so we can&apos;t “take one down” — but they also only reach people the sender shared them with. If someone is using {APP_NAME} to harass you, email <a href={`mailto:${CONTACT_EMAIL}?subject=Abuse%20report`}>{CONTACT_EMAIL}</a> with the link and we&apos;ll block it from rendering.</p>
      </Card>
      <Card icon="📊" title="Analytics" delay={0.15}>
        <p>If analytics are enabled (see Privacy), they never receive case contents. You can also block them with any standard content blocker or your browser&apos;s tracking protection — the site works exactly the same.</p>
      </Card>
    </ProsePage>
  );
}
