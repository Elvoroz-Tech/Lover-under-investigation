/**
 * A "case" is never stored anywhere. Everything the certificate needs is packed
 * into a short, URL-safe code that lives in the share link itself:
 *
 *   /case/<code>      code = base64url( "1␟crimeId␟caseNo␟day␟to␟from" )
 *
 * Works identically in the browser and on the server (no Buffer dependency).
 */

import { getCrime, type Crime } from "./crimes";
import { safeName } from "./sanitize";

const VERSION = "1";
const SEP = "\u001f";
/** Hard cap so absurd URLs are rejected before any work is done. */
export const MAX_CODE_LENGTH = 220;

export interface CaseData {
  crimeId: string;
  /** 1000–9999, purely decorative. */
  caseNo: number;
  /** Issue date as whole days since the Unix epoch (UTC). */
  day: number;
  /** Optional nickname of the accused. */
  to: string;
  /** Optional alias of the person filing. Empty = anonymous. */
  from: string;
}

export interface ResolvedCase extends CaseData {
  crime: Crime;
}

/* ---------- base64url (UTF-8 safe, isomorphic) ---------- */

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string): string | null {
  if (!/^[A-Za-z0-9_-]+$/.test(code)) return null;
  try {
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((code.length + 3) % 4);
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/* ---------- public API ---------- */

export function todayDay(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export function randomCaseNo(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const a = new Uint16Array(1);
    crypto.getRandomValues(a);
    return 1000 + (a[0]! % 9000);
  }
  return 1000 + Math.floor(Math.random() * 9000);
}

export function encodeCase(data: CaseData): string {
  const to = safeName(data.to) ?? "";
  const from = safeName(data.from) ?? "";
  const parts = [VERSION, data.crimeId, String(data.caseNo), String(data.day), to, from];
  return toBase64Url(parts.join(SEP));
}

/** Strictly validates a code. Returns null for anything malformed or tampered. */
export function decodeCase(code: string | undefined | null): ResolvedCase | null {
  if (!code || code.length > MAX_CODE_LENGTH) return null;
  const raw = fromBase64Url(code);
  if (!raw) return null;

  const parts = raw.split(SEP);
  if (parts.length !== 6 || parts[0] !== VERSION) return null;
  const [, crimeId, caseNoStr, dayStr, toRaw, fromRaw] = parts as [string, string, string, string, string, string];

  const crime = getCrime(crimeId);
  if (!crime) return null;

  if (!/^\d{4}$/.test(caseNoStr)) return null;
  const caseNo = Number(caseNoStr);

  if (!/^\d{1,6}$/.test(dayStr)) return null;
  const day = Number(dayStr);
  // Between 2024-01-01 and a day after "now" (clock-skew tolerance).
  if (day < 19723 || day > todayDay() + 1) return null;

  const to = safeName(toRaw);
  const from = safeName(fromRaw);
  if (to === null || from === null) return null;

  return { crimeId, caseNo, day, to, from, crime };
}

export function formatCaseNumber(prefix: string, data: Pick<CaseData, "caseNo" | "day">): string {
  const year = new Date(data.day * 86_400_000).getUTCFullYear();
  return `${prefix}-${year}-${data.caseNo}`;
}

export function formatIssueDate(day: number): string {
  return new Date(day * 86_400_000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
