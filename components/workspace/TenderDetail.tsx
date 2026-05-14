"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Calendar,
  Building2,
  Tag,
  ScrollText,
  Layers,
  ChevronDown,
} from "lucide-react";
import type { TenderDetail as TenderDetailType } from "@/lib/queries/tenders";
import {
  cpvList,
  cpvPrimaryLabel,
  procedureTypeLabel,
  procurementTypeLabel,
} from "@/lib/cpv";

const dateFmt = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const dateTimeFmt = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const numberFmt = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });

function formatValue(val: number | null, currency: string | null): string | null {
  if (val == null) return null;
  const main = val / 100;
  return `${numberFmt.format(Math.round(main))} ${currency ?? "Kč"}`;
}

function daysUntil(date: Date | null) {
  if (!date) return null;
  const ms = date.getTime() - Date.now();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "po termínu", tone: "past" as const };
  if (days === 0) return { label: "končí dnes", tone: "alert" as const };
  if (days <= 7) return { label: `${days} dní`, tone: "alert" as const };
  if (days <= 30) return { label: `${days} dní`, tone: "warn" as const };
  return { label: `${days} dní`, tone: "ok" as const };
}

export function TenderDetail({ tender }: { tender: TenderDetailType }) {
  const [rawOpen, setRawOpen] = useState(false);
  const typeLabel = procurementTypeLabel(tender.procurementType);
  const procLabel = procedureTypeLabel(tender.procedureType);
  const value = formatValue(tender.estimatedValue, tender.currency);
  const deadline = daysUntil(tender.deadlineAt);
  const cpvs = cpvList(tender.cpvCodes, 10);

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1100px] mx-auto">
      {/* Back */}
      <Link
        href="/workspace"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-silver-400 hover:text-silver-100 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zpět na přehled
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] text-silver-300 uppercase tracking-[0.08em]">
            {tender.sourceCode}
          </span>
          {typeLabel && (
            <span className="inline-flex items-center rounded-full bg-accent-500/[0.08] border border-accent-500/15 px-2 py-0.5 text-[10px] text-accent-300">
              {typeLabel}
            </span>
          )}
          <span className="text-[11.5px] text-silver-500 font-mono">
            {tender.externalId.replace(/^[a-z]+:/, "")}
          </span>
        </div>

        <h1 className="mt-4 text-2xl md:text-3xl font-display tracking-tightest text-gradient leading-[1.15] text-balance">
          {tender.title}
        </h1>

        {tender.contractingAuthority && (
          <div className="mt-4 flex items-center gap-2 text-[14px] text-silver-300">
            <Building2 className="h-4 w-4 text-silver-500" />
            <span>{tender.contractingAuthority}</span>
            {tender.contractingAuthorityIco && (
              <span className="text-silver-500 text-[12px]">
                · IČO {tender.contractingAuthorityIco}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={tender.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-silver-50 text-ink-950 px-3 py-2 text-[12.5px] font-medium hover:bg-white transition-colors"
          >
            Otevřít na {tender.sourceName.split("—")[0].trim()}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </motion.div>

      {/* Description */}
      {tender.description && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-10"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-silver-500 mb-3 inline-flex items-center gap-2">
            <ScrollText className="h-3.5 w-3.5" />
            Popis předmětu zakázky
          </div>
          <p className="text-[14.5px] leading-relaxed text-silver-200 whitespace-pre-line">
            {tender.description}
          </p>
        </motion.section>
      )}

      {/* Metadata grid */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06]"
      >
        <MetaCell label="Datum publikace" icon={Calendar}>
          {tender.publishedAt ? dateFmt.format(tender.publishedAt) : "—"}
        </MetaCell>

        <MetaCell label="Termín pro nabídky" icon={Clock}>
          {tender.deadlineAt ? (
            <span className="inline-flex items-center gap-2">
              <span>{dateTimeFmt.format(tender.deadlineAt)}</span>
              {deadline && (
                <span
                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10.5px] border ${
                    deadline.tone === "alert"
                      ? "border-rose-400/20 bg-rose-400/[0.06] text-rose-200"
                      : deadline.tone === "warn"
                      ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-200"
                      : deadline.tone === "past"
                      ? "border-white/[0.06] bg-white/[0.02] text-silver-500"
                      : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                  }`}
                >
                  {deadline.label}
                </span>
              )}
            </span>
          ) : (
            "—"
          )}
        </MetaCell>

        <MetaCell label="Odhadovaná hodnota" icon={Tag}>
          {value ?? "—"}
        </MetaCell>

        <MetaCell label="Druh zakázky" icon={Layers}>
          {typeLabel ?? "—"}
        </MetaCell>

        <MetaCell label="Typ řízení" icon={Layers}>
          {procLabel ?? "—"}
        </MetaCell>

        <MetaCell label="Region (NUTS)" icon={Building2}>
          {tender.nuts ?? "—"}
        </MetaCell>
      </motion.section>

      {/* CPV codes */}
      {cpvs.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8"
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-silver-500 mb-3">
            CPV klasifikace
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cpvs.map((c) => (
              <span
                key={c.code}
                className="inline-flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[12px]"
              >
                <span className="font-mono text-silver-400">{c.code}</span>
                {c.division && (
                  <span className="text-silver-200">{c.division}</span>
                )}
              </span>
            ))}
          </div>
        </motion.section>
      )}

      {/* Raw debug */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12"
      >
        <button
          onClick={() => setRawOpen(!rawOpen)}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-silver-500 hover:text-silver-300 transition-colors"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${rawOpen ? "rotate-180" : ""}`}
          />
          Surová data ze zdroje
        </button>
        {rawOpen && tender.raw && (
          <pre className="mt-3 max-h-96 overflow-auto rounded-lg border border-white/[0.06] bg-ink-950 p-4 text-[10.5px] text-silver-400 font-mono leading-relaxed">
            {JSON.stringify(tender.raw, null, 2)}
          </pre>
        )}
      </motion.section>
    </div>
  );
}

function MetaCell({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-ink-950 p-5">
      <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-silver-500">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-2 text-[13.5px] text-silver-100">{children}</div>
    </div>
  );
}
