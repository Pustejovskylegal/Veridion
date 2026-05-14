/**
 * Diff dvou verzí tendru. Vrací seznam změn s field name a significance.
 *
 * Pravidla:
 * - null → value = "doplněno" (important)
 * - value → null = "skryto" (important)
 * - hodnoty se liší = změna (significance podle pole)
 * - drobné textové změny (title/description): minor
 * - důležité změny (value, type): important
 * - kritické změny (deadline, status): critical
 */

import type { NormalizedTender } from "@/lib/sources";

type Significance = "critical" | "important" | "minor";

export type DetectedChange = {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  significance: Significance;
};

type TrackableTender = Pick<
  NormalizedTender,
  | "title"
  | "description"
  | "contractingAuthority"
  | "contractingAuthorityIco"
  | "cpvCodes"
  | "nuts"
  | "procurementType"
  | "procedureType"
  | "estimatedValue"
  | "currency"
  | "status"
  | "publishedAt"
  | "deadlineAt"
>;

const FIELD_SIGNIFICANCE: Record<keyof TrackableTender, Significance> = {
  title: "minor",
  description: "minor",
  contractingAuthority: "important",
  contractingAuthorityIco: "minor",
  cpvCodes: "minor",
  nuts: "minor",
  procurementType: "important",
  procedureType: "important",
  estimatedValue: "important",
  currency: "minor",
  status: "critical",
  publishedAt: "minor",
  deadlineAt: "critical",
};

function eqArray(a?: string[] | null, b?: string[] | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

function eqDate(a?: Date | string | null, b?: Date | string | null): boolean {
  const da = a ? new Date(a).getTime() : null;
  const db = b ? new Date(b).getTime() : null;
  return da === db;
}

function eqValue(field: keyof TrackableTender, a: unknown, b: unknown): boolean {
  if (field === "cpvCodes") return eqArray(a as string[] | null, b as string[] | null);
  if (field === "publishedAt" || field === "deadlineAt") {
    return eqDate(a as Date | null, b as Date | null);
  }
  return a === b || (a == null && b == null);
}

function serialise(field: keyof TrackableTender, v: unknown): unknown {
  if (v == null) return null;
  if (field === "publishedAt" || field === "deadlineAt") {
    return v instanceof Date ? v.toISOString() : v;
  }
  return v;
}

/**
 * Vrátí pole detekovaných změn. Prázdné pole = beze změn.
 */
export function diffTender(
  oldT: TrackableTender,
  newT: TrackableTender
): DetectedChange[] {
  const changes: DetectedChange[] = [];
  const fields = Object.keys(FIELD_SIGNIFICANCE) as Array<keyof TrackableTender>;

  for (const field of fields) {
    const oldVal = oldT[field];
    const newVal = newT[field];
    if (!eqValue(field, oldVal, newVal)) {
      changes.push({
        field,
        oldValue: serialise(field, oldVal),
        newValue: serialise(field, newVal),
        significance: FIELD_SIGNIFICANCE[field],
      });
    }
  }
  return changes;
}

/**
 * Lidsky čitelný popisek pole pro UI.
 */
export function fieldLabel(field: string): string {
  const map: Record<string, string> = {
    title: "Název",
    description: "Popis předmětu",
    contractingAuthority: "Zadavatel",
    contractingAuthorityIco: "IČO zadavatele",
    cpvCodes: "CPV klasifikace",
    nuts: "Region (NUTS)",
    procurementType: "Druh zakázky",
    procedureType: "Typ řízení",
    estimatedValue: "Odhadovaná hodnota",
    currency: "Měna",
    status: "Stav",
    publishedAt: "Datum publikace",
    deadlineAt: "Termín pro nabídky",
  };
  return map[field] ?? field;
}
