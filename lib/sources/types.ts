/**
 * Společný kontrakt pro každý zdroj tendrů.
 * Každý adapter (TED, NEN, Věstník, …) implementuje `SourceAdapter`.
 */

export type NormalizedTender = {
  /** ID v původním systému (např. TED publication-number nebo NEN VZ-2026-…) */
  externalId: string;
  /** Odkaz na detail tendru ve zdrojovém systému */
  sourceUrl: string;
  title: string;
  contractingAuthority?: string | null;
  contractingAuthorityIco?: string | null;
  cpvCodes?: string[] | null;
  nuts?: string | null;
  procurementType?: string | null;
  /** Hodnota v haléřích (Kč * 100) — pokud neznáme, ponecháme null */
  estimatedValue?: number | null;
  currency?: string | null;
  status?: "open" | "awarded" | "cancelled" | "closed" | "unknown";
  publishedAt?: Date | null;
  deadlineAt?: Date | null;
  raw: Record<string, unknown>;
};

export type FetchResult = {
  tenders: NormalizedTender[];
  /** Surová odpověď (pro debug) */
  meta?: Record<string, unknown>;
};

export type SourceAdapter = {
  /** Stabilní code, který je v `sources.code` */
  code: string;
  name: string;
  baseUrl: string;
  fetchRecent(options?: { limit?: number }): Promise<FetchResult>;
};
