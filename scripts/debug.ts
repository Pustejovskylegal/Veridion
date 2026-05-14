import { db, s } from "@/lib/db";
import { desc } from "drizzle-orm";

async function main() {
  const rows = await db
    .select({
      title: s.tenders.title,
      description: s.tenders.description,
      buyer: s.tenders.contractingAuthority,
      procurementType: s.tenders.procurementType,
      procedureType: s.tenders.procedureType,
      cpvCodes: s.tenders.cpvCodes,
      value: s.tenders.estimatedValue,
      currency: s.tenders.currency,
    })
    .from(s.tenders)
    .orderBy(desc(s.tenders.publishedAt))
    .limit(3);

  for (const r of rows) {
    console.log(`Title:    ${r.title?.slice(0, 80)}`);
    console.log(`Desc:     ${r.description?.slice(0, 100) ?? "—"}`);
    console.log(`Buyer:    ${r.buyer}`);
    console.log(`Type:     ${r.procurementType} · procedure: ${r.procedureType}`);
    console.log(`CPV:      ${r.cpvCodes?.join(", ") ?? "—"}`);
    console.log(`Value:    ${r.value} ${r.currency}`);
    console.log("---");
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
