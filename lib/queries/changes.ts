import { db, s } from "@/lib/db";
import { desc, eq, gte, sql } from "drizzle-orm";

export type TenderChangeRow = {
  id: string;
  tenderId: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  significance: "critical" | "important" | "minor";
  detectedAt: Date;
};

export type RecentChangeAggregate = {
  tenderId: string;
  tenderTitle: string;
  tenderExternalId: string;
  sourceCode: string;
  significance: "critical" | "important" | "minor";
  changeCount: number;
  lastDetectedAt: Date;
  fields: string[];
};

/**
 * Vrátí změny pro konkrétní tendr (poslední N).
 */
export async function getChangesForTender(
  tenderId: string,
  limit = 25
): Promise<TenderChangeRow[]> {
  const rows = await db
    .select({
      id: s.tenderChanges.id,
      tenderId: s.tenderChanges.tenderId,
      field: s.tenderChanges.field,
      oldValue: s.tenderChanges.oldValue,
      newValue: s.tenderChanges.newValue,
      significance: s.tenderChanges.significance,
      detectedAt: s.tenderChanges.detectedAt,
    })
    .from(s.tenderChanges)
    .where(eq(s.tenderChanges.tenderId, tenderId))
    .orderBy(desc(s.tenderChanges.detectedAt))
    .limit(limit);

  return rows;
}

/**
 * Vrátí mapu tenderId -> {count, maxSignificance} za poslední N dní.
 * Použité pro badge v list view.
 */
export async function getRecentChangesPerTender(daysBack = 7) {
  const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({
      tenderId: s.tenderChanges.tenderId,
      count: sql<number>`count(*)::int`,
      hasCritical: sql<boolean>`bool_or(${s.tenderChanges.significance} = 'critical')`,
      hasImportant: sql<boolean>`bool_or(${s.tenderChanges.significance} = 'important')`,
    })
    .from(s.tenderChanges)
    .where(gte(s.tenderChanges.detectedAt, since))
    .groupBy(s.tenderChanges.tenderId);

  const map = new Map<
    string,
    { count: number; topSignificance: "critical" | "important" | "minor" }
  >();
  for (const r of rows) {
    map.set(r.tenderId, {
      count: r.count,
      topSignificance: r.hasCritical ? "critical" : r.hasImportant ? "important" : "minor",
    });
  }
  return map;
}

/**
 * Vrátí agregované změny napříč všemi tendry pro `/workspace/zmeny`.
 * Seskupuje per tendr, vrací max(detectedAt) a top significance.
 */
export async function listRecentChanges(
  daysBack = 30,
  limit = 50
): Promise<RecentChangeAggregate[]> {
  const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

  const rows = await db
    .select({
      tenderId: s.tenderChanges.tenderId,
      tenderTitle: s.tenders.title,
      tenderExternalId: s.tenders.externalId,
      sourceCode: s.sources.code,
      changeCount: sql<number>`count(*)::int`,
      lastDetectedAt: sql<Date>`max(${s.tenderChanges.detectedAt})`,
      hasCritical: sql<boolean>`bool_or(${s.tenderChanges.significance} = 'critical')`,
      hasImportant: sql<boolean>`bool_or(${s.tenderChanges.significance} = 'important')`,
      fields: sql<string[]>`array_agg(distinct ${s.tenderChanges.field})`,
    })
    .from(s.tenderChanges)
    .innerJoin(s.tenders, eq(s.tenderChanges.tenderId, s.tenders.id))
    .innerJoin(s.sources, eq(s.tenders.sourceId, s.sources.id))
    .where(gte(s.tenderChanges.detectedAt, since))
    .groupBy(
      s.tenderChanges.tenderId,
      s.tenders.title,
      s.tenders.externalId,
      s.sources.code
    )
    .orderBy(desc(sql`max(${s.tenderChanges.detectedAt})`))
    .limit(limit);

  return rows.map((r) => ({
    tenderId: r.tenderId,
    tenderTitle: r.tenderTitle,
    tenderExternalId: r.tenderExternalId,
    sourceCode: r.sourceCode,
    significance: r.hasCritical ? "critical" : r.hasImportant ? "important" : "minor",
    changeCount: r.changeCount,
    lastDetectedAt: new Date(r.lastDetectedAt),
    fields: r.fields,
  }));
}

export async function countRecentChanges(daysBack = 7): Promise<number> {
  const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  const [r] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(s.tenderChanges)
    .where(gte(s.tenderChanges.detectedAt, since));
  return r?.c ?? 0;
}
