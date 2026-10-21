import { readFile } from "node:fs/promises";
import path from "node:path";

/** Shared pieces for server-rendered Open Graph images (link previews). */

export const OG_SIZE = { width: 1200, height: 630 };

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 700 | 800; style: "normal" }[]> | null = null;

export function ogFonts() {
  if (!fontsPromise) {
    const dir = path.join(process.cwd(), "src", "og-fonts");
    fontsPromise = Promise.all([
      readFile(path.join(dir, "bricolage-800.woff")),
      readFile(path.join(dir, "space-mono-700.woff")),
    ]).then(([display, mono]) => [
      { name: "Display", data: display, weight: 800 as const, style: "normal" as const },
      { name: "Mono", data: mono, weight: 700 as const, style: "normal" as const },
    ]);
  }
  return fontsPromise;
}

const stripes = "repeating-linear-gradient(-45deg, #ff2b44 0 28px, #080405 28px 56px)";

export function OgFrame({ kicker, title, sub, host }: { kicker: string; title: string; sub: string; host: string }) {
  return (
    <div
      style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative",
        background: "#080405", color: "#f4f1ea", fontFamily: "Display",
        backgroundImage: "radial-gradient(circle at 10% 10%, rgba(143,10,31,.85), transparent 45%), radial-gradient(circle at 95% 90%, rgba(255,43,68,.5), transparent 45%)",
      }}
    >
      <div style={{ display: "flex", height: 40, width: "100%", backgroundImage: stripes }} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "48px 64px", justifyContent: "center" }}>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", background: "#ff2b44", color: "#080405", fontFamily: "Mono", fontSize: 26, padding: "10px 20px", borderRadius: 10, transform: "rotate(-2deg)", letterSpacing: 2 }}>
            {kicker}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1, letterSpacing: -3, marginTop: 30, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 24, color: "#cfcbdb", maxWidth: 900, fontFamily: "Display" }}>{sub}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 64px 36px", fontFamily: "Mono", fontSize: 24, color: "#a39fb4" }}>
        <span>{host}</span>
        <span style={{ color: "#e2253d", border: "4px solid #e2253d", padding: "6px 14px", borderRadius: 10, transform: "rotate(-6deg)" }}>CLASSIFIED</span>
      </div>
      <div style={{ display: "flex", height: 40, width: "100%", backgroundImage: stripes }} />
    </div>
  );
}
