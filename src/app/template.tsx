"use client";

import { motion } from "motion/react";

/** Runs on every navigation: a red curtain lifts while the page blurs in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        className="curtain"
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        // Clear transform/filter afterwards so position:fixed children (sheets, overlays) still pin to the viewport.
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none", transform: "none" } }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
