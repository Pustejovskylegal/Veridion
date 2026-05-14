import { db, s } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { adapters } from "@/lib/sources";
import type { NormalizedTender } from "@/lib/sources";

/**
 * Seed: pokud chybí, založí předdefinované zdroje v `sources` tabulce.
 * Idempotentní — bezpečné spouštět opakovaně.
 */
export async function ensureSources() {
  const seeds: {
    code: string;
    kind: "ted" | "nen" | "vestnik";
    name: string;
    baseUrl: string;
    enabled: boolean;
  }[] = [
    {
      code: "ted-eu",
      kind: "ted",
      name: "TED — Tenders Electronic Daily",
      baseUrl: "https://ted.europa.eu",
      enabled: true,
    },
    {
      code: "nen",
      kind: "nen",
      name: "NEN — Národní elektronický nástroj",
      baseUrl: "https://nen.nipez.cz",
      enabled: false, // adapter coming soon
    },
    {
      code: "vestnik",
      kind: "vestnik",
      name: "Věstník veřejných zakázek",
      baseUrl: "https://vvz.nipez.cz",
      enabled: false, // adapter coming soon
    },
  ];

  for (const seed of seeds) {
    await db
      .insert(s.sources)
      .values(seed)
      .onConflictDoNothing({ target: s.sources.code });
  }
}

/**
 * Spustí ingest pro daný kód zdroje.
 * Vytvoří `tender_runs` záznam, upsertne tendry, zapíše statistiky.
 */
export async function ingestSource(
  sourceCode: string,
  options?: { limit?: number }
): Promise<{
  runId: string;
  fetched: number;
  created: number;
  updated: number;
}> {
  const [source] = await db
    .select()
    .from(s.sources)
    .where(eq(s.sources.code, sourceCode))
    .limit(1);

  if (!source) throw new Error(`Source not found: ${sourceCode}`);
  if (!source.enabled) throw new Error(`Source disabled: ${sourceCode}`);

  const adapter = adapters[sourceCode];
  if (!adapter) throw new Error(`No adapter registered: ${sourceCode}`);

  // Start a run
  const [run] = await db
    .insert(s.tenderRuns)
    .values({
      sourceId: source.id,
      status: "running",
    })
    .returning();

  try {
    const result = await adapter.fetchRecent(options);
    const { created, updated } = await upsertTenders(source.id, result.tenders);

    await db
      .update(s.tenderRuns)
      .set({
        status: "succeeded",
        itemsFetched: result.tenders.length,
        itemsCreated: created,
        itemsUpdated: updated,
        finishedAt: new Date(),
      })
      .where(eq(s.tenderRuns.id, run.id));

    await db
      .update(s.sources)
      .set({ lastRunAt: new Date() })
      .where(eq(s.sources.id, source.id));

    return {
      runId: run.id,
      fetched: result.tenders.length,
      created,
      updated,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db
      .update(s.tenderRuns)
      .set({
        status: "failed",
        errorMessage: msg,
        finishedAt: new Date(),
      })
      .where(eq(s.tenderRuns.id, run.id));
    throw err;
  }
}

async function upsertTenders(sourceId: string, tenders: NormalizedTender[]) {
  if (tenders.length === 0) return { created: 0, updated: 0 };

  let created = 0;
  let updated = 0;

  for (const t of tenders) {
    const inserted = await db
      .insert(s.tenders)
      .values({
        sourceId,
        externalId: t.externalId,
        sourceUrl: t.sourceUrl,
        title: t.title,
        contractingAuthority: t.contractingAuthority ?? null,
        contractingAuthorityIco: t.contractingAuthorityIco ?? null,
        cpvCodes: t.cpvCodes ?? null,
        nuts: t.nuts ?? null,
        procurementType: t.procurementType ?? null,
        estimatedValue: t.estimatedValue ?? null,
        currency: t.currency ?? "CZK",
        status: t.status ?? "open",
        publishedAt: t.publishedAt ?? null,
        deadlineAt: t.deadlineAt ?? null,
        raw: t.raw,
      })
      .onConflictDoUpdate({
        target: [s.tenders.sourceId, s.tenders.externalId],
        set: {
          title: t.title,
          contractingAuthority: t.contractingAuthority ?? null,
          contractingAuthorityIco: t.contractingAuthorityIco ?? null,
          cpvCodes: t.cpvCodes ?? null,
          nuts: t.nuts ?? null,
          procurementType: t.procurementType ?? null,
          estimatedValue: t.estimatedValue ?? null,
          currency: t.currency ?? "CZK",
          status: t.status ?? "open",
          publishedAt: t.publishedAt ?? null,
          deadlineAt: t.deadlineAt ?? null,
          raw: t.raw,
          updatedAt: new Date(),
        },
      })
      .returning({ id: s.tenders.id, createdAt: s.tenders.createdAt });

    if (inserted[0]) {
      // Heuristika: pokud createdAt < pár sekund, je to vlastně update
      const ageMs = Date.now() - new Date(inserted[0].createdAt).getTime();
      if (ageMs < 1500) created++;
      else updated++;
    }
  }

  return { created, updated };
}

/**
 * Vlastní ingestion celého enabled portfolia (vola se z cronu).
 */
export async function ingestAll(options?: { limit?: number }) {
  await ensureSources();

  const enabled = await db
    .select({ code: s.sources.code })
    .from(s.sources)
    .where(eq(s.sources.enabled, true));

  const results: Array<{
    code: string;
    ok: boolean;
    fetched?: number;
    created?: number;
    updated?: number;
    error?: string;
  }> = [];

  for (const src of enabled) {
    try {
      const r = await ingestSource(src.code, options);
      results.push({
        code: src.code,
        ok: true,
        fetched: r.fetched,
        created: r.created,
        updated: r.updated,
      });
    } catch (err) {
      results.push({
        code: src.code,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}
