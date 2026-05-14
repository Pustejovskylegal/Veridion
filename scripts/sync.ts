/**
 * Lokální script pro ruční seed + ingest.
 * Spustit: npx tsx --env-file=.env.local scripts/sync.ts
 */

import { ingestAll, ensureSources } from "@/lib/ingest";

async function main() {
  console.log("→ Seeding sources …");
  await ensureSources();

  // Větší limit při ručním běhu — chceme refresh všech existujících
  const limit = Number(process.argv[2]) || 100;
  console.log(`→ Ingesting all enabled sources (limit ${limit}) …`);
  const results = await ingestAll({ limit });

  for (const r of results) {
    if (r.ok) {
      console.log(
        `  ✓ ${r.code} — fetched: ${r.fetched}, created: ${r.created}, updated: ${r.updated}`
      );
    } else {
      console.log(`  ✗ ${r.code} — ERROR: ${r.error}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
