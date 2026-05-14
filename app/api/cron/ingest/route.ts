import { NextResponse } from "next/server";
import { ingestAll } from "@/lib/ingest";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min (Vercel Pro); na Hobby max 60

/**
 * Vercel Cron endpoint pro ingestion.
 * Vercel volá GET s hlavičkou `Authorization: Bearer ${CRON_SECRET}`
 * Konfigurace v `vercel.json`.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await ingestAll({ limit: 100 });
    return NextResponse.json({
      ok: true,
      ranAt: new Date().toISOString(),
      results,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
