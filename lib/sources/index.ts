import { tedAdapter } from "./ted";
import type { SourceAdapter } from "./types";

/**
 * Registry všech adaptérů.
 * Pokud je `enabled: false` v DB sources, ingestion ho přeskočí.
 *
 * Pro přidání nového zdroje:
 *  1. Vytvoř `lib/sources/{nazev}.ts` implementující `SourceAdapter`
 *  2. Přidej ho sem
 *  3. V seed scriptu přidej řádek do `sources` tabulky s tím `code`
 */
export const adapters: Record<string, SourceAdapter> = {
  [tedAdapter.code]: tedAdapter,
};

export { tedAdapter };
export type { SourceAdapter, NormalizedTender, FetchResult } from "./types";
