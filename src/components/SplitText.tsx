"use client";

import { motion } from "motion/react";

/**
 * Letter-by-letter springy entrance. Words never break mid-word.
 * Screen readers get the plain text via aria-label.
 */
export default function SplitText({
  text, className, delay = 0, stagger = 0.025, inView = false,
}: { text: string; className?: string; delay?: number; stagger?: number; inView?: boolean }) {
  let i = 0;
  const words = text.split(" ");
  const trigger = inView
    ? { whileInView: "show" as const, viewport: { once: true, margin: "-40px" } }
    : { animate: "show" as const };
  return (
    <motion.span className={className} aria-label={text} initial="hidden" {...trigger} style={{ display: "inline" }}>
      {words.map((w, wi) => (
        <span key={wi} className="split-word" aria-hidden="true">
          {Array.from(w).map((ch) => {
            const n = i++;
            return (
              <motion.span
                key={n}
                className="split-char"
                variants={{
                  hidden: { y: "0.9em", opacity: 0, rotate: 12 },
                  show: { y: 0, opacity: 1, rotate: 0, transition: { delay: delay + n * stagger, type: "spring", stiffness: 420, damping: 22 } },
                }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
