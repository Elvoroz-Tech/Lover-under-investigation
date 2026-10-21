import type { ReactNode } from "react";
import Reveal from "./Reveal";
import SplitText from "./SplitText";

export default function ProsePage({
  eyebrow, title, accent, lede, updated, children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lede?: ReactNode;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="page container prose-page">
      <header className="prose-page__head">
        <Reveal y={12}>
          <span className="chip">{eyebrow}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="prose-page__title">
            <SplitText text={title} delay={0.1} /> {accent && <SplitText className="serif" text={accent} delay={0.1 + title.length * 0.025} />}
          </h1>
        </Reveal>
        {lede && (
          <Reveal delay={0.1}>
            <p className="prose-page__lede">{lede}</p>
          </Reveal>
        )}
        {updated && (
          <Reveal delay={0.12}>
            <div className="prose-page__updated">Last updated · {updated}</div>
          </Reveal>
        )}
      </header>
      <div className="prose">{children}</div>
    </div>
  );
}

let cardCount = 0;

/** Content card that slides in from alternating sides. */
export function Card({ title, icon, children, delay = 0 }: { title: string; icon?: string; children: ReactNode; delay?: number }) {
  const fromLeft = cardCount++ % 2 === 0;
  return (
    <Reveal className="glass prose-card" delay={delay} x={fromLeft ? -40 : 40} y={16}>
      <h2>
        {icon && <span aria-hidden="true">{icon}</span>}
        {title}
      </h2>
      {children}
    </Reveal>
  );
}
