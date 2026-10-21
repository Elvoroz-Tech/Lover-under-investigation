import { ImageResponse } from "next/og";
import { decodeCase, formatCaseNumber } from "@/lib/caseCode";
import { APP_INITIALS, APP_NAME, SITE_URL } from "@/lib/config";
import { OG_SIZE, OgFrame, ogFonts } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A case has been opened against you";

/** Teaser preview for chat apps. Deliberately does NOT reveal the crime. */
export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = decodeCase(code);
  const host = SITE_URL.replace(/^https?:\/\//, "");
  const title = data?.to ? `${data.to}, you are under investigation.` : "You are under investigation.";
  return new ImageResponse(
    (
      <OgFrame
        kicker={data ? `CASE NO. ${formatCaseNumber(APP_INITIALS, data)}` : `${APP_NAME.toUpperCase()}`}
        title={title}
        sub="Someone has filed evidence against you. Tap to open the case file."
        host={host}
      />
    ),
    { ...OG_SIZE, fonts: await ogFonts(), headers: { "Cache-Control": "public, max-age=86400, immutable" } },
  );
}
