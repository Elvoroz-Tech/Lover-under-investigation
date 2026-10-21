"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function NotFoundView({ title, text }: { title: string; text: string }) {
  return (
    <section className="lost">
      <div>
        <motion.div
          className="lost__code"
          initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: [0, -3, 3, 0] }}
          transition={{ type: "spring", stiffness: 160, damping: 12, rotate: { duration: 3, repeat: Infinity } }}
        >
          404
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {title}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          {text}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} whileTap={{ scale: 0.95 }}>
          <Link href="/investigate" className="btn btn--lg">
            🕵️ Open a new case <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
