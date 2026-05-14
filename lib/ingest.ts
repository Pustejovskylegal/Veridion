import { db, s } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { adapters } from "@/lib/sources";
import type { NormalizedTender } from "@/lib/sources";
import { diffTender } from "@/lib/diff";

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
      enabled: false,
    },
    {
      code: "vestnik",
      kind: "vestnik",
      name: "Věstník veřejných zakázek",
      baseUrl: "https://vvz.nipez.cz",
      enabled: false,
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
 * Vytvoří `tender_runs` záznam, upsertne tendry, zapíše změny, statistiky.
 */
export async function ingestSource(
  sourceCode: string,
  options?: { limit?: number }
): Promise<{
  runId: string;
  fetched: number;
  created: number;
  updated: number;
  changesDetected: number;
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

  const [run] = await db
    .insert(s.tenderRuns)
    .values({ sourceId: source.id, status: "running" })
    .returning();

  try {
    const result = await adapter.fetchRecent(options);
    const stats = await upsertTenders(source.id, run.id, result.tenders);

    await db
      .update(s.tenderRuns)
      .set({
        status: "succeeded",
        itemsFetched: result.tenders.length,
        itemsCreated: stats.created,
        itemsUpdated: stats.updated,
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
      created: stats.created,
      updated: stats.updated,
      changesDetected: stats.changesDetected,
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

async function upsertTenders(
  sourceId: string,
  runId: string,
  tenders: NormalizedTender[]
) {
  if (tenders.length === 0)
    return { created: 0, updated: 0, changesDetected: 0 };

  let created = 0;
  let updated = 0;
  let changesDetected = 0;

  for (const t of tenders) {
    // Načíst existující záznam (pro diff)
    const [existing] = await db
      .select()
      .from(s.tenders)
      .where(
        and(eq(s.tenders.sourceId, sourceId), eq(s.tenders.externalId, t.externalId))
      )
      .limit(1);

    const fields = {
      sourceUrl: t.sourceUrl,
      title: t.title,
      description: t.description ?? null,
      contractingAuthority: t.contractingAuthority ?? null,
      contractingAuthorityIco: t.contractingAuthorityIco ?? null,
      cpvCodes: t.cpvCodes ?? null,
      nuts: t.nuts ?? null,
      procurementType: t.procurementType ?? null,
      procedureType: t.procedureType ?? null,
      estimatedValue: t.estimatedValue ?? null,
      currency: t.currency ?? "CZK",
      status: t.status ?? "open",
      publishedAt: t.publishedAt ?? null,
      deadlineAt: t.deadlineAt ?? null,
      raw: t.raw,
    };

    if (!existing) {
      // CREATE — bez change recordu (první výskyt)
      await db.insert(s.tenders).values({
        sourceId,
        externalId: t.externalId,
        ...fields,
      });
      created++;
      continue;
    }

    // Diff proti existující verzi
    const oldT = {
      title: existing.title,
      description: existing.description,
      contractingAuthority: existing.contractingAuthority,
      contractingAuthorityIco: existing.contractingAuthorityIco,
      cpvCodes: existing.cpvCodes,
      nuts: existing.nuts,
      procurementType: existing.procurementType,
      procedureType: existing.procedureType,
      estimatedValue: existing.estimatedValue,
      currency: existing.currency,
      status: existing.status,
      publishedAt: existing.publishedAt,
      deadlineAt: existing.deadlineAt,
    };
    const newT = {
      title: t.title,
      description: t.description ?? null,
      contractingAuthority: t.contractingAuthority ?? null,
      contractingAuthorityIco: t.contractingAuthorityIco ?? null,
      cpvCodes: t.cpvCodes ?? null,
      nuts: t.nuts ?? null,
      procurementType: t.procurementType ?? null,
      procedureType: t.procedureType ?? null,
      estimatedValue: t.estimatedValue ?? null,
      currency: t.currency ?? "CZK",
      status: t.status ?? "open",
      publishedAt: t.publishedAt ?? null,
      deadlineAt: t.deadlineAt ?? null,
    };
    const changes = diffTender(oldT as never, newT as never);

    // Update + zapsat všechny detekované změny
    await db
      .update(s.tenders)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(s.tenders.id, existing.id));

    if (changes.length > 0) {
      await db.insert(s.tenderChanges).values(
        changes.map((c) => ({
          tenderId: existing.id,
          runId,
          field: c.field,
          oldValue: c.oldValue as never,
          newValue: c.newValue as never,
          significance: c.significance,
        }))
      );
      changesDetected += changes.length;
    }
    updated++;
  }

  return { created, updated, changesDetected };
}

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
    changesDetected?: number;
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
        changesDetected: r.changesDetected,
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
