import type { Metadata } from "next";
import ProsePage from "@/components/ProsePage";
import Reveal from "@/components/Reveal";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Rules",
  description: `The house rules of ${APP_NAME}: roast with love, keep it light.`,
  alternates: { canonical: "/rules" },
};

const RULES = [
  ["Roast with love.", "This is a joke between people who like each other. If it would genuinely hurt, don't send it."],
  ["Partners only (and besties, fine).", "Send it to someone who knows you. Not strangers, not exes you're trying to rattle, not your boss."],
  ["No harassment.", "Don't use it to bully, pressure, or repeatedly message someone who's asked you to stop."],
  ["Keep nicknames cute.", "Names show up on the certificate. Slurs and abusive words are blocked — please don't try to get around it."],
  ["Not a real investigation.", "Nothing here is a legal, official or factual claim. The ‘Bureau’ does not exist. Sadly."],
  ["Counter-cases are encouraged.", "Got roasted? Revenge is allowed and one tap away."],
  ["Over 13 only.", "This is relationship humour. If you're younger, come back in a few years."],
] as const;

export default function Rules() {
  return (
    <ProsePage eyebrow="House rules" title="The" accent="rules." lede="Short. Fair. Mostly about not being weird.">
      {RULES.map(([t, d], i) => (
        <Reveal key={t} className="glass rule" delay={i * 0.04} x={i % 2 ? 40 : -40} y={10}>
          <span className="rule__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h2>{t}</h2>
            <p>{d}</p>
          </div>
        </Reveal>
      ))}
    </ProsePage>
  );
}
