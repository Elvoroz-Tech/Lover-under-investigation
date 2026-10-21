import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeCase, formatCaseNumber } from "@/lib/caseCode";
import { APP_INITIALS, APP_NAME } from "@/lib/config";
import CaseClient from "./CaseClient";

type Params = { params: Promise<{ code: string }>; searchParams: Promise<{ new?: string }> };

/**
 * The server only DECODES the link (to build the teaser preview card).
 * Nothing is written, stored, or logged — there is nowhere to store it.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { code } = await params;
  const data = decodeCase(code);
  if (!data) return { title: "Case not found", robots: { index: false, follow: false } };
  const no = formatCaseNumber(APP_INITIALS, data);
  // Never reveal the crime in the preview — the curiosity IS the product.
  const title = `🚨 Case № ${no} — ${data.to ? `${data.to}, you're` : "You're"} under investigation`;
  const description = "Someone has opened a case against you. Open the file to see what you did. 💀";
  return {
    title: { absolute: `${title} · ${APP_NAME}` },
    description,
    robots: { index: false, follow: false, nocache: true },
    openGraph: { title, description, type: "website", siteName: APP_NAME },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CasePage({ params, searchParams }: Params) {
  const { code } = await params;
  const { new: isNew } = await searchParams;
  const data = decodeCase(code);
  if (!data) notFound();

  return (
    <div className="page container">
      <CaseClient data={data} code={code} fresh={isNew === "1"} />
    </div>
  );
}
