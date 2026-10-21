"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Certificate from "./Certificate";
import PlatformIcon, { PLATFORM_META } from "./PlatformIcon";
import { useToast } from "./Toast";
import { track } from "./Analytics";
import { APP_INITIALS, APP_NAME, SITE_URL } from "@/lib/config";
import { formatCaseNumber, type ResolvedCase } from "@/lib/caseCode";
import {
  TEASERS, canShareFiles, caseUrl, copyText, downloadBlob, isMobile, nativeShare, nodeToPng,
  platformUrl, shareText, type Platform, type TeaserId,
} from "@/lib/share";

const HOST = SITE_URL.replace(/^https?:\/\//, "");

interface Props {
  data: ResolvedCase;
  code: string;
  /** Recipient view: wording flips to "send one back". */
  recipient?: boolean;
  onAnother?: () => void;
}

type Sheet = null | "all" | "instagram" | "snapchat";

const GRID: Platform[] = ["whatsapp", "instagram", "snapchat", "telegram", "x", "messenger", "facebook", "reddit", "threads", "sms", "email", "linkedin"];

export default function ShareDock({ data, code, recipient = false, onAnother }: Props) {
  const toast = useToast();
  const postRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [teaser, setTeaser] = useState<TeaserId>(recipient ? "chaos" : "drama");
  const [post, setPost] = useState<File | null>(null);
  const [story, setStory] = useState<File | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [busy, setBusy] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [url, setUrl] = useState("");

  const caseNo = formatCaseNumber(APP_INITIALS, data);
  const text = TEASERS.find((t) => t.id === teaser)!.text;
  const fileBase = `${APP_NAME.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${caseNo}`;

  useEffect(() => {
    setMobile(isMobile());
    setUrl(caseUrl(code));
  }, [code]);

  // Pre-render both images in the background so sharing is instant and the
  // browser's "user gesture" isn't lost while we wait for a render.
  useEffect(() => {
    let alive = true;
    setPost(null);
    setStory(null);
    const t = setTimeout(async () => {
      try {
        if (postRef.current) {
          const b = await nodeToPng(postRef.current, 1);
          if (alive && b) setPost(new File([b], `${fileBase}.png`, { type: "image/png" }));
        }
        if (storyRef.current) {
          const b = await nodeToPng(storyRef.current, 1);
          if (alive && b) setStory(new File([b], `${fileBase}-story.png`, { type: "image/png" }));
        }
      } catch (e) {
        console.warn("Image render failed", e);
      }
    }, 600);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [code, fileBase]);

  const ensure = useCallback(
    async (kind: "post" | "story"): Promise<File | null> => {
      const ready = kind === "post" ? post : story;
      if (ready) return ready;
      const node = kind === "post" ? postRef.current : storyRef.current;
      if (!node) return null;
      const b = await nodeToPng(node, 1);
      if (!b) return null;
      const f = new File([b], `${fileBase}${kind === "story" ? "-story" : ""}.png`, { type: "image/png" });
      kind === "post" ? setPost(f) : setStory(f);
      return f;
    },
    [post, story, fileBase],
  );

  /* ---------------- actions ---------------- */

  async function sendPrimary() {
    track("share_primary", { recipient: recipient ? 1 : 0 });
    // Best path on phones: native sheet with the image + teaser + link.
    if (post && canShareFiles(post)) {
      const r = await nativeShare({ files: [post], text: shareText(text, url), title: APP_NAME });
      if (r === "shared") return toast("Evidence delivered. 🫡", "📨");
      if (r === "cancelled") return;
    }
    const r = await nativeShare({ text, url, title: APP_NAME });
    if (r === "shared") return toast("Evidence delivered. 🫡", "📨");
    if (r === "cancelled") return;
    setSheet("all");
  }

  async function onPlatform(p: Platform) {
    track("share_platform", { platform: p });
    if (p === "instagram" || p === "snapchat") {
      // No public web intent that carries an image → native sheet first, guided fallback second.
      const img = p === "instagram" ? story : post;
      if (mobile && img && canShareFiles(img)) {
        // Start both inside the same tap so the browser keeps the user gesture.
        void copyText(url);
        const r = await nativeShare({ files: [img] });
        if (r === "shared") return toast("Link copied too — paste it as a link sticker!", "🔗");
        if (r === "cancelled") return;
      }
      setSheet(p);
      return;
    }
    const href = platformUrl(p, text, url);
    if (!href) return;
    if (href.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href;
  }

  async function onCopy() {
    const ok = await copyText(shareText(text, url));
    toast(ok ? "Copied! Paste it anywhere 💅" : "Couldn't copy — long-press the link instead", ok ? "📋" : "⚠️");
    track("share_copy");
  }

  async function onDownload(kind: "post" | "story") {
    setBusy(true);
    try {
      const f = await ensure(kind);
      if (!f) throw new Error("render failed");
      downloadBlob(f, f.name);
      toast(kind === "story" ? "Story image saved 📲" : "Certificate saved 🖼️", "⬇️");
      track("download", { kind });
    } catch {
      toast("Couldn't render the image — try a screenshot 📸", "⚠️");
    } finally {
      setBusy(false);
    }
  }

  async function guidedInstagram(kind: "instagram" | "snapchat") {
    await onDownload(kind === "instagram" ? "story" : "post");
    await copyText(url);
    toast("Image saved + link copied 🔗", "✅");
  }

  /* ---------------- UI ---------------- */

  const tile = (key: Parameters<typeof PlatformIcon>[0]["p"], onClick: () => void, i: number) => (
    <motion.button
      key={key}
      className="platform"
      onClick={onClick}
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.05 * i, type: "spring", stiffness: 380, damping: 22 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.88 }}
    >
      <PlatformIcon p={key} />
      {PLATFORM_META[key].label}
    </motion.button>
  );

  return (
    <div className="dock">
      <motion.button
        className="btn btn--lg btn--block"
        onClick={sendPrimary}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ["0 10px 30px -10px rgba(255,225,77,.7)", "0 10px 50px -6px rgba(255,225,77,.95)", "0 10px 30px -10px rgba(255,225,77,.7)"] }}
        transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
      >
        📨 {recipient ? "Send it back" : "Send to Partner"} <span className="btn__arrow" aria-hidden="true">→</span>
      </motion.button>

      <div className="dock__row">
        {onAnother && (
          <motion.button className="btn btn--ghost btn--block" onClick={onAnother} whileTap={{ scale: 0.95 }}>
            🎲 New award
          </motion.button>
        )}
        <motion.button className="btn btn--ghost btn--block" onClick={onCopy} whileTap={{ scale: 0.95 }} style={onAnother ? undefined : { gridColumn: "1 / -1" }}>
          🔗 Copy link
        </motion.button>
      </div>

      <div className="label-row">
        <span className="label">Pick the vibe of your message</span>
      </div>
      <div className="teasers" role="radiogroup" aria-label="Message style">
        {TEASERS.map((t) => (
          <motion.button
            key={t.id}
            className="teaser"
            role="radio"
            aria-checked={teaser === t.id}
            aria-pressed={teaser === t.id}
            onClick={() => setTeaser(t.id)}
            whileTap={{ scale: 0.9 }}
          >
            {t.label}
          </motion.button>
        ))}
      </div>
      <div className="glass teaser-preview">
        <small>They&apos;ll receive</small>
        <AnimatePresence mode="wait">
          <motion.span
            key={teaser}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.22 }}
            style={{ display: "block" }}
          >
            {text} <span style={{ color: "var(--tape)" }}>{HOST}/case/…</span>
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="label-row">
        <span className="label">Or share directly</span>
        <span className="label">{post ? "🟢 image ready" : "⏳ rendering"}</span>
      </div>
      <div className="platforms">
        {GRID.slice(0, 6).map((p, i) => tile(p, () => onPlatform(p), i))}
        {tile("download", () => onDownload("post"), 6)}
        {tile("story", () => onDownload("story"), 7)}
        {tile("copy", onCopy, 8)}
        {tile("more", () => setSheet("all"), 9)}
      </div>

      {busy && <span className="sr-only">Rendering image…</span>}

      {/* Off-screen export renders (never animated, fixed pixel sizes). */}
      <div className="export-stage" aria-hidden="true">
        <Certificate ref={postRef} data={data} exportWidth={1080} />
        <div ref={storyRef} className="export-story">
          <div className="export-story__top">
            <span>🚨 Case closed</span>
          </div>
          <Certificate data={data} exportWidth={940} />
          <div className="export-story__bottom">
            Make one back 👀
            <small>{HOST}</small>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sheet && (
          <>
            <motion.div
              className="sheet-backdrop"
              onClick={() => setSheet(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Share options"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => info.offset.y > 120 && setSheet(null)}
            >
              <div className="sheet__grab" />
              {sheet === "all" ? (
                <>
                  <h3 className="sheet__title">Send the evidence</h3>
                  <p className="sheet__sub">Pick where it goes. The crime stays secret until they tap.</p>
                  <div className="platforms">
                    {GRID.map((p, i) => tile(p, () => onPlatform(p), i))}
                    {tile("download", () => onDownload("post"), 12)}
                    {tile("story", () => onDownload("story"), 13)}
                    {tile("copy", onCopy, 14)}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="sheet__title">{sheet === "instagram" ? "Post it to your Story 📸" : "Snap it 👻"}</h3>
                  <p className="sheet__sub">
                    {PLATFORM_META[sheet].label} doesn&apos;t allow websites to post for you, so it&apos;s 3 quick taps:
                  </p>
                  <ol className="sheet__steps">
                    <li>Save the {sheet === "instagram" ? "story-sized" : ""} image + copy the link (one button below).</li>
                    <li>Open {PLATFORM_META[sheet].label} and add the image to your {sheet === "instagram" ? "Story or DM" : "Snap or chat"}.</li>
                    <li>Add a <b>link sticker</b> and paste. Tag them. Wait. 💀</li>
                  </ol>
                  <button className="btn btn--block btn--pink" onClick={() => guidedInstagram(sheet)}>
                    ⬇️ Save image &amp; copy link
                  </button>
                  <button className="btn btn--block btn--ghost" onClick={() => setSheet(null)}>
                    Done
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
