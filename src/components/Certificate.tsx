"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import { APP_INITIALS, APP_NAME, BUREAU_NAME, SITE_URL } from "@/lib/config";
import { formatCaseNumber, formatIssueDate, type ResolvedCase } from "@/lib/caseCode";

const HOST = SITE_URL.replace(/^https?:\/\//, "");

interface Props {
  data: ResolvedCase;
  /** Play the stamp-slam + staggered ink entrance. */
  animated?: boolean;
  /** Fixed pixel width for image export (container units scale everything). */
  exportWidth?: number;
  /** Delay before the entrance starts (s). */
  delay?: number;
}

/**
 * The product. Sized entirely with container-query units (cqw), so the exact
 * same component renders crisply at 320px on a phone or 1080px for export.
 */
const Certificate = forwardRef<HTMLDivElement, Props>(function Certificate(
  { data, animated = false, exportWidth, delay = 0 },
  ref,
) {
  const { crime } = data;
  const caseNo = formatCaseNumber(APP_INITIALS, data);
  const accused = data.to || "The Accused";
  const filer = data.from || "Anonymous";

  const ink = (i: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 14, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay: delay + 0.15 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
        }
      : {};

  return (
    <div className="cert-wrap" style={exportWidth ? { width: exportWidth, maxWidth: "none" } : undefined}>
      <div
        ref={ref}
        className="cert"
        style={exportWidth ? { borderRadius: 0, boxShadow: "none" } : undefined}
        role="img"
        aria-label={`${APP_NAME} certificate: ${crime.award}, presented to ${accused}. Case status: ${crime.status}.`}
      >
        <motion.div className="cert__top" {...ink(0)}>
          <span>Case № {caseNo}</span>
          <span>Exhibit A</span>
        </motion.div>

        <motion.div className="cert__bureau" {...ink(1)}>
          {BUREAU_NAME}
        </motion.div>
        <motion.h2 className="cert__headline" {...ink(2)}>
          {APP_NAME}
        </motion.h2>

        <motion.div className="cert__rule" aria-hidden="true" {...ink(3)}>
          ✦
        </motion.div>

        <motion.div className="cert__presented" {...ink(4)}>
          Officially presented to
        </motion.div>
        <motion.div className="cert__to" {...ink(5)}>
          {accused}
        </motion.div>

        <motion.div {...ink(6)}>
          <span className="cert__award">{crime.award}</span>
        </motion.div>

        <motion.p className="cert__citation" {...ink(7)}>
          For outstanding achievement in <b>{crime.citation}</b>
        </motion.p>

        <motion.p className="cert__sentence" {...ink(8)}>
          <span>Sentence</span>
          {crime.sentence}
        </motion.p>

        <motion.div className="cert__flags" aria-label={`Red-flag level ${crime.severity} of 5`} {...ink(9)}>
          {"🚩".repeat(crime.severity)}
          <span style={{ opacity: 0.25 }}>{"🚩".repeat(5 - crime.severity)}</span>
        </motion.div>

        <motion.div className="cert__url" {...ink(10)}>
          Make one back ↗ {HOST}
        </motion.div>

        <motion.div className="cert__foot" {...ink(11)}>
          <div className="cert__sig">
            <b>{filer}</b>
            Filed by · {formatIssueDate(data.day)}
          </div>
        </motion.div>

        <motion.div
          className="stamp"
          initial={animated ? { opacity: 0, scale: 2.6, rotate: -30 } : false}
          animate={{ opacity: 1, scale: 1, rotate: -14 }}
          transition={{ delay: delay + 1.25, type: "spring", stiffness: 520, damping: 18, mass: 0.9 }}
        >
          <span className="stamp__label">Case status</span>
          <span className="stamp__status">{crime.status}</span>
        </motion.div>
      </div>
    </div>
  );
});

export default Certificate;
