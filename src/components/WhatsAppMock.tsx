"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "@/lib/config";

const HOST = SITE_URL.replace(/^https?:\/\//, "");

/** Animated "this is what your partner receives" preview. Loops while visible. */
export default function WhatsAppMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [phase, setPhase] = useState(0); // 0 typing, 1 message, 2 reply-typing, 3 reply

  useEffect(() => {
    if (!inView) return;
    const steps = [1400, 2200, 1400, 3200];
    const t = setTimeout(() => setPhase((p) => (p + 1) % 4), steps[phase]);
    return () => clearTimeout(t);
  }, [phase, inView]);

  return (
    <div className="wa" ref={ref}>
      <div className="wa__head">
        <div className="wa__avatar" aria-hidden="true">🥺</div>
        <div>
          <div className="wa__name">delulu bae 💕</div>
          <div className="wa__status">{phase === 2 ? "typing…" : "online"}</div>
        </div>
      </div>
      <div className="wa__body" aria-live="off">
        <AnimatePresence mode="popLayout">
          {phase === 0 && (
            <motion.div key="t1" className="wa__typing" style={{ justifySelf: "end" }} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
              <i /><i /><i />
            </motion.div>
          )}
          {phase >= 1 && (
            <motion.div
              key="msg"
              className="wa__bubble"
              layout
              initial={{ opacity: 0, y: 20, scale: 0.8, originX: 1, originY: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            >
              <div className="wa__card">
                <div className="wa__card-img"><span>🚨 CASE FILE · CLASSIFIED</span></div>
                <div className="wa__card-meta">You are under investigation 🕵️ · {HOST}</div>
              </div>
              Babe, someone has opened a case against you. 💀
              <br />
              <span className="wa__link">{HOST}/case/…</span>
              <span className="wa__time">11:47 ✓✓</span>
            </motion.div>
          )}
          {phase === 2 && (
            <motion.div key="t2" className="wa__typing" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
              <i /><i /><i />
            </motion.div>
          )}
          {phase === 3 && (
            <motion.div
              key="reply"
              className="wa__bubble"
              style={{ justifySelf: "start", background: "#202c33", borderRadius: "12px 12px 12px 4px" }}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            >
              WHAT CASE?? what did i do 😭😭
              <span className="wa__time">11:47</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
