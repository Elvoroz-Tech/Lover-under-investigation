"use client";

/**
 * Everything about sharing happens on the device:
 * images are rendered in the browser (html-to-image → canvas → PNG blob),
 * links are built locally, and platforms are opened with their public share intents.
 */

import { toBlob } from "html-to-image";

export const TEASERS = [
  { id: "drama", label: "💀 Dramatic", text: "Babe, someone has opened a case against you. 💀" },
  { id: "official", label: "🏛️ Official", text: "NOTICE: You are under investigation. Please review the evidence immediately." },
  { id: "chaos", label: "😭 Chaotic", text: "ur in SO much trouble 😭 open this before i change my mind" },
  { id: "soft", label: "🥹 Soft", text: "I made you something. Please don't be mad. 🥹" },
  { id: "desi", label: "🇮🇳 Desi", text: "Aapke khilaaf case file hua hai. Jaldi dekho 💀" },
] as const;

export type TeaserId = (typeof TEASERS)[number]["id"];

export function caseUrl(code: string): string {
  return `${window.location.origin}/case/${code}`;
}

export function shareText(teaser: string, url: string) {
  return `${teaser}\n\n${url}`;
}

export type Platform =
  | "whatsapp" | "instagram" | "snapchat" | "telegram" | "x" | "messenger"
  | "facebook" | "reddit" | "sms" | "email" | "threads" | "linkedin";

/** Public share intents. `null` = platform has no web intent → use native share / image. */
export function platformUrl(p: Platform, text: string, url: string): string | null {
  const t = encodeURIComponent(text);
  const u = encodeURIComponent(url);
  const both = encodeURIComponent(shareText(text, url));
  switch (p) {
    case "whatsapp": return `https://wa.me/?text=${both}`;
    case "telegram": return `https://t.me/share/url?url=${u}&text=${t}`;
    case "x": return `https://twitter.com/intent/tweet?text=${t}&url=${u}`;
    case "facebook": return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "reddit": return `https://www.reddit.com/submit?url=${u}&title=${t}`;
    case "threads": return `https://www.threads.net/intent/post?text=${both}`;
    case "linkedin": return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    case "messenger": return `fb-messenger://share/?link=${u}`;
    case "sms": return `sms:?&body=${both}`;
    case "email": return `mailto:?subject=${encodeURIComponent("You are under investigation 🕵️")}&body=${both}`;
    case "snapchat": return `https://www.snapchat.com/scan?attachmentUrl=${u}`;
    case "instagram": return null;
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Renders a DOM node to a PNG blob, entirely in the browser. */
export async function nodeToPng(node: HTMLElement, pixelRatio = 1): Promise<Blob | null> {
  if (typeof document !== "undefined" && "fonts" in document) {
    try { await document.fonts.ready; } catch { /* ignore */ }
  }
  const opts = { pixelRatio, cacheBust: false, backgroundColor: undefined as string | undefined };
  // First pass warms up font/image embedding (Safari needs it), second pass is clean.
  try { await toBlob(node, opts); } catch { /* warm-up only */ }
  return toBlob(node, opts);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function canShareFiles(file: File): boolean {
  try {
    return typeof navigator !== "undefined" && !!navigator.canShare && navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

/** Native share sheet. Returns "shared" | "cancelled" | "unsupported". */
export async function nativeShare(data: ShareData): Promise<"shared" | "cancelled" | "unsupported"> {
  if (typeof navigator === "undefined" || !navigator.share) return "unsupported";
  try {
    await navigator.share(data);
    return "shared";
  } catch (e) {
    if ((e as DOMException)?.name === "AbortError") return "cancelled";
    return "unsupported";
  }
}

export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}
