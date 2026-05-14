/**
 * Common Procurement Vocabulary (CPV) — EU klasifikace zboží/služeb.
 * Tady mapujeme top-level divize (první 2 cifry) na lidsky čitelný CZ název.
 *
 * Plná taxonomie: https://simap.ted.europa.eu/cpv
 */

const DIVISIONS: Record<string, string> = {
  "03": "Zemědělské a lesnické produkty",
  "09": "Energie, ropa, plyn",
  "14": "Těžební produkty",
  "15": "Potraviny a nápoje",
  "16": "Zemědělské stroje",
  "18": "Oděvy a obuv",
  "19": "Kožené výrobky",
  "22": "Tiskoviny",
  "24": "Chemické produkty",
  "30": "Kancelářská a výpočetní technika",
  "31": "Elektrická zařízení",
  "32": "Vysílací a komunikační technika",
  "33": "Zdravotnické vybavení a léčiva",
  "34": "Dopravní prostředky",
  "35": "Bezpečnostní a obranné vybavení",
  "37": "Hudební nástroje a sport",
  "38": "Laboratorní a měřicí technika",
  "39": "Nábytek a vybavení",
  "41": "Voda",
  "42": "Průmyslové stroje",
  "43": "Důlní a stavební stroje",
  "44": "Stavební materiály",
  "45": "Stavební práce",
  "48": "Software a informační systémy",
  "50": "Servis a údržba",
  "51": "Instalační služby",
  "55": "Hotelové a restaurační služby",
  "60": "Dopravní služby",
  "63": "Logistika a cestovní služby",
  "64": "Pošta a telekomunikace",
  "65": "Veřejné inženýrské sítě",
  "66": "Finanční a pojišťovací služby",
  "70": "Realitní služby",
  "71": "Architektura a inženýrství",
  "72": "Informační technologie",
  "73": "Výzkum a vývoj",
  "75": "Veřejná správa",
  "76": "Služby v ropném průmyslu",
  "77": "Zemědělské a lesnické služby",
  "79": "Obchodní a poradenské služby",
  "80": "Vzdělávání",
  "85": "Zdravotnické a sociální služby",
  "90": "Životní prostředí a odpady",
  "92": "Kultura a rekreace",
  "98": "Ostatní komunitní služby",
};

export function cpvDivisionName(code: string | null | undefined): string | null {
  if (!code) return null;
  const clean = code.replace(/\D/g, "");
  if (clean.length < 2) return null;
  return DIVISIONS[clean.slice(0, 2)] ?? null;
}

/** Vrátí krátký lidsky čitelný popis hlavního CPV kódu */
export function cpvPrimaryLabel(codes: string[] | null | undefined): string | null {
  if (!codes || codes.length === 0) return null;
  const main = codes[0];
  const name = cpvDivisionName(main);
  return name ? `${main} · ${name}` : main;
}

/** Vrátí unikátní seznam (limit 5) ze všech CPV kódů s názvy divize */
export function cpvList(codes: string[] | null | undefined, limit = 5) {
  if (!codes || codes.length === 0) return [];
  const seen = new Set<string>();
  const out: { code: string; division: string | null }[] = [];
  for (const c of codes) {
    if (seen.has(c)) continue;
    seen.add(c);
    out.push({ code: c, division: cpvDivisionName(c) });
    if (out.length >= limit) break;
  }
  return out;
}

/* ---------- Procurement / procedure type ---------- */

const PROCUREMENT_TYPES: Record<string, string> = {
  supplies: "Dodávky",
  services: "Služby",
  works: "Stavební práce",
};

export function procurementTypeLabel(t: string | null | undefined): string | null {
  if (!t) return null;
  return PROCUREMENT_TYPES[t] ?? t;
}

const PROCEDURE_TYPES: Record<string, string> = {
  open: "Otevřené řízení",
  restricted: "Užší řízení",
  negotiated: "Jednací řízení",
  "comp-dial": "Soutěžní dialog",
  "innovation-partnership": "Inovační partnerství",
  "direct-award": "Přímé zadání",
};

export function procedureTypeLabel(t: string | null | undefined): string | null {
  if (!t) return null;
  return PROCEDURE_TYPES[t] ?? t;
}
