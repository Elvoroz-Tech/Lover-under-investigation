/**
 * Optional nicknames are the ONLY free text in the product.
 * They are cleaned the same way on the device (before encoding) and on the
 * server (when a link is decoded), so a hand-crafted link can't smuggle anything in.
 *
 * Abuse filter (English + Hinglish + Hindi/Devanagari), see `blocklist.ts`:
 *  1. Unicode NFKD, accents removed, lower-cased.
 *  2. Look-alike letters folded (Cyrillic/Greek "а", "о", "с", fullwidth, etc.).
 *  3. Leetspeak undone (0→o, 1→i, 3→e, 4/@→a, 5/$→s, 7/+→t, 8→b, 9→g, ph→f, vv→w).
 *  4. Devanagari normalised (nukta removed, chandrabindu→anusvara, long ई/ऊ matras → short).
 *  5. Checked three ways: substrings on the squashed text (separators removed, so
 *     "f.u.c.k" and "b h e n c h o d" are caught), the same with repeated letters
 *     collapsed ("fuuuuck"), and whole words for short/ambiguous terms.
 *  6. Links, @handles and phone numbers are rejected (anti-spam / anti-doxxing).
 */

import { ALLOW, SUBSTRING, WORD } from "./blocklist";

export const NAME_MAX = 20;

/* ---------------- normalisation ---------------- */

const HOMOGLYPHS: Record<string, string> = {
  // Cyrillic
  а: "a", в: "b", е: "e", ё: "e", к: "k", м: "m", н: "h", о: "o", р: "p", с: "c", т: "t", у: "y",
  х: "x", і: "i", ї: "i", ј: "j", ѕ: "s", ԁ: "d", ӏ: "l", ц: "u", п: "n", г: "r", ь: "b",
  // Greek
  α: "a", β: "b", ε: "e", η: "n", ι: "i", κ: "k", ν: "v", ο: "o", ρ: "p", τ: "t", υ: "u", χ: "x", μ: "u",
  // misc
  ß: "ss", æ: "ae", œ: "oe", ø: "o", đ: "d", ł: "l", ı: "i", ſ: "s",
};

const LEET: Record<string, string> = {
  "0": "o", "1": "i", "!": "i", "|": "i", "3": "e", "4": "a", "@": "a", "5": "s", "$": "s",
  "7": "t", "+": "t", "8": "b", "9": "g", "6": "g", "2": "z", "€": "e", "£": "l", "¢": "c",
};

function baseNormalize(s: string): string {
  let t = s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
  t = Array.from(t, (ch) => HOMOGLYPHS[ch] ?? LEET[ch] ?? ch).join("");
  t = t.replace(/ph/g, "f").replace(/vv/g, "w");
  // Devanagari: nukta off, chandrabindu → anusvara, long vowels → short
  t = t
    .replace(/़/g, "")
    .replace(/ँ/g, "ं")
    .replace(/ी/g, "ि")
    .replace(/ू/g, "ु");
  return t;
}

/** Only letters (Latin + Devanagari) kept — separators, dots, spaces, emoji removed. */
function squash(t: string): string {
  return t.replace(/[^a-zऀ-ॿ]/g, "");
}

function collapseRepeats(t: string): string {
  return t.replace(/(.)\1+/gu, "$1");
}

function stripAllowed(t: string): string {
  let out = t;
  for (const a of ALLOW_N) out = out.split(a).join("·");
  return out;
}

/* Pre-normalise the lists once with the exact same pipeline. */
const SUB_N = Array.from(new Set(SUBSTRING.map((w) => squash(baseNormalize(w))).filter(Boolean)));
const SUB_COLLAPSED = Array.from(
  // Terms without doubled letters always qualify ("fuck" catches "fuuuck"); collapsed terms that
  // shrank are only kept when still ≥ 5 letters, to avoid false hits ("boob" → "bob").
  new Set(SUB_N.map((w) => [w, collapseRepeats(w)] as const).filter(([w, c]) => c === w || c.length >= 5).map(([, c]) => c)),
);
const WORD_N = new Set(WORD.map((w) => squash(baseNormalize(w))).filter(Boolean));
const ALLOW_N = ALLOW.map((w) => squash(baseNormalize(w))).filter(Boolean).sort((a, b) => b.length - a.length);

const LINK_RE = /(https?:|www\.|\w\.(com|in|net|org|xyz|io|me|co|app|link|ly|gg|tk|ru|info|site|online|shop|store)\b|t\.me|wa\.me|bit\.ly)/i;
const HANDLE_RE = /@[a-z0-9_.]{3,}/i;
const PHONE_RE = /(\d[\s\-.]?){7,}/;

/* ---------------- public API ---------------- */

/** Normalises + strips anything risky. Returns "" for empty input. */
export function cleanName(input: unknown): string {
  if (typeof input !== "string") return "";
  let s = input.normalize("NFKC");
  // control chars, zero-width & bidi overrides, variation selectors, markup-ish characters
  s = s.replace(/[\u0000-\u001F\u007F-\u009F­​-‏‪-‮⁠-⁩﻿]/g, "");
  s = s.replace(/[<>{}[\]\\`"'/=;]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  // Cap by code points so emoji aren't cut in half
  const cps = Array.from(s);
  if (cps.length > NAME_MAX) s = cps.slice(0, NAME_MAX).join("").trim();
  return s;
}

export function isNameAllowed(name: string): boolean {
  if (!name) return true;

  // Spam / doxxing: links, @handles, phone numbers (checked on the raw text).
  if (LINK_RE.test(name) || HANDLE_RE.test(name) || PHONE_RE.test(name)) return false;

  const norm = baseNormalize(name);

  // Whole-word checks for short / ambiguous terms.
  const words = norm.split(/[^a-zऀ-ॿ]+/).filter(Boolean);
  for (const w of words) {
    const variants = [w, collapseRepeats(w), w.replace(/s$/, ""), w.replace(/es$/, "")];
    if (variants.some((v) => WORD_N.has(v))) return false;
  }
  // Spaced-out short words: "b s d k", "g a n d".
  const whole = squash(norm);
  if (WORD_N.has(whole) || WORD_N.has(collapseRepeats(whole))) return false;

  // Substring checks (allowlisted names removed first).
  const sq = stripAllowed(whole);
  if (SUB_N.some((t) => sq.includes(t))) return false;
  const sqc = stripAllowed(collapseRepeats(whole));
  if (SUB_COLLAPSED.some((t) => sqc.includes(t))) return false;

  return true;
}

/** Clean + validate. Returns null when the text is not allowed. */
export function safeName(input: unknown): string | null {
  const c = cleanName(input);
  return isNameAllowed(c) ? c : null;
}
