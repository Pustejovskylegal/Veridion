import { db, s } from "@/lib/db";
import { sql } from "drizzle-orm";

async function main() {
  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      withPub: sql<number>`count(${s.tenders.publishedAt})::int`,
      withDeadline: sql<number>`count(${s.tenders.deadlineAt})::int`,
      withValue: sql<number>`count(${s.tenders.estimatedValue})::int`,
      withDesc: sql<number>`count(${s.tenders.description})::int`,
      withNuts: sql<number>`count(${s.tenders.nuts})::int`,
      withProcedure: sql<number>`count(${s.tenders.procedureType})::int`,
    })
    .from(s.tenders);

  const total = stats.total;
  const pct = (n: number) => `${n}/${total} (${Math.round((n / total) * 100)}%)`;

  console.log("=== Pokrytí polí ===");
  console.log(`Datum publikace:    ${pct(stats.withPub)}`);
  console.log(`Termín nabídek:     ${pct(stats.withDeadline)}`);
  console.log(`Odhadovaná hodnota: ${pct(stats.withValue)}`);
  console.log(`Popis:              ${pct(stats.withDesc)}`);
  console.log(`NUTS region:        ${pct(stats.withNuts)}`);
  console.log(`Typ řízení:         ${pct(stats.withProcedure)}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
