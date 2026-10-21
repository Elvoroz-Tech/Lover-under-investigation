import { ImageResponse } from "next/og";
import { APP_NAME, SITE_URL } from "@/lib/config";
import { OG_SIZE, OgFrame, ogFonts } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${APP_NAME} — roast your partner with an official award`;

export default async function Image() {
  return new ImageResponse(
    (
      <OgFrame
        kicker={`${APP_NAME.toUpperCase()}`}
        title="Your partner has been nominated for something."
        sub="Unfortunately, it's not an award. Pick their crime, send the evidence."
        host={SITE_URL.replace(/^https?:\/\//, "")}
      />
    ),
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
