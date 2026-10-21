import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, mono, serif } from "./fonts";
import Background from "@/components/Background";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import Providers from "@/components/Providers";
import Effects from "@/components/Effects";
import { APP_NAME, APP_TAGLINE, SITE_URL } from "@/lib/config";

const gsc = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} 🕵️ — roast your partner with an official award`,
    template: `%s · ${APP_NAME}`,
  },
  description: `${APP_TAGLINE} Pick their crime, get a ridiculous certificate, send the evidence. No signup, no database.`,
  applicationName: APP_NAME,
  keywords: [
    "relationship roast",
    "funny certificate for boyfriend",
    "funny award for girlfriend",
    "couple memes",
    "partner roast",
    "funny relationship award",
    "gen z couple",
    "bare minimum award",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} 🕵️`,
    description:
      "Your partner has been nominated for something. Unfortunately, it's not an award.",
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} 🕵️`,
    description: APP_TAGLINE,
  },
  robots: { index: true, follow: true },
  verification: {
    ...(gsc ? { google: gsc } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  },
  formatDetection: { telephone: false, email: false, address: false },
};

/**
 * Runs before first paint so there is never a flash of the wrong theme.
 * Saved choice wins; otherwise follow the device setting; default dark.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('lui.theme');if(t!=='light'&&t!=='dark'){t='light'}document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'#fff5f4':'#080405')}catch(e){document.documentElement.dataset.theme='light'}})();`;

export const viewport: Viewport = {
    themeColor: "#fff5f4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${display.variable} ${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <a href="#main" className="sr-only">
            Skip to content
          </a>
          <Background />
          <Effects />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
