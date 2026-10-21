/**
 * IP-based rate limiting, used by `src/proxy.ts`.
 *
 * - IPs are SHA-256 hashed with a secret salt before they are used as keys.
 *   Raw IP addresses are never stored, logged, or written to a database.
 * - Default store: in-memory fixed window (zero setup, perfect for one server).
 * - Optional store: MongoDB (set MONGODB_URI) so limits are shared across
 *   instances / serverless functions. Documents auto-expire via a TTL index.
 * - If MongoDB is slow or down, we fall back to memory (fail-open for users,
 *   still limited per instance) instead of breaking the site.
 */

import { createHash } from "node:crypto";
import type { MongoClient, Collection } from "mongodb";

export type Bucket = "page" | "og" | "api";

export interface LimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window resets. */
  reset: number;
}

const WINDOW = clampInt(process.env.RATE_LIMIT_WINDOW_SECONDS, 60, 5, 3600);
const LIMITS: Record<Bucket, number> = {
  page: clampInt(process.env.RATE_LIMIT_PAGES_MAX, 120, 5, 10_000),
  og: clampInt(process.env.RATE_LIMIT_OG_MAX, 40, 2, 10_000),
  api: clampInt(process.env.RATE_LIMIT_API_MAX, 30, 2, 10_000),
};
const SALT = process.env.RATE_LIMIT_SALT || "dev-only-salt-change-me";

function clampInt(v: string | undefined, def: number, min: number, max: number) {
  const n = Number.parseInt(v ?? "", 10);
  if (!Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, n));
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${SALT}:${ip}`).digest("base64url").slice(0, 32);
}

/* ---------------- memory store ---------------- */

type Entry = { count: number; resetAt: number };
const memory = new Map<string, Entry>();
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 30_000) return;
  lastSweep = now;
  for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
  // Safety valve against memory abuse via spoofed/rotating IPs.
  if (memory.size > 50_000) memory.clear();
}

function hitMemory(key: string, limit: number): LimitResult {
  const now = Date.now();
  sweep(now);
  let e = memory.get(key);
  if (!e || e.resetAt <= now) {
    e = { count: 0, resetAt: now + WINDOW * 1000 };
    memory.set(key, e);
  }
  e.count++;
  return {
    ok: e.count <= limit,
    limit,
    remaining: Math.max(0, limit - e.count),
    reset: Math.ceil((e.resetAt - now) / 1000),
  };
}

/* ---------------- mongo store (optional) ---------------- */

interface RateDoc {
  _id: string;
  count: number;
  expiresAt: Date;
}

let mongoPromise: Promise<Collection<RateDoc> | null> | null = null;

function getCollection(): Promise<Collection<RateDoc> | null> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) return Promise.resolve(null);
  if (!mongoPromise) {
    mongoPromise = (async () => {
      try {
        const { MongoClient } = await import("mongodb");
        const client: MongoClient = new MongoClient(uri, {
          serverSelectionTimeoutMS: 2500,
          maxPoolSize: 5,
        });
        await client.connect();
        const col = client
          .db(process.env.MONGODB_DB_NAME || "lover_under_investigation")
          .collection<RateDoc>("rate_limits");
        await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
        return col;
      } catch (err) {
        console.error("[rate-limit] MongoDB unavailable, using in-memory limiter.", (err as Error).message);
        mongoPromise = null; // retry on a later request
        return null;
      }
    })();
  }
  return mongoPromise;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([p, new Promise<null>((r) => setTimeout(() => r(null), ms))]);
}

async function hitMongo(key: string, limit: number): Promise<LimitResult | null> {
  const col = await withTimeout(getCollection(), 1500);
  if (!col) return null;
  const now = Date.now();
  const windowStart = Math.floor(now / (WINDOW * 1000)) * WINDOW * 1000;
  const resetAt = windowStart + WINDOW * 1000;
  try {
    const doc = await withTimeout(
      col.findOneAndUpdate(
        { _id: `${key}:${windowStart}` },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(resetAt + 5000) } },
        { upsert: true, returnDocument: "after" },
      ),
      800,
    );
    if (!doc) return null;
    return {
      ok: doc.count <= limit,
      limit,
      remaining: Math.max(0, limit - doc.count),
      reset: Math.ceil((resetAt - now) / 1000),
    };
  } catch {
    return null;
  }
}

/* ---------------- public ---------------- */

export async function rateLimit(ip: string, bucket: Bucket): Promise<LimitResult> {
  const limit = LIMITS[bucket];
  const key = `${bucket}:${hashIp(ip)}`;
  return (await hitMongo(key, limit)) ?? hitMemory(key, limit);
}
