"use client";

/**
 * Google Analytics 4 — OFF unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * Privacy guard: case links contain the case itself, so every page view is
 * sent with the case code REDACTED (/case/[redacted]). Google never receives
 * which crime, nickname or alias is inside a link. IP anonymisation and
 * ad-personalisation signals are disabled.
 */

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function redactPath(path: string): string {
  return path.replace(/^\/case\/[^/?#]+/, "/case/[redacted]");
}

export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    // The very first page view is sent by the init script below.
    if (first.current) {
      first.current = false;
      return;
    }
    if (!GA_ID || !window.gtag) return;
    const safe = redactPath(pathname || "/");
    window.gtag("event", "page_view", {
      page_path: safe,
      page_location: window.location.origin + safe,
      page_title: document.title.replace(/№\s*\S+/g, "№ [redacted]"),
    });
  }, [pathname]);

  if (!GA_ID || !/^G-[A-Z0-9]+$/i.test(GA_ID)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('js',new Date());
gtag('config','${GA_ID}',{send_page_view:false,anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:window.location.origin+window.location.pathname.replace(/^\\/case\\/[^/?#]+/,'/case/[redacted]')});
gtag('event','page_view',{page_path:window.location.pathname.replace(/^\\/case\\/[^/?#]+/,'/case/[redacted]')});`}
      </Script>
    </>
  );
}

/** Fire a custom, anonymous event (e.g. share clicked). No case data is ever included. */
export function track(event: string, params: Record<string, string | number> = {}) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* ignore */
  }
}
