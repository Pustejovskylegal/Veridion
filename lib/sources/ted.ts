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
  "procedure-type"?: string[];
  "deadline-receipt-tender-date-lot"?: string[];
  "estimated-value-lot"?: number[];
  "estimated-value-cur-lot"?: string[];
  "classification-cpv"?: string[];
  "place-of-performance"?: string[];
  "place-performance-nuts-proc"?: string[];
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
  "deadline-receipt-tender-date-lot",
  "estimated-value-lot",
  "estimated-value-cur-lot",
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
  // TED uses formats like "2026-05-13+02:00"
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
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
  const deadlineAt = parseTedDate(pickFirst(notice["deadline-receipt-tender-date-lot"]));
  const valueRaw = pickFirst(notice["estimated-value-lot"]);
  const valueCur = pickFirst(notice["estimated-value-cur-lot"]);

  return {
    externalId: `ted:${externalId}`,
    sourceUrl: buildSourceUrl(notice.links, externalId),
    title,
    description,
    contractingAuthority: buyer,
    contractingAuthorityIco: null,
    cpvCodes: notice["classification-cpv"] ?? null,
    nuts: null, // TED v3 search neexposuje NUTS samostatně; doplníme z NEN/Věstník
    procurementType: pickFirst(notice["contract-nature"]),
    procedureType: pickFirst(notice["procedure-type"]),
    estimatedValue:
      typeof valueRaw === "number" ? Math.round(valueRaw * 100) : null,
    currency: valueCur ?? null,
    status: "open",
    publishedAt,
    deadlineAt,
    raw: notice as Record<string, unknown>,
  };
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
