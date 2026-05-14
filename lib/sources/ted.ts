import type { NormalizedTender, SourceAdapter, FetchResult } from "./types";

/**
 * Adapter pro TED (Tenders Electronic Daily — EU portal).
 *
 * API: POST https://api.ted.europa.eu/v3/notices/search
 * Docs: https://docs.ted.europa.eu/api/
 *
 * Filtruje na CZ pomocí `place-of-performance=CZE`.
 * Vrací nejnovější notices seřazené od nejnovější publikace.
 */

const TED_ENDPOINT = "https://api.ted.europa.eu/v3/notices/search";

type TedLinks = {
  html?: Record<string, string>;
  htmlDirect?: Record<string, string>;
  pdf?: Record<string, string>;
  xml?: Record<string, string>;
};

/**
 * TED API vrací lokalizované textové pole buď jako string nebo array stringů.
 * Klíče jsou ISO 639-3 (ces, eng, deu, …).
 */
type LocalisedField =
  | (Record<string, string | string[]> & {
      ces?: string | string[];
      eng?: string | string[];
    })
  | string
  | undefined
  | null;

type TedNotice = {
  "publication-number"?: string;
  "publication-date"?: string;
  "notice-title"?: LocalisedField;
  "title-proc"?: LocalisedField;
  "description-proc"?: LocalisedField;
  "buyer-name"?: LocalisedField;
  "contract-nature"?: string[];
  "procedure-type"?: string | string[];
  "deadline-receipt-tender-date-lot"?: string[];
  "deadline-receipt-tender-time-lot"?: string[];
  "deadline-receipt-request-date-lot"?: string[];
  "deadline-date-part"?: string[];
  "estimated-value-lot"?: (string | number)[];
  "estimated-value-cur-lot"?: string[];
  "framework-estimated-value-glo"?: (string | number)[];
  "framework-maximum-value-glo"?: (string | number)[];
  "framework-estimated-value-cur-glo"?: string[];
  "classification-cpv"?: string[];
  "place-of-performance"?: string[];
  links?: TedLinks;
  [key: string]: unknown;
};

type TedResponse = {
  notices: TedNotice[];
  totalNoticeCount?: number;
};

const REQUESTED_FIELDS = [
  "publication-number",
  "notice-title",
  "title-proc",
  "description-proc",
  "publication-date",
  "buyer-name",
  "contract-nature",
  "procedure-type",
  // Deadline (zkusíme víc úrovní — různé typy notice je mají jinde)
  "deadline-receipt-tender-date-lot",
  "deadline-receipt-tender-time-lot",
  "deadline-receipt-request-date-lot",
  "deadline-date-part",
  // Hodnota — lot úroveň + framework agreement úroveň
  "estimated-value-lot",
  "estimated-value-cur-lot",
  "framework-estimated-value-glo",
  "framework-maximum-value-glo",
  "framework-estimated-value-cur-glo",
  // Klasifikace
  "classification-cpv",
  "place-of-performance",
  "links",
];

const LOCALE_PRIORITY = ["ces", "slk", "eng", "deu"];

function pickLocalised(field: LocalisedField): string | null {
  if (!field) return null;
  if (typeof field === "string") return field;

  for (const lang of LOCALE_PRIORITY) {
    const v = field[lang];
    if (typeof v === "string" && v.trim()) return v;
    if (Array.isArray(v) && v.length && typeof v[0] === "string" && v[0].trim()) {
      return v[0];
    }
  }

  // Fallback — první neprázdná hodnota
  for (const key of Object.keys(field)) {
    const v = (field as Record<string, unknown>)[key];
    if (typeof v === "string" && v.trim()) return v;
    if (Array.isArray(v) && v.length && typeof v[0] === "string" && v[0].trim()) {
      return v[0];
    }
  }
  return null;
}

function pickFirst<T>(arr: T[] | undefined): T | null {
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
}

function parseTedDate(raw?: string | null): Date | null {
  if (!raw) return null;
  let s = raw.trim();
  // TED vrací buď "2026-05-13T14:00:00+02:00" nebo jen "2026-05-13+02:00".
  // Druhý formát není validní pro `new Date()` — doplníme T00:00:00.
  s = s.replace(/^(\d{4}-\d{2}-\d{2})([+-]\d{2}:\d{2})$/, "$1T00:00:00$2");
  // Někdy přijde i čistě "2026-05-13" — to Date zvládne.
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Sečte všechny lot hodnoty (TED je vrací jako stringy v poli).
 * Vrátí součet v haléřích (Kč * 100), nebo null pokud žádná validní hodnota.
 */
function sumLotValues(arr: unknown): number | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  let sum = 0;
  let any = false;
  for (const v of arr) {
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n) && n > 0) {
      sum += n;
      any = true;
    }
  }
  return any ? Math.round(sum * 100) : null;
}

