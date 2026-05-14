import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ingestAll } from "@/lib/ingest";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Manuální trigger ingestion z workspacu.
 * Vyžaduje přihlášeného uživatele (z Clerk middleware).
 * V Phase 2 doplnit role-based check (admin only).
 */
export async function POST() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await ingestAll({ limit: 50 });
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
