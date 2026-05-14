"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  Radar,
  GitCompare,
} from "lucide-react";
import type { TenderListItem, WorkspaceStats } from "@/lib/queries/tenders";
import { cpvPrimaryLabel, procurementTypeLabel } from "@/lib/cpv";
import { ChangeBadge } from "./ChangeBadge";

type TenderRowItem = TenderListItem & {
  recentChanges: {
    count: number;
    topSignificance: "critical" | "important" | "minor";
  } | null;
};

type SyncMeta = {
  code: string;
  name: string;
  lastRunAt: Date | null;
  enabled: boolean;
};

const dateFmt = new Intl.DateTimeFormat("cs-CZ", { day: "2-digit", month: "2-digit" });
const dateTimeFmt = new Intl.DateTimeFormat("cs-CZ", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});
const numberFmt = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });

function formatValue(val: number | null, currency: string | null): string | null {
  if (val == null) return null;
  const main = val / 100;
  if (main >= 1_000_000) {
    return `${numberFmt.format(Math.round(main / 1_000_000))} mil. ${currency ?? "Kč"}`;
  }
  if (main >= 1_000) {
    return `${numberFmt.format(Math.round(main / 1_000))} tis. ${currency ?? "Kč"}`;
  }
  return `${numberFmt.format(Math.round(main))} ${currency ?? "Kč"}`;
}

function daysUntil(date: Date | null): { label: string; tone: "ok" | "warn" | "alert" | "past" } | null {
  if (!date) return null;
  const ms = date.getTime() - Date.now();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "po termínu", tone: "past" };
  if (days === 0) return { label: "dnes", tone: "alert" };
  if (days <= 7) return { label: `${days} dní`, tone: "alert" };
  if (days <= 30) return { label: `${days} dní`, tone: "warn" };
  return { label: `${days} dní`, tone: "ok" };
}

