import type { Platform } from "@/lib/share";

type Key = Platform | "copy" | "download" | "story" | "more";

export const PLATFORM_META: Record<Key, { label: string; bg: string }> = {
  whatsapp: { label: "WhatsApp", bg: "#25D366" },
  instagram: { label: "Instagram", bg: "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)" },
  snapchat: { label: "Snapchat", bg: "#FFFC00" },
  telegram: { label: "Telegram", bg: "#229ED9" },
  x: { label: "X", bg: "#000" },
  messenger: { label: "Messenger", bg: "linear-gradient(45deg,#0099FF,#A033FF,#FF5280)" },
  facebook: { label: "Facebook", bg: "#1877F2" },
  reddit: { label: "Reddit", bg: "#FF4500" },
  threads: { label: "Threads", bg: "#101010" },
  linkedin: { label: "LinkedIn", bg: "#0A66C2" },
  sms: { label: "Messages", bg: "#34C759" },
  email: { label: "Email", bg: "#6b6680" },
  copy: { label: "Copy link", bg: "#8f0a1f" },
  download: { label: "Save image", bg: "#e0142f" },
  story: { label: "Story size", bg: "linear-gradient(180deg,#8f0a1f,#ff2b44)" },
  more: { label: "More", bg: "#2a2638" },
};

const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function PlatformIcon({ p }: { p: Key }) {
  const color = p === "snapchat" ? "#000" : "#fff";
  return (
    <span className="platform__icon" style={{ background: PLATFORM_META[p].bg, color }} aria-hidden="true">
      {icon(p)}
    </span>
  );
}

function icon(p: Key) {
  switch (p) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
          <path d="M9 9.5c.3 2 2.2 4.2 4.5 5l1.3-1.2 2 1-.5 1.5c-3.5.4-8-3.7-8-7.3L9.6 8l1 2z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "snapchat":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <path d="M12 3c3 0 5 2.2 5 5v3l2 .5-1.5 1.5c.5 1.5 2 2.5 3 2.8-1 .8-2.4.7-3 1.2l-.5 1.5c-1.5-.4-3 .5-5 2-2-1.5-3.5-2.4-5-2l-.5-1.5c-.6-.5-2-.4-3-1.2 1-.3 2.5-1.3 3-2.8L5 11.5 7 11V8c0-2.8 2-5 5-5z" />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <path d="M21 4L3 11l6 2 2 6 3-4 5 4z" />
          <path d="M9 13l12-9" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" {...S} strokeWidth={2.2}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      );
    case "messenger":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <path d="M12 3C7 3 3 6.7 3 11.3c0 2.6 1.3 4.9 3.3 6.4V21l3-1.7c.9.3 1.8.4 2.7.4 5 0 9-3.7 9-8.3S17 3 12 3z" />
          <path d="M7 13.5l3-3 2.5 2 4-3.5-3 3.5-2.5-2z" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" {...S} strokeWidth={2.4}>
          <path d="M14.5 21v-8h3l.5-3.5h-3.5V7.8c0-1 .4-1.8 1.8-1.8H18V3.2A20 20 0 0 0 15.6 3c-2.6 0-4.1 1.5-4.1 4.2v2.3H8.5V13h3v8" />
        </svg>
      );
    case "reddit":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <ellipse cx="12" cy="14" rx="7.5" ry="5.5" />
          <circle cx="9" cy="13.5" r="1" fill="currentColor" />
          <circle cx="15" cy="13.5" r="1" fill="currentColor" />
          <path d="M9.5 16.5c1.5 1 3.5 1 5 0M12 8.5l1-4.5 3.5 1" />
          <circle cx="18" cy="5" r="1.4" />
        </svg>
      );
    case "threads":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <path d="M16.5 11.5c-.6-3-4.6-3.6-6-1.2-1.1 1.9.4 4 2.6 3.8 2.6-.2 3.4-3 3.1-5.4C15.7 5 13.6 3.5 11.5 3.5 7 3.5 4.5 7 4.5 12s2.5 8.5 7.5 8.5c3.5 0 6.5-2 7-5" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <path d="M6 10v8M6 6.5v.1M10.5 18v-8M10.5 13.5c0-2 1.3-3.5 3-3.5s3 1 3 3.3V18" />
        </svg>
      );
    case "sms":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <path d="M4 5h16v11H9l-5 4z" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "copy":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
          <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
      );
    case "download":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
        </svg>
      );
    case "story":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
          <path d="M10 6h4" />
          <circle cx="12" cy="13" r="2.5" />
        </svg>
      );
    case "more":
      return (
        <svg viewBox="0 0 24 24" {...S}>
          <circle cx="6" cy="12" r="1.2" fill="currentColor" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          <circle cx="18" cy="12" r="1.2" fill="currentColor" />
        </svg>
      );
  }
}
