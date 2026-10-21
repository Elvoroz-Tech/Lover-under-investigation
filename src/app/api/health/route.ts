import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Uptime check for your host / monitoring. Contains no data. */
export function GET() {
  return NextResponse.json({ ok: true, time: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
