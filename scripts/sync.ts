/**
 * Lokální script pro ruční seed + ingest.
 * Spustit: npx tsx --env-file=.env.local scripts/sync.ts
 */

import { ingestAll, ensureSources } from "@/lib/ingest";

async function main() {
  console.log("→ Seeding sources …");
  await ensureSources();

  console.log("→ Ingesting all enabled sources …");
  const results = await ingestAll({ limit: 50 });

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
