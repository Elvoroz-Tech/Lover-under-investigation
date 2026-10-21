"use client";

/**
 * "Recent cases" — stored ONLY in this browser's localStorage.
 * Never synced, never sent anywhere. Wiped from the Opt-out page or the
 * "Clear" button. Every access is guarded: storage can be blocked or throw.
 */

const KEY = "lui.history.v1";
const MAX = 8;

export interface HistoryItem {
  code: string;
  emoji: string;
  label: string;
  at: number;
}

export function readHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.code === "string" && typeof x.label === "string")
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function addHistory(item: HistoryItem) {
  try {
    const next = [item, ...readHistory().filter((h) => h.code !== item.code)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — fine */
  }
}

/** Removes every key this site has ever written to this browser. */
export function wipeDevice(): number {
  let n = 0;
  try {
    for (const store of [localStorage, sessionStorage]) {
      const keys: string[] = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (k && k.startsWith("lui.")) keys.push(k);
      }
      keys.forEach((k) => store.removeItem(k));
      n += keys.length;
    }
  } catch {
    /* ignore */
  }
  return n;
}
