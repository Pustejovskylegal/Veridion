import { db, s } from "@/lib/db";
import { desc, eq, sql } from "drizzle-orm";

export type TenderListItem = {
  id: string;
  externalId: string;
  sourceUrl: string;
  title: string;
  contractingAuthority: string | null;
  cpvCodes: string[] | null;
  nuts: string | null;
  procurementType: string | null;
  procedureType: string | null;
  publishedAt: Date | null;
  deadlineAt: Date | null;
  estimatedValue: number | null;
  currency: string | null;
  status: "open" | "awarded" | "cancelled" | "closed" | "unknown";
  sourceName: string;
  sourceCode: string;
};

export type TenderDetail = TenderListItem & {
  description: string | null;
  contractingAuthorityIco: string | null;
  raw: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function listRecentTenders(limit = 25): Promise<TenderListItem[]> {
  const rows = await db
    .select({
      id: s.tenders.id,
      externalId: s.tenders.externalId,
      sourceUrl: s.tenders.sourceUrl,
      title: s.tenders.title,
      contractingAuthority: s.tenders.contractingAuthority,
      cpvCodes: s.tenders.cpvCodes,
      nuts: s.tenders.nuts,
      procurementType: s.tenders.procurementType,
      procedureType: s.tenders.procedureType,
      publishedAt: s.tenders.publishedAt,
      deadlineAt: s.tenders.deadlineAt,
      estimatedValue: s.tenders.estimatedValue,
      currency: s.tenders.currency,
      status: s.tenders.status,
      sourceName: s.sources.name,
      sourceCode: s.sources.code,
    })
    .from(s.tenders)
    .innerJoin(s.sources, eq(s.tenders.sourceId, s.sources.id))
    .orderBy(desc(s.tenders.publishedAt))
    .limit(limit);

  return rows;
}

export async function getTenderById(id: string): Promise<TenderDetail | null> {
  const [row] = await db
    .select({
      id: s.tenders.id,
      externalId: s.tenders.externalId,
      sourceUrl: s.tenders.sourceUrl,
      title: s.tenders.title,
      description: s.tenders.description,
      contractingAuthority: s.tenders.contractingAuthority,
      contractingAuthorityIco: s.tenders.contractingAuthorityIco,
      cpvCodes: s.tenders.cpvCodes,
      nuts: s.tenders.nuts,
      procurementType: s.tenders.procurementType,
      procedureType: s.tenders.procedureType,
      publishedAt: s.tenders.publishedAt,
      deadlineAt: s.tenders.deadlineAt,
      estimatedValue: s.tenders.estimatedValue,
      currency: s.tenders.currency,
      status: s.tenders.status,
      raw: s.tenders.raw,
      createdAt: s.tenders.createdAt,
      updatedAt: s.tenders.updatedAt,
      sourceName: s.sources.name,
      sourceCode: s.sources.code,
    })
    .from(s.tenders)
    .innerJoin(s.sources, eq(s.tenders.sourceId, s.sources.id))
    .where(eq(s.tenders.id, id))
    .limit(1);

  return row ?? null;
}

export type WorkspaceStats = {
  totalTracked: number;
  openTenders: number;
  publishedThisWeek: number;
  upcomingDeadlines: number;
};

export async function getWorkspaceStats(): Promise<WorkspaceStats> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const inTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const [totals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      open: sql<number>`count(*) filter (where ${s.tenders.status} = 'open')::int`,
      thisWeek: sql<number>`count(*) filter (where ${s.tenders.publishedAt} >= ${weekAgo.toISOString()})::int`,
      upcoming: sql<number>`count(*) filter (where ${s.tenders.deadlineAt} between ${now.toISOString()} and ${inTwoWeeks.toISOString()})::int`,
    })
    .from(s.tenders);

  return {
    totalTracked: Number(totals?.total ?? 0),
    openTenders: Number(totals?.open ?? 0),
    publishedThisWeek: Number(totals?.thisWeek ?? 0),
    upcomingDeadlines: Number(totals?.upcoming ?? 0),
  };
}

export async function getLastSyncMeta() {
  const rows = await db
    .select({
      code: s.sources.code,
      name: s.sources.name,
      lastRunAt: s.sources.lastRunAt,
      enabled: s.sources.enabled,
    })
    .from(s.sources)
    .orderBy(desc(s.sources.lastRunAt));

  return rows;
}
