import { ImageResponse } from "next/og";
import { APP_INITIALS } from "@/lib/config";
import { ogFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon, generated from the brand initials. */
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0a10" }}>
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", width: 130, height: 130, borderRadius: 34,
            background: "#ff2b44", color: "#0a0405", fontFamily: "Mono", fontSize: APP_INITIALS.length > 3 ? 40 : 50,
            transform: "rotate(-8deg)",
          }}
        >
          {APP_INITIALS}
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
