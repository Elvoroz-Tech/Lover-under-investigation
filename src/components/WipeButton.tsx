"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { wipeDevice } from "@/lib/history";
import { useToast } from "./Toast";

export default function WipeButton() {
  const toast = useToast();
  const [done, setDone] = useState(false);
  return (
    <motion.button
      className={`btn btn--lg btn--block ${done ? "btn--ghost" : "btn--pink"}`}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        const n = wipeDevice();
        setDone(true);
        toast(n > 0 ? "Wiped. This device has no case history now." : "Already clean — nothing was stored.", "🧽");
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span key={String(done)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {done ? "✅ Device wiped" : "🧽 Wipe this device"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
