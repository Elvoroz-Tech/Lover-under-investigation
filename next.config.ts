import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
// Google Analytics domains are only allowed by the CSP when GA is configured.
const gaOn = !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const GA_SCRIPT = gaOn ? " https://www.googletagmanager.com" : "";
const GA_CONNECT = gaOn
  ? " https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com"
  : "";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${GA_SCRIPT}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${GA_CONNECT}`,
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""}${GA_CONNECT}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // The case lives in the URL path — never leak it to other sites.
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Make sure the OG-image fonts ship with serverless/standalone deployments.
  outputFileTracingIncludes: { "/**/*": ["./src/og-fonts/**"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
