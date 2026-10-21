"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { ToastProvider } from "./Toast";

const RIPPLE_TARGETS = ".btn, .platform, .crime, .teaser, .filter, .dice";

/** Respects the OS "reduce motion" setting and adds a tap ripple to interactive elements. */
export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(RIPPLE_TARGETS);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.left = `${e.clientX - r.left}px`;
      dot.style.top = `${e.clientY - r.top}px`;
      el.appendChild(dot);
      setTimeout(() => dot.remove(), 650);
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>{children}</ToastProvider>
    </MotionConfig>
  );
}
