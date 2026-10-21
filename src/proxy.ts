/**
 * Next.js 16 Proxy (formerly "middleware"). Runs before every non-static request.
 * Security layers:
 *   1. Method allow-list (GET/HEAD only — the app has no write endpoints).
 *   2. Oversized URL rejection (cheap DoS / junk protection).
 *   3. Malformed case-code rejection before rendering.
 *   4. Per-IP rate limiting with separate buckets for pages, OG images and API.
 */

import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, type Bucket } from "@/lib/rateLimit";
import { APP_NAME } from "@/lib/config";
import { MAX_CODE_LENGTH } from "@/lib/caseCode";

const PREVIEW_BOTS =
  /(WhatsApp|facebookexternalhit|Facebot|Twitterbot|TelegramBot|Slackbot|Discordbot|LinkedInBot|SkypeUriPreview|Pinterest|redditbot|Snapchat|iMessage|Applebot)/i;

// Abuse takedowns: comma-separated case codes that must never render.
const BLOCKED_CODES = new Set(
  (process.env.BLOCKED_CASE_CODES || "").split(",").map((s) => s.trim()).filter(Boolean),
);

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || req.headers.get("cf-connecting-ip")?.trim() || "unknown";
}

function bucketFor(pathname: string): Bucket {
  if (pathname.startsWith("/api/")) return "api";
  if (/(opengraph-image|twitter-image)/.test(pathname)) return "og";
  return "page";
}

function tooManyHtml(reset: number) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Slow down, detective · ${APP_NAME}</title>
<style>body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#080405;color:#f4f1ea;font:16px/1.5 system-ui,sans-serif;text-align:center;padding:24px}
h1{font-size:clamp(28px,8vw,48px);margin:.2em 0;letter-spacing:-.03em}.t{display:inline-block;background:#ff2b44;color:#080405;padding:6px 14px;font-weight:800;transform:rotate(-3deg);border-radius:6px}p{opacity:.7;max-width:34ch;margin:12px auto}</style></head>
<body><div><span class="t">🚨 TOO MANY REQUESTS</span><h1>Slow down, detective.</h1><p>You've opened a suspicious number of cases. Take a breath — try again in about ${reset}s.</p></div></body></html>`;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (req.method !== "GET" && req.method !== "HEAD") {
    return new NextResponse("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  if (req.url.length > 1024) {
    return new NextResponse("URI Too Long", { status: 414 });
  }

  // Reject obviously malformed case codes before rendering anything.
  if (pathname.startsWith("/case/")) {
    const code = pathname.split("/")[2] ?? "";
    if (
      code.length === 0 ||
      code.length > MAX_CODE_LENGTH ||
      !/^[A-Za-z0-9_-]+$/.test(code) ||
      BLOCKED_CODES.has(code)
    ) {
      return NextResponse.rewrite(new URL("/case-not-found", req.url), { status: 404 });
    }
  }

  const bucket = bucketFor(pathname);
  const ip = clientIp(req);
  const ua = req.headers.get("user-agent") || "";
  // Link-preview crawlers share IPs across millions of users: key them separately.
  const key = bucket === "og" && PREVIEW_BOTS.test(ua) ? `bot:${ua.slice(0, 40)}:${ip}` : ip;

  const r = await rateLimit(key, bucket);
  const headers = {
    "X-RateLimit-Limit": String(r.limit),
    "X-RateLimit-Remaining": String(r.remaining),
    "X-RateLimit-Reset": String(r.reset),
  };

  if (!r.ok) {
    const h = { ...headers, "Retry-After": String(r.reset), "Cache-Control": "no-store" };
    if (bucket === "api") {
      return NextResponse.json({ error: "rate_limited", retryAfter: r.reset }, { status: 429, headers: h });
    }
    return new NextResponse(tooManyHtml(r.reset), {
      status: 429,
      headers: { ...h, "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const res = NextResponse.next();
  for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  return res;
}

export const config = {
  matcher: [
    // Everything except static assets & framework internals.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|manifest.webmanifest|robots.txt|sitemap.xml|fonts/).*)",
  ],
};