export function WorkspaceHome({
  firstName,
  tenders,
  stats,
  syncMeta,
  recentChangesCount,
}: {
  firstName: string;
  tenders: TenderRowItem[];
  stats: WorkspaceStats;
  syncMeta: SyncMeta[];
  recentChangesCount: number;
}) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function triggerSync() {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      if (!res.ok) throw new Error(`Sync failed (${res.status})`);
      window.location.reload();
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : String(e));
      setSyncing(false);
    }
  }

  const lastRun = syncMeta
    .filter((s) => s.lastRunAt)
    .sort(
      (a, b) =>
        new Date(b.lastRunAt!).getTime() - new Date(a.lastRunAt!).getTime()
    )[0];

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1400px] mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-silver-500">
            {dateFmt.format(new Date())}
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-display tracking-tightest text-silver-50">
            Dobrý den, {firstName}.
          </h1>
          <p className="mt-1.5 text-[14px] text-silver-400">
            Sledujeme{" "}
            <span className="text-silver-100">{stats.totalTracked}</span> aktivních
            tendrů, <span className="text-silver-100">{stats.publishedThisWeek}</span> nových
            tento týden.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-silver-500">
          {lastRun?.lastRunAt && (
            <span>
              Aktualizováno{" "}
              <span className="text-silver-300">
                {dateTimeFmt.format(new Date(lastRun.lastRunAt))}
              </span>
            </span>
          )}
          <button
            onClick={triggerSync}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-50 text-silver-100 px-2.5 py-1.5 text-[12px] transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Synchronizuji…" : "Synchronizovat"}
          </button>
        </div>
      </motion.div>

      {syncError && (
        <div className="mt-4 rounded-md border border-rose-400/20 bg-rose-400/[0.06] text-rose-200 text-[12.5px] px-3 py-2">
          {syncError}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Sledované tendry" value={stats.totalTracked.toString()} Icon={Radar} />
        <Stat label="Nové tento týden" value={`+${stats.publishedThisWeek}`} Icon={TrendingUp} />
        <Stat
          label="Změny za 7 dní"
          value={recentChangesCount.toString()}
          Icon={GitCompare}
          href={recentChangesCount > 0 ? "/workspace/zmeny" : undefined}
        />
        <Stat
          label="Termín do 14 dní"
          value={stats.upcomingDeadlines.toString()}
          Icon={AlertTriangle}
        />
      </div>

      {/* Sources status */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-silver-500">
        Zdroje:
        {syncMeta.map((s) => (
          <span
            key={s.code}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 ${
              s.enabled
                ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                : "border-white/[0.06] bg-white/[0.02] text-silver-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                s.enabled ? "bg-emerald-400" : "bg-silver-600"
              }`}
            />
            {s.code}
            {!s.enabled && " · připravujeme"}
          </span>
        ))}
      </div>

      {/* Tenders list */}
      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
          <div>
            <h2 className="text-[14px] font-medium tracking-tight text-silver-50">
              Aktivní zakázky
            </h2>
            <p className="mt-0.5 text-[11px] text-silver-500">
              {tenders.length} nejnovějších tendrů ze sledovaných zdrojů
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-[0.16em] text-silver-500">
            Live · auto-refresh denně
          </span>
        </div>

        {tenders.length === 0 ? (
          <div className="px-5 py-16 text-center text-[13px] text-silver-400">
            Zatím žádné tendry. Klikni na „Synchronizovat" výše.
          </div>
        ) : (
          <ul>
            {tenders.map((t, i) => (
              <TenderRow key={t.id} t={t} index={i} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  Icon,
  href,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
  href?: string;
}) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 p-5 ${
        href ? "hover:border-white/[0.12] transition-colors" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10.5px] uppercase tracking-[0.16em] text-silver-500">
          {label}
        </div>
        <Icon className="h-3.5 w-3.5 text-silver-500" />
      </div>
      <div className="mt-3 text-3xl font-display tracking-tightest text-silver-50 tabular-nums">
        {value}
      </div>
    </motion.div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function TenderRow({ t, index }: { t: TenderRowItem; index: number }) {
  const value = formatValue(t.estimatedValue, t.currency);
  const deadline = daysUntil(t.deadlineAt);
  const published = t.publishedAt ? dateFmt.format(t.publishedAt) : null;
  const typeLabel = procurementTypeLabel(t.procurementType);
  const cpvLabel = cpvPrimaryLabel(t.cpvCodes);

  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.5) }}
    >
      <Link
        href={`/workspace/tendry/${t.id}`}
        className="grid grid-cols-12 items-center px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors gap-3 group"
      >
        <div className="col-span-12 md:col-span-7 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[9.5px] text-silver-300 uppercase tracking-[0.08em]">
              {t.sourceCode}
            </span>
            {typeLabel && (
              <span className="inline-flex items-center rounded-full bg-accent-500/[0.08] border border-accent-500/15 px-2 py-0.5 text-[10px] text-accent-300">
                {typeLabel}
              </span>
            )}
            {t.recentChanges && (
              <ChangeBadge
                count={t.recentChanges.count}
                significance={t.recentChanges.topSignificance}
              />
            )}
            <span className="text-[10.5px] text-silver-500 font-mono truncate">
              {t.externalId.replace(/^[a-z]+:/, "")}
            </span>
            {published && (
              <span className="text-[10px] text-silver-500">· {published}</span>
            )}
          </div>
          <div className="mt-1.5 text-[13.5px] text-silver-100 group-hover:text-white transition-colors line-clamp-2">
            {t.title}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-silver-400">
            {t.contractingAuthority && (
              <span className="truncate max-w-[40ch]">{t.contractingAuthority}</span>
            )}
            {cpvLabel && (
              <>
                <span className="text-silver-600">·</span>
                <span className="text-silver-500">{cpvLabel}</span>
              </>
            )}
          </div>
        </div>

        <div className="col-span-6 md:col-span-2 text-[12px] text-silver-200">
          {value ?? <span className="text-silver-600">—</span>}
        </div>

        <div className="col-span-6 md:col-span-2">
          {deadline ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] border ${
                deadline.tone === "alert"
                  ? "border-rose-400/20 bg-rose-400/[0.06] text-rose-200"
                  : deadline.tone === "warn"
                  ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-200"
                  : deadline.tone === "past"
                  ? "border-white/[0.06] bg-white/[0.02] text-silver-500"
                  : "border-white/[0.06] bg-white/[0.02] text-silver-300"
              }`}
            >
              <Clock className="h-3 w-3" />
              {deadline.label}
            </span>
          ) : (
            <span className="text-[11px] text-silver-600">—</span>
          )}
        </div>

        <div className="col-span-12 md:col-span-1 flex md:justify-end">
          <span className="inline-flex items-center gap-1 text-[11.5px] text-silver-400 group-hover:text-silver-100 transition-colors">
            Detail
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}
