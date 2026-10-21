"use client";

import { useEffect, useMemo, useState, type PointerEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CATEGORY_META, CRIMES, randomCrime, type Crime, type CrimeCategory } from "@/lib/crimes";
import { encodeCase, randomCaseNo, todayDay } from "@/lib/caseCode";
import { NAME_MAX, safeName } from "@/lib/sanitize";
import { addHistory, readHistory, type HistoryItem } from "@/lib/history";
import PrivacySeal from "@/components/PrivacySeal";
import { track } from "@/components/Analytics";

const SCAN_LINES = ["Collecting evidence…", "Checking the group chat…", "Consulting their ex… kidding", "Stamping the verdict…"];

type Filter = "all" | CrimeCategory;

function spotlight(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function InvestigateClient() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [signed, setSigned] = useState(false);
  const [scanning, setScanning] = useState<Crime | null>(null);
  const [scanLine, setScanLine] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => setHistory(readHistory()), []);

  const toOk = safeName(to) !== null;
  const fromOk = safeName(from) !== null;

  const list = useMemo(() => (filter === "all" ? CRIMES : CRIMES.filter((c) => c.category === filter)), [filter]);
  const categories = useMemo(
    () => (Object.keys(CATEGORY_META) as CrimeCategory[]).filter((k) => CRIMES.some((c) => c.category === k)),
    [],
  );

  useEffect(() => {
    if (!scanning) return;
    const id = setInterval(() => setScanLine((l) => Math.min(l + 1, SCAN_LINES.length - 1)), 380);
    return () => clearInterval(id);
  }, [scanning]);

  function file(crime: Crime) {
    if (!toOk || !fromOk) {
      setOpen(true);
      return;
    }
    const code = encodeCase({
      crimeId: crime.id,
      caseNo: randomCaseNo(),
      day: todayDay(),
      to: safeName(to) ?? "",
      from: signed ? safeName(from) ?? "" : "",
    });
    addHistory({ code, emoji: crime.emoji, label: crime.award, at: Date.now() });
    track("case_created", { category: crime.category });
    setScanLine(0);
    setScanning(crime);
    router.prefetch(`/case/${code}`);
    setTimeout(() => router.push(`/case/${code}?new=1`), 1500);
  }

  return (
    <>
      <div className="pick__head">
        <motion.span className="chip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="chip__dot" /> Step 1 of 1 · seriously
        </motion.span>
        <motion.h1
          className="pick__title"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          What did they{" "}
          <motion.span
            className="serif"
            style={{ display: "inline-block" }}
            animate={{ rotate: [0, -8, 8, -4, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.4 }}
          >
            do?
          </motion.span>
        </motion.h1>
        <motion.p className="pick__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Tap a crime. The certificate is issued instantly.
        </motion.p>
      </div>

      {/* Optional details — collapsed by default so the fast path stays one tap. */}
      <motion.div
        className="glass details"
        data-open={open}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <button className="details__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span>
            ✍️ Add names <small>· optional</small>
          </span>
          <span className="details__plus" aria-hidden="true">+</span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="details__body">
                <div className="field">
                  <label htmlFor="to">Their nickname</label>
                  <input
                    id="to"
                    value={to}
                    maxLength={NAME_MAX + 4}
                    placeholder="Delulu Bae, Mr. Hmm…"
                    autoComplete="off"
                    onChange={(e) => setTo(e.target.value)}
                  />
                  {!toOk ? (
                    <div className="field__error">Keep it cute 😇 — that one can&apos;t go on a certificate.</div>
                  ) : (
                    <div className="field__hint">Leave empty and they&apos;ll be “The Accused”.</div>
                  )}
                </div>

                <div className="switch">
                  <div className="switch__text">
                    <b>{signed ? "Signing it 🖊️" : "Anonymous 🎭"}</b>
                    <span>{signed ? "Your alias will appear on the certificate." : "Your name is not in the link at all."}</span>
                  </div>
                  <button
                    className="switch__btn"
                    role="switch"
                    aria-checked={signed}
                    aria-label="Sign the certificate with your alias"
                    onClick={() => setSigned((s) => !s)}
                  >
                    <motion.span className="switch__knob" layout transition={{ type: "spring", stiffness: 600, damping: 30 }} />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {signed && (
                    <motion.div
                      className="field"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <label htmlFor="from">Your alias</label>
                      <input
                        id="from"
                        value={from}
                        maxLength={NAME_MAX + 4}
                        placeholder="Your Honour, Detective Cutie…"
                        autoComplete="off"
                        onChange={(e) => setFrom(e.target.value)}
                      />
                      {!fromOk && <div className="field__error">Keep it cute 😇</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button
        className="dice"
        onClick={() => file(randomCrime())}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
      >
        <span>
          Surprise me
          <small>Let fate decide their crime</small>
        </span>
        <motion.span
          className="dice__cube"
          aria-hidden="true"
          animate={{ rotate: [0, 0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2 }}
        >
          🎲
        </motion.span>
      </motion.button>

      <div className="filters" role="toolbar" aria-label="Filter crimes by category">
        {(["all", ...categories] as Filter[]).map((f) => (
          <motion.button
            key={f}
            className="filter"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            whileTap={{ scale: 0.92 }}
          >
            {filter === f && (
              <motion.span layoutId="filter-bg" className="filter__bg" transition={{ type: "spring", stiffness: 500, damping: 34 }} />
            )}
            <span>{f === "all" ? "🔥 All" : `${CATEGORY_META[f].emoji} ${CATEGORY_META[f].label}`}</span>
          </motion.button>
        ))}
      </div>

      <motion.ul layout className="crimes" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <AnimatePresence mode="popLayout">
          {list.map((c, i) => (
            <motion.li
              key={c.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(i, 12) * 0.035, type: "spring", stiffness: 300, damping: 24 } }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)", transition: { duration: 0.18 } }}
            >
              <motion.button
                className="crime"
                onPointerMove={spotlight}
                onClick={() => file(c)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -3 }}
              >
                <span className="crime__emoji" aria-hidden="true">{c.emoji}</span>
                <span>
                  <span className="crime__label">{c.label}</span>
                  <span className="crime__meta">
                    <span>{CATEGORY_META[c.category].label}</span>·
                    <span className="flags" aria-label={`Severity ${c.severity} of 5`}>{"🚩".repeat(c.severity)}</span>
                  </span>
                </span>
                <span className="crime__go" aria-hidden="true">→</span>
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <div style={{ marginTop: 22 }}>
        <PrivacySeal compact />
      </div>

      {history.length > 0 && (
        <section className="history" aria-labelledby="hist">
          <div className="history__title">
            <span id="hist" className="label">Your recent cases · this device only</span>
            <Link href="/opt-out" className="label" style={{ color: "var(--tape)" }}>Clear</Link>
          </div>
          <div className="history__list">
            {history.map((h, i) => (
              <motion.div key={h.code} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}>
                <Link href={`/case/${h.code}?new=1`} className="history__item">
                  <span aria-hidden="true">{h.emoji}</span>
                  <span>{h.label}</span>
                  <em>{new Date(h.at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</em>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {scanning && (
          <motion.div className="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-live="polite">
            <motion.div className="scan__box" initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
              <div className="scan__ring" aria-hidden="true">{scanning.emoji}</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={scanLine}
                  className="scan__text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  {SCAN_LINES[scanLine]}
                </motion.div>
              </AnimatePresence>
              <div className="scan__bar">
                <motion.i initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.4, ease: "easeInOut" }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
