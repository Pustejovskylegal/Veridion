"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from "lucide-react";

export function DashboardMock() {
  return (
    <div className="relative overflow-hidden rounded-[14px] border border-white/[0.06] bg-gradient-to-b from-ink-900 to-ink-950">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] bg-ink-900/60">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="ml-4 hidden sm:flex items-center gap-1.5 text-[11px] text-silver-500">
            veridion.ai
            <span className="text-silver-600">/</span>
            <span className="text-silver-300">workspace</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-md bg-white/[0.04] border border-white/[0.05] px-2.5 py-1 text-[11px] text-silver-400">
            <Search className="h-3 w-3" />
            <span>Hledat…</span>
            <span className="ml-2 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-silver-300">⌘K</span>
          </div>
          <Bell className="h-3.5 w-3.5 text-silver-400" />
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-[10px] flex items-center justify-center font-medium">
            JN
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 min-h-[440px] md:min-h-[520px]">
        {/* Sidebar */}
        <aside className="hidden md:flex col-span-2 flex-col gap-1 border-r border-white/[0.05] bg-ink-900/40 p-3">
          <NavItem label="Přehled" active />
          <NavItem label="Monitoring" badge="24" />
          <NavItem label="Analýza" />
          <NavItem label="Compliance" />
          <NavItem label="Workspace" />
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-10 p-5 md:p-7">
          {/* Page heading */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-silver-500">
                Workspace
              </div>
              <h3 className="mt-1.5 text-[17px] md:text-xl font-semibold tracking-tight text-silver-50">
                Aktivní zakázky
              </h3>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-accent-500/20 bg-accent-500/[0.06] px-2 py-1 text-[11px] text-accent-300">
              <Sparkles className="h-3 w-3" />
              AI doporučení
            </span>
          </div>

          {/* Stat row */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat label="Sledováno" value="248" delta="+12" />
            <Stat label="Otevřená rizika" value="7" delta="-3" />
            <Stat label="Hodiny týdně" value="63" delta="+18" />
          </div>

          {/* Tender list */}
          <div className="mt-6 rounded-lg border border-white/[0.05] bg-ink-900/40 overflow-hidden">
            <TenderRow
              code="VZ-2026-04412"
              title="Rekonstrukce energetické infrastruktury"
              deadline="14 dní"
              score={94}
              risk="medium"
            />
            <TenderRow
              code="VZ-2026-04388"
              title="Kyberbezpečnostní platforma"
              deadline="9 dní"
              score={88}
              risk="low"
              changed
            />
            <TenderRow
              code="VZ-2026-04356"
              title="Zdravotnický IS — kraj Vysočina"
              deadline="22 dní"
              score={81}
              risk="low"
            />
          </div>

          {/* AI summary + timeline */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-3 rounded-lg border border-white/[0.05] bg-ink-900/40 p-5">
              <div className="flex items-center gap-2 text-[11px] text-silver-400">
                <Sparkles className="h-3.5 w-3.5 text-accent-400" />
                Executive summary
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-silver-200">
                Tendr v rozsahu <span className="text-silver-50">142 mil. Kč</span>. Detekovány{" "}
                <span className="text-amber-300">2 kritické požadavky</span> a změna v příloze č. 3.
              </p>
            </div>

            <div className="md:col-span-2 rounded-lg border border-white/[0.05] bg-ink-900/40 p-5">
              <div className="flex items-center gap-2 text-[11px] text-silver-400">
                <Clock className="h-3.5 w-3.5" />
                Časová osa
              </div>
              <ul className="mt-3 space-y-2.5">
                <TimelineItem icon={<CheckCircle2 className="h-3 w-3" />} label="Otázky k zadání" date="13.05" state="done" />
                <TimelineItem icon={<AlertTriangle className="h-3 w-3" />} label="Aktualizace ZD" date="15.05" state="alert" />
                <TimelineItem icon={<Calendar className="h-3 w-3" />} label="Termín nabídek" date="27.05" state="upcoming" />
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* Scanline accent */}
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.05]">
        <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-accent-400 to-transparent animate-scan-line" />
      </div>
    </div>
  );
}

function NavItem({
  label,
  active,
  badge,
}: {
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12px] transition-colors ${
        active
          ? "bg-white/[0.06] text-silver-50"
          : "text-silver-300 hover:bg-white/[0.03] hover:text-silver-100"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-accent-400" : "bg-white/15"}`} />
        {label}
      </span>
      {badge && (
        <span className="rounded px-1.5 py-0.5 text-[9px] bg-white/[0.06] text-silver-300">
          {badge}
        </span>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-ink-900/40 p-4">
      <div className="text-[10px] uppercase tracking-[0.14em] text-silver-500">{label}</div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-semibold tracking-tight text-silver-50">{value}</span>
        <span className="text-[10.5px] text-emerald-400">
          {delta.startsWith("-") ? `↓ ${delta.slice(1)}` : `↑ ${delta.replace("+", "")}`}
        </span>
      </div>
    </div>
  );
}

function TenderRow({
  code,
  title,
  deadline,
  score,
  risk,
  changed,
}: {
  code: string;
  title: string;
  deadline: string;
  score: number;
  risk: "low" | "medium" | "high";
  changed?: boolean;
}) {
  const riskColor =
    risk === "low" ? "bg-emerald-400" : risk === "medium" ? "bg-amber-400" : "bg-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-12 items-center px-5 py-4 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.015] transition-colors"
    >
      <div className="col-span-7 md:col-span-7 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${riskColor}`} />
          <span className="text-[10.5px] text-silver-500 font-mono">{code}</span>
          {changed && (
            <span className="text-[9px] rounded-full bg-accent-500/10 text-accent-300 px-1.5 py-0.5 border border-accent-500/20">
              změna
            </span>
          )}
        </div>
        <div className="mt-1 text-[13px] text-silver-100 truncate">{title}</div>
      </div>
      <div className="col-span-2 hidden md:flex items-center gap-1.5 text-[11.5px] text-silver-400">
        <Clock className="h-3 w-3" />
        {deadline}
      </div>
      <div className="col-span-5 md:col-span-3 flex items-center justify-end gap-2.5">
        <div className="h-1.5 w-16 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-500 to-accent-400"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-[11.5px] text-silver-100 tabular-nums w-6 text-right">{score}</span>
      </div>
    </motion.div>
  );
}

function TimelineItem({
  icon,
  label,
  date,
  state,
}: {
  icon: React.ReactNode;
  label: string;
  date: string;
  state: "done" | "upcoming" | "alert";
}) {
  const colors = {
    done: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    upcoming: "bg-accent-500/10 text-accent-300 border-accent-500/20",
    alert: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  }[state];

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md border ${colors}`}>
          {icon}
        </span>
        <span className="text-[12px] text-silver-200">{label}</span>
      </div>
      <span className="text-[11px] text-silver-500 tabular-nums">{date}</span>
    </li>
  );
}
