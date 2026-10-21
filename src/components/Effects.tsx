"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from "motion/react";

/** Global ambient motion: scroll progress bar, cursor glow, back-to-top with progress ring. */
export default function Effects() {
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const gx = useMotionValue(-500);
  const gy = useMotionValue(-500);
  const sx = useSpring(gx, { stiffness: 120, damping: 20 });
  const sy = useSpring(gy, { stiffness: 120, damping: 20 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gx.set(e.clientX);
      gy.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const unsub = scrollY.on("change", (v) => setShowTop(v > 700));
    return () => {
      window.removeEventListener("pointermove", onMove);
      unsub();
    };
  }, [gx, gy, scrollY]);

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
      <motion.div className="cursor-glow" style={{ x: sx, y: sy }} aria-hidden="true" />
      <AnimatePresence>
        {showTop && (
          <motion.button
            className="to-top"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.4, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 30 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <svg className="ring" viewBox="0 0 50 50" aria-hidden="true">
              <motion.circle cx="25" cy="25" r="23" fill="none" stroke="var(--tape)" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: progress }} />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
