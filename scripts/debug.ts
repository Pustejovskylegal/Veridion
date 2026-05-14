/**
 * Debug: ukáže pár tendrů z DB pro kontrolu po sync.
 */
import { db, s } from "@/lib/db";
import { desc } from "drizzle-orm";

async function main() {
  const rows = await db
    .select({
      externalId: s.tenders.externalId,
      sourceUrl: s.tenders.sourceUrl,
      title: s.tenders.title,
      buyer: s.tenders.contractingAuthority,
    })
    .from(s.tenders)
    .orderBy(desc(s.tenders.publishedAt))
    .limit(5);

  for (const r of rows) {
    console.log(`[${r.externalId}]`);
    console.log(`  Title: ${r.title}`);
    console.log(`  Buyer: ${r.buyer}`);
    console.log(`  URL:   ${r.sourceUrl}`);
    console.log();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
