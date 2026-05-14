"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  Plus,
  FileText,
  TrendingUp,
} from "lucide-react";

export function WorkspaceHome({ firstName }: { firstName: string }) {
  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1400px] mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-[11px] uppercase tracking-[0.18em] text-silver-500">
          Pondělí · 14. 5. 2026
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl font-display tracking-tightest text-silver-50">
          Dobré ráno, {firstName}.
        </h1>
        <p className="mt-1.5 text-[14px] text-silver-400">
          Máš <span className="text-silver-100">3 nové změny v dokumentaci</span> a{" "}
          <span className="text-silver-100">7 otevřených rizik</span> k revizi.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Sledované tendry" value="248" delta="+12 tento týden" Icon={TrendingUp} />
        <Stat label="Otevřená rizika" value="7" delta="−3 vs. minulý" Icon={AlertTriangle} />
        <Stat label="Hodiny ušetřené" value="63h" delta="+18 % MoM" Icon={Sparkles} />
        <Stat label="Úspěšnost bidů" value="34%" delta="+6,2 %" Icon={CheckCircle2} />
      </div>

      {/* Tenders + AI panel */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
            <h2 className="text-[14px] font-medium tracking-tight text-silver-50">
              Aktivní zakázky
            </h2>
            <button className="inline-flex items-center gap-1.5 text-[12px] text-silver-400 hover:text-silver-100 transition-colors">
              <Plus className="h-3 w-3" />
              Přidat zakázku
            </button>
          </div>
          <div>
            <TenderRow
              code="VZ-2026-04412"
              title="Rekonstrukce energetické infrastruktury — fáze II"
              org="Ministerstvo dopravy"
              deadline="14 dní"
              score={94}
              risk="medium"
            />
            <TenderRow
              code="VZ-2026-04388"
              title="Dodávka kybernetické bezpečnostní platformy"
              org="ČNB"
              deadline="9 dní"
              score={88}
              risk="low"
              changed
            />
            <TenderRow
              code="VZ-2026-04356"
              title="Implementace zdravotnického IS"
              org="Krajský úřad VYS"
              deadline="22 dní"
              score={81}
              risk="low"
            />
            <TenderRow
              code="VZ-2026-04341"
              title="Modernizace tramvajových vozů"
              org="DPP"
              deadline="31 dní"
              score={76}
              risk="high"
            />
          </div>
        </div>

        {/* AI panel */}
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 p-5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-[12px] text-silver-300">
              <Sparkles className="h-3.5 w-3.5 text-accent-400" />
              Veridion Copilot
            </div>
            <span className="text-[10px] text-silver-500">před 2 min</span>
          </div>
          <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-silver-200">
            <p>
              U tendru <span className="text-silver-50">VZ-2026-04412</span> byla detekována{" "}
              <span className="text-amber-300">kritická změna v příloze č. 3</span>.
            </p>
            <p className="text-silver-400">
              Změna rozšiřuje rozsah požadovaných výkresů z 12 na 18 ks a zkracuje termín plnění o
              9 dní.
            </p>
          </div>
          <button className="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] px-3 py-2 text-[12.5px] text-silver-100 transition-colors">
            Zobrazit diff
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Timeline + activity */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-medium tracking-tight text-silver-50">
              Tento týden
            </h2>
            <span className="text-[10px] text-silver-500">Květen 2026</span>
          </div>
          <ul className="mt-5 space-y-3.5">
            <TimelineItem icon={<CheckCircle2 className="h-3 w-3" />} label="Otázky k zadání — VZ-2026-04412" date="Po 13.05" state="done" />
            <TimelineItem icon={<AlertTriangle className="h-3 w-3" />} label="Aktualizace dokumentace v3" date="St 15.05" state="alert" />
            <TimelineItem icon={<FileText className="h-3 w-3" />} label="Interní review — Executive" date="Pá 22.05" state="pending" />
            <TimelineItem icon={<Calendar className="h-3 w-3" />} label="Termín nabídek — ČNB" date="Po 27.05" state="upcoming" />
          </ul>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 p-5">
          <h2 className="text-[14px] font-medium tracking-tight text-silver-50">Tým</h2>
          <div className="mt-4 space-y-3">
            {[
              { name: "Marie Krátká", role: "Bid lead", color: "#3E6BE0" },
              { name: "Petr Vondráček", role: "Právník", color: "#7C3AED" },
              { name: "Adam Tichý", role: "Kalkulace", color: "#0EA5E9" },
              { name: "Jan Novotný", role: "Compliance", color: "#10B981" },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span
                  className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-medium text-white"
                  style={{ background: m.color }}
                >
                  {m.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div className="min-w-0">
                  <div className="text-[12.5px] text-silver-100 truncate">{m.name}</div>
                  <div className="text-[10.5px] text-silver-500">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full text-[12px] text-silver-400 hover:text-silver-100 transition-colors text-left">
            + Pozvat kolegu
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
  Icon,
}: {
  label: string;
  value: string;
  delta: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 p-5"
    >
      <div className="flex items-center justify-between">
        <div className="text-[10.5px] uppercase tracking-[0.16em] text-silver-500">{label}</div>
        <Icon className="h-3.5 w-3.5 text-silver-500" />
      </div>
      <div className="mt-3 text-3xl font-display tracking-tightest text-silver-50">{value}</div>
      <div className="mt-1 text-[11px] text-silver-400">{delta}</div>
    </motion.div>
  );
}

function TenderRow({
  code,
  title,
  org,
  deadline,
  score,
  risk,
  changed,
}: {
  code: string;
  title: string;
  org: string;
  deadline: string;
  score: number;
  risk: "low" | "medium" | "high";
  changed?: boolean;
}) {
  const riskColor =
    risk === "low" ? "bg-emerald-400" : risk === "medium" ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="grid grid-cols-12 items-center px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015] transition-colors cursor-pointer">
      <div className="col-span-7 md:col-span-6 min-w-0">
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
      <div className="hidden md:block col-span-2 text-[11.5px] text-silver-400 truncate">
        {org}
      </div>
      <div className="hidden md:flex col-span-2 items-center gap-1.5 text-[11.5px] text-silver-400">
        <Clock className="h-3 w-3" />
        {deadline}
      </div>
      <div className="col-span-5 md:col-span-2 flex items-center justify-end gap-2.5">
        <div className="h-1.5 w-16 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-500 to-accent-400"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-[11.5px] text-silver-100 tabular-nums w-6 text-right">
          {score}
        </span>
      </div>
    </div>
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
  state: "done" | "upcoming" | "alert" | "pending";
}) {
  const colors = {
    done: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    upcoming: "bg-accent-500/10 text-accent-300 border-accent-500/20",
    pending: "bg-white/[0.04] text-silver-300 border-white/[0.06]",
    alert: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  }[state];

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md border ${colors}`}>
          {icon}
        </span>
        <span className="text-[13px] text-silver-200">{label}</span>
      </div>
      <span className="text-[11.5px] text-silver-500 tabular-nums">{date}</span>
    </li>
  );
}
