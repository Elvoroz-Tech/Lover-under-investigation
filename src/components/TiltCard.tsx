"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { ReactNode, PointerEvent } from "react";

/** 3D tilt that follows the pointer (and idles with a gentle float on touch). */
export default function TiltCard({ children, max = 12 }: { children: ReactNode; max?: number }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 160, damping: 18 });
  const sy = useSpring(y, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);
  const glare = useTransform(
    [glareX, glareY] as never,
    ([gx, gy]: string[]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 45%)`,
  );

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", position: "relative" }}
      animate={{ y: [0, -10, 0] }}
      transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
    >
      {children}
      <motion.div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, borderRadius: 18, background: glare, mixBlendMode: "soft-light", pointerEvents: "none" }}
      />
    </motion.div>
  );
}
