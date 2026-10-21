"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Certificate from "./Certificate";
import TiltCard from "./TiltCard";
import Floaties from "./Floaties";
import { CRIMES } from "@/lib/crimes";
import { todayDay, type ResolvedCase } from "@/lib/caseCode";

const SAMPLE: ResolvedCase = {
  crimeId: "bmn",
  crime: CRIMES.find((c) => c.id === "bmn")!,
  caseNo: 4720,
  day: todayDay(),
  to: "Delulu Bae",
  from: "",
};

const line = {
  hidden: { y: "110%", rotate: 4 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { delay: 0.25 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section className="hero">
      <div>
        <motion.div
          className="hero__kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <span className="chip">
            <span className="chip__dot" /> Case files open · no signup
          </span>
        </motion.div>

        <h1 className="hero__title">
          <span className="hero__line">
            <motion.span variants={line} initial="hidden" animate="show" custom={0}>
              Your partner
            </motion.span>
          </span>
          <span className="hero__line">
            <motion.span variants={line} initial="hidden" animate="show" custom={1}>
              has been <span className="serif">nominated</span>
            </motion.span>
          </span>
          <span className="hero__line">
            <motion.span variants={line} initial="hidden" animate="show" custom={2}>
              for <span className="hero__strike">something.
                <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
                  <motion.path
                    d="M2 12 C 40 4, 80 18, 120 8 S 180 14, 198 6"
                    fill="none"
                    stroke="#ffc94d"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.2, duration: 0.7, ease: "easeInOut" }}
                  />
                </svg>
              </span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          Unfortunately, it&apos;s <b>not an award</b>. Pick their crime, get an official-looking certificate,
          send the evidence. Takes about five seconds.
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <Link href="/investigate" className="btn btn--lg btn--block">
              🕵️ INVESTIGATE THEM <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <Link href="/how-it-works" className="btn btn--ghost btn--lg btn--block">
              How it works
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="hero__meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          <span className="chip">🔒 Stays on your device</span>
          <span className="chip">⚡ No login</span>
          <span className="chip">🎭 Anonymous by default</span>
        </motion.div>
      </div>

      <motion.div
        className="hero__stage"
        initial={{ opacity: 0, y: 60, rotate: 6, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 90, damping: 16 }}
      >
        <Floaties />
        <TiltCard>
          <Certificate data={SAMPLE} animated delay={0.8} />
        </TiltCard>
      </motion.div>
    </section>
  );
}
