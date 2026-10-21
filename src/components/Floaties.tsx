"use client";

import { motion } from "motion/react";

const ITEMS = [
  { e: "🚩", style: { top: "-4%", left: "-2%" }, d: 0 },
  { e: "💀", style: { top: "18%", right: "-4%" }, d: 0.6 },
  { e: "🕵️", style: { bottom: "14%", left: "-5%" }, d: 1.1 },
  { e: "🔎", style: { bottom: "-3%", right: "8%" }, d: 1.6 },
];

export default function Floaties() {
  return (
    <>
      {ITEMS.map((it, i) => (
        <motion.span
          key={i}
          className="floaty"
          style={it.style}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -14, 0], rotate: [0, i % 2 ? 12 : -12, 0] }}
          transition={{
            opacity: { delay: 1.6 + it.d * 0.3 },
            scale: { delay: 1.6 + it.d * 0.3, type: "spring", stiffness: 300, damping: 12 },
            y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: it.d },
            rotate: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: it.d },
          }}
        >
          {it.e}
        </motion.span>
      ))}
    </>
  );
}
