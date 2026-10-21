import Link from "next/link";
import Hero from "@/components/Hero";
import CautionTape from "@/components/CautionTape";
import Reveal from "@/components/Reveal";
import WhatsAppMock from "@/components/WhatsAppMock";
import PrivacySeal from "@/components/PrivacySeal";
import SplitText from "@/components/SplitText";
import { CRIMES } from "@/lib/crimes";

const STEPS = [
  { emoji: "👆", title: "Pick their crime", text: `Tap one of ${CRIMES.length} ready-made accusations. No typing. No quiz.` },
  { emoji: "🏆", title: "Get the verdict", text: "An official-looking certificate is issued instantly — stamp and all." },
  { emoji: "📨", title: "Send the evidence", text: "One tap to WhatsApp, Insta, Snap or anywhere. They open it. Chaos." },
];

export default function HomePage() {
  return (
    <div className="page">
      <div className="container">
        <Hero />
      </div>

      <div style={{ marginTop: 56 }}>
        <CautionTape />
        <CautionTape alt items={["Reply faster", "Return the fries", "Stop saying hmm", "Text when you reach", "Guilty as charged"]} />
      </div>

      <section className="section container" aria-labelledby="how">
        <Reveal className="section__eyebrow">
          <span className="chip">01 — The process</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="how" className="section__title">
            <SplitText text="Tap. Roast." inView /> <SplitText className="serif" text="Share." inView delay={0.3} />
          </h2>
        </Reveal>
        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="glass step" x={i % 2 ? 30 : -30}>
              <span className="step__num" aria-hidden="true">0{i + 1}</span>
              <span className="step__emoji" aria-hidden="true">{s.emoji}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container" aria-labelledby="trick">
        <Reveal className="section__eyebrow">
          <span className="chip">02 — What they receive</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="trick" className="section__title">
            <SplitText text="Don’t explain the joke" inView stagger={0.018} />{" "}
            <SplitText className="serif" text="before the click." inView delay={0.4} stagger={0.02} />
          </h2>
        </Reveal>
        <Reveal delay={0.1} style={{ display: "grid", gap: 18 }}>
          <p style={{ margin: 0, color: "var(--muted)", maxWidth: "44ch" }}>
            The link preview never reveals the crime. They only see that a case was opened — curiosity does the rest.
          </p>
          <WhatsAppMock />
        </Reveal>
      </section>

      <section className="section container" aria-labelledby="why">
        <Reveal className="section__eyebrow">
          <span className="chip">03 — The fine print, but fun</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="why" className="section__title">
            <SplitText text="Ridiculously" inView /> <SplitText className="serif" text="simple." inView delay={0.3} />
          </h2>
        </Reveal>
        <div className="bento">
          <Reveal className="glass bento__card bento__card--tape" x={-30}>
            <div className="bento__big">0</div>
            <h3>accounts</h3>
            <p>No signup, no login, no email. Nothing to remember.</p>
          </Reveal>
          <Reveal delay={0.08} className="glass bento__card">
            <div className="bento__big">{CRIMES.length}</div>
            <h3>crimes on file</h3>
            <p>From “hmm” replies to fry theft. Tap one and you&apos;re done.</p>
          </Reveal>
          <Reveal delay={0.16} className="glass bento__card">
            <div className="bento__big">~5s</div>
            <h3>to a verdict</h3>
            <p>No forms, no editing screen, no waiting.</p>
          </Reveal>
          <Reveal delay={0.08} className="glass bento__card bento__card--wide">
            <PrivacySeal />
          </Reveal>
          <Reveal delay={0.16} className="glass bento__card">
            <div className="bento__big">🎭</div>
            <h3>anonymous by default</h3>
            <p>Your name only appears if you choose to sign it. Truly optional.</p>
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal className="glass counter-cta">
          <h2>Someone has to file the paperwork.</h2>
          <p>It might as well be you.</p>
          <Link href="/investigate" className="btn btn--lg btn--pink">
            Open a case <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
