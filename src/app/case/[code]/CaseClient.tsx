"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Certificate from "@/components/Certificate";
import ShareDock from "@/components/ShareDock";
import PrivacySeal from "@/components/PrivacySeal";
import { APP_INITIALS } from "@/lib/config";
import { encodeCase, formatCaseNumber, randomCaseNo, todayDay, type ResolvedCase } from "@/lib/caseCode";
import { randomCrime } from "@/lib/crimes";
import { addHistory } from "@/lib/history";
import { track } from "@/components/Analytics";

async function boom(delayMs: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#ff2b44", "#ffc94d", "#8f0a1f", "#ff8a9a", "#ffffff"];
  setTimeout(() => {
    confetti({ particleCount: 90, spread: 75, startVelocity: 42, origin: { y: 0.55 }, colors, scalar: 0.9 });
    setTimeout(() => {
      confetti({ particleCount: 40, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors });
      confetti({ particleCount: 40, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors });
    }, 250);
    try { navigator.vibrate?.([30, 40, 60]); } catch { /* ignore */ }
  }, delayMs);
}

export default function CaseClient({ data, code, fresh }: { data: ResolvedCase; code: string; fresh: boolean }) {
  const router = useRouter();
  // Sender (fresh) sees the verdict immediately; recipients get the sealed envelope first.
  const [mode] = useState<"sender" | "recipient">(fresh ? "sender" : "recipient");
  const [opened, setOpened] = useState(fresh);
  const caseNo = formatCaseNumber(APP_INITIALS, data);

  useEffect(() => {
    // Strip ?new=1 so a copied address-bar URL still gives the partner the envelope reveal.
    if (fresh) window.history.replaceState(null, "", `/case/${code}`);
    if (fresh) boom(1500);
  }, [fresh, code]);

  function openEnvelope() {
    setOpened(true);
    track("case_opened");
    boom(1700);
  }

  function another() {
    const crime = randomCrime(data.crimeId);
    const next = encodeCase({ crimeId: crime.id, caseNo: randomCaseNo(), day: todayDay(), to: data.to, from: data.from });
    addHistory({ code: next, emoji: crime.emoji, label: crime.award, at: Date.now() });
    track("case_another");
    router.replace(`/case/${next}?new=1`, { scroll: false });
  }

  return (
    <AnimatePresence mode="wait">
      {!opened ? (
        <motion.section
          key="env"
          className="envelope-stage"
          exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <motion.span className="chip" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="chip__dot" style={{ background: "var(--pink)" }} /> Incoming case file
            </motion.span>
            <motion.h1
              className="pick__title"
              style={{ margin: "14px 0 26px", fontSize: "clamp(32px, 10vw, 56px)" }}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              {data.to ? `${data.to}, a` : "A"} case has been <span className="serif">opened</span> against you.
            </motion.h1>

            <motion.button
              className="envelope"
              onClick={openEnvelope}
              aria-label="Open the case file"
              initial={{ opacity: 0, y: 60, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: [-2, 2, -2] }}
              transition={{
                opacity: { delay: 0.3 },
                y: { delay: 0.3, type: "spring", stiffness: 120, damping: 14 },
                rotate: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              style={{ margin: "0 auto", display: "block" }}
            >
              <span className="envelope__flap" />
              <motion.span
                className="envelope__seal"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                🔒
              </motion.span>
              <span className="envelope__label">
                Confidential · Case № {caseNo}
                <b>Filed against: {data.to || "YOU"}</b>
              </span>
            </motion.button>

            <motion.p
              className="envelope-hint"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              👆 Tap to open the evidence
            </motion.p>
          </div>
        </motion.section>
      ) : (
        <motion.section key={`res-${code}`} className="case case--result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="case__intro">
            <motion.span className="chip" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              {mode === "sender" ? "⚖️ Verdict issued" : "⚖️ The court has spoken"}
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.1 }}>
              {mode === "sender" ? (
                <>
                  Guilty. <span className="serif" style={{ color: "var(--tape)" }}>Obviously.</span>
                </>
              ) : (
                <>
                  You&apos;ve been <span className="serif" style={{ color: "var(--pink)" }}>exposed.</span>
                </>
              )}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              {mode === "sender" ? "Now send the evidence before they delete the chat." : "Think this is unfair? File a counter-case."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: mode === "recipient" ? 140 : 40, rotate: mode === "recipient" ? 8 : -4, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.15 }}
          >
            <Certificate data={data} animated delay={0.25} />
          </motion.div>

          <motion.div
            className="case__dock-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mode === "sender" ? 0.6 : 2, type: "spring", stiffness: 160, damping: 20 }}
            style={{ display: "grid", gap: 18 }}
          >
            {mode === "recipient" && (
              <div className="glass counter-cta">
                <h2>Revenge is a dish best served with a certificate.</h2>
                <p>Make one for them. No signup, takes 5 seconds.</p>
                <Link href="/investigate" className="btn btn--lg btn--pink btn--block">
                  ⚖️ File a counter-case <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            )}
            <ShareDock data={data} code={code} recipient={mode === "recipient"} onAnother={mode === "sender" ? another : undefined} />
            <PrivacySeal compact />
            {mode === "sender" && (
              <Link href="/investigate" className="btn btn--ghost btn--block">
                ← Pick a different crime
              </Link>
            )}
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
