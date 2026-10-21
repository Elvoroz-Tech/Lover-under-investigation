"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Theme = "dark" | "light";
const KEY = "lui.theme";

function apply(t: Theme) {
  document.documentElement.dataset.theme = t;
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", t === "light" ? "#fff5f4" : "#080405");
  try { localStorage.setItem(KEY, t); } catch { /* storage blocked */ }
}

/**
 * Dark / light switch. Uses the View Transitions API for a circular
 * "ink spill" reveal from the button; falls back to a colour cross-fade.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

    if (!reduce && doc.startViewTransition) {
      const x = e.clientX || window.innerWidth - 40;
      const y = e.clientY || 34;
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = doc.startViewTransition(() => { apply(next); setTheme(next); });
      vt.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
          );
        })
        .catch(() => {});
      return;
    }
    const html = document.documentElement;
    if (!reduce) html.classList.add("theme-anim");
    apply(next);
    setTheme(next);
    setTimeout(() => html.classList.remove("theme-anim"), 600);
  }

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggle}
      whileTap={{ scale: 0.85, rotate: -20 }}
      whileHover={{ scale: 1.06 }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.svg
            key="moon"
            viewBox="0 0 24 24" fill="currentColor"
            initial={{ y: 22, rotate: -90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -22, rotate: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
            initial={{ y: 22, rotate: 90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -22, rotate: -90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
