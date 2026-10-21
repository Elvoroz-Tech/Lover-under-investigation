"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ThemeToggle from "./ThemeToggle";
import { APP_INITIALS, APP_NAME, CONTACT_EMAIL, FOOTER_LINKS, NAV_LINKS } from "@/lib/config";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = hovered ?? pathname;

  return (
    <>
      <motion.header
        className="nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.1 }}
      >
        <nav className="nav__bar" aria-label="Main">
          <Link href="/" className="brand" aria-label={`${APP_NAME} — home`}>
            <span className="brand__mark" aria-hidden="true">{APP_INITIALS}</span>
            <span className="brand__name">{APP_NAME}</span>
          </Link>

          <div className="nav__links" onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav__link"
                aria-current={pathname === l.href ? "page" : undefined}
                onMouseEnter={() => setHovered(l.href)}
              >
                {active === l.href && (
                  <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav__right">
            <ThemeToggle />
            <Link href="/investigate" className="btn btn--sm nav__cta">
              Open a case <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <button
              className="burger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="burger__lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="menu"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 34px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 34px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 34px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="menu__list">
              {[{ href: "/", label: "Home" }, ...FOOTER_LINKS].map((l, i) => (
                <motion.li
                  key={l.href}
                  className="menu__item"
                  initial={{ opacity: 0, x: -40, rotate: -2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 260, damping: 22 }}
                >
                  <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
                    <span className="menu__num">0{i + 1}</span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.p className="menu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }}>
              No signup. No database. Just roasts. · {CONTACT_EMAIL}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