function dedupeArray<T>(arr: T[] | null | undefined): T[] | null {
  if (!arr) return null;
  const seen = new Set<T>();
  const out: T[] = [];
  for (const v of arr) {
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out.length ? out : null;
}

/** Spojí datum + čas (oba jako stringy z TED) do Date. */
function combineDateAndTime(
  date?: string | null,
  time?: string | null
): Date | null {
  if (!date) return null;
  // Normalizuj date — odstraň TZ suffix pokud je
  const dateOnly = date.replace(/^(\d{4}-\d{2}-\d{2}).*$/, "$1");
  if (!dateOnly) return null;
  // Time formát z TED: "14:00:00+02:00"
  const t = time && /^\d{2}:\d{2}/.test(time) ? time : "00:00:00+02:00";
  const iso = `${dateOnly}T${t}`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** procedure-type je někdy string ("open"), jindy array (["open"]) */
function pickProcedureType(v: string | string[] | undefined): string | null {
  if (!v) return null;
  if (typeof v === "string") return v;
  return pickFirst(v);
}

function buildSourceUrl(links?: TedLinks, pubNumber?: string): string {
  // Prefer user-friendly detail page; never the raw `htmlDirect` which TED
  // serves with Content-Disposition: attachment.
  if (links?.html?.CES) return links.html.CES;
  if (links?.html?.ENG) return links.html.ENG;
  if (pubNumber) return `https://ted.europa.eu/cs/notice/-/detail/${pubNumber}`;
  return "https://ted.europa.eu";
}

function normalise(notice: TedNotice): NormalizedTender | null {
  const externalId = notice["publication-number"];
  if (!externalId) return null;

  // `title-proc` (procedure title) je čitelnější než `notice-title`
  const title =
    pickLocalised(notice["title-proc"]) ??
    pickLocalised(notice["notice-title"]) ??
    `TED notice ${externalId}`;

  const description = pickLocalised(notice["description-proc"]);
  const buyer = pickLocalised(notice["buyer-name"]);
  const publishedAt = parseTedDate(notice["publication-date"]);

  // Deadline: zkus víc TED polí — různé typy notice (DNS, framework,
  // contract) ho mají na jiných úrovních. První neprázdné vyhrává.
  const deadlineDate =
    pickFirst(notice["deadline-receipt-tender-date-lot"]) ??
    pickFirst(notice["deadline-date-part"]) ??
    pickFirst(notice["deadline-receipt-request-date-lot"]);
  const deadlineAt = combineDateAndTime(
    deadlineDate,
    pickFirst(notice["deadline-receipt-tender-time-lot"])
  );

  // Hodnota: sečti všechny lot odhady (TED je vrací jako pole stringů).
  // Když nic, fallback na framework-level total (typické pro DNS/rámcové dohody).
  const estimatedValue =
    sumLotValues(notice["estimated-value-lot"]) ??
    sumLotValues(notice["framework-estimated-value-glo"]) ??
    sumLotValues(notice["framework-maximum-value-glo"]);
  const currency =
    pickFirst(notice["estimated-value-cur-lot"]) ??
    pickFirst(notice["framework-estimated-value-cur-glo"]);

  // Procurement-nature: bere první neprázdnou, ale TED někdy vrací array
  // typu ["services","supplies","services"] — vezmi nejčastější
  const procurementType = majorityOf(notice["contract-nature"]);

  return {
    externalId: `ted:${externalId}`,
    sourceUrl: buildSourceUrl(notice.links, externalId),
    title,
    description,
    contractingAuthority: buyer,
    contractingAuthorityIco: null,
    cpvCodes: dedupeArray(notice["classification-cpv"]),
    nuts: pickNutsCode(notice["place-of-performance"]),
    procurementType,
    procedureType: pickProcedureType(notice["procedure-type"]),
    estimatedValue,
    currency: currency ?? "CZK",
    status: "open",
    publishedAt,
    deadlineAt,
    raw: notice as Record<string, unknown>,
  };
}

/** Vrátí nejčastější hodnotu v poli (modus). Pro contract-nature typu
 *  ["services","supplies","services","services"] vrátí "services". */
function majorityOf(arr: string[] | undefined | null): string | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const counts = new Map<string, number>();
  for (const v of arr) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best: string | null = null;
  let bestCount = -1;
  for (const [k, c] of counts) {
    if (c > bestCount) {
      best = k;
      bestCount = c;
    }
  }
  return best;
}

/** Vybere první NUTS kód (formát CZ080, CZ010…) ignoruje země code (CZE). */
function pickNutsCode(arr: string[] | undefined | null): string | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  for (const v of arr) {
    if (typeof v === "string" && /^CZ\d/.test(v)) return v;
  }
  return null;
}

export const tedAdapter: SourceAdapter = {
  code: "ted-eu",
  name: "TED — Tenders Electronic Daily",
  baseUrl: "https://ted.europa.eu",

  async fetchRecent(options): Promise<FetchResult> {
    const limit = Math.min(options?.limit ?? 50, 250);

    const body = {
      query: "(place-of-performance=CZE) SORT BY publication-date DESC",
      fields: REQUESTED_FIELDS,
      limit,
      page: 1,
      scope: "ALL",
    };

    const res = await fetch(TED_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`TED API responded ${res.status}: ${text.slice(0, 400)}`);
    }

    const data = (await res.json()) as TedResponse;
    const tenders = (data.notices ?? [])
      .map(normalise)
      .filter((t): t is NormalizedTender => t !== null);

    return {
      tenders,
      meta: { totalNoticeCount: data.totalNoticeCount, returned: tenders.length },
    };
  },
};
