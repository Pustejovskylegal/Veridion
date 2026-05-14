"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import {
  Radar,
  FileSearch,
  GitCompare,
  Users,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react";

export function Features() {
  return (
    <section id="funkce" className="relative py-28 md:py-44">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Platforma"
          title="Inteligence napříč celým životním cyklem tendru."
          sub="Od prvního upozornění po odeslání nabídky — v jednom systému."
        />

        <div className="mt-24 grid grid-cols-12 gap-4 md:gap-5">
          <FeatureCard
            className="col-span-12 lg:col-span-7 min-h-[440px]"
            eyebrow="Tender Intelligence"
            icon={<Radar className="h-4 w-4" />}
            title="Monitoring tendrů ze všech zdrojů, v reálném čase."
            description="AI relevance scoring odděluje signál od šumu podle vašeho oboru a kapacit."
            visual={<MonitoringMock />}
          />

          <FeatureCard
            className="col-span-12 lg:col-span-5 min-h-[440px]"
            eyebrow="Document Analysis"
            icon={<FileSearch className="h-4 w-4" />}
            title="Dokumentace strukturovaná za vteřiny."
            description="Kvalifikace, lhůty a rizika — vše zdrojováno do konkrétní pasáže."
            visual={<DocAnalysisMock />}
          />

          <FeatureCard
            className="col-span-12 lg:col-span-5 min-h-[440px]"
            eyebrow="Change Monitoring"
            icon={<GitCompare className="h-4 w-4" />}
            title="Nikdy nepřehlédnete změnu v zadání."
            description="Verzování dokumentů s upozorněním celého týmu."
            visual={<DiffMock />}
          />

          <FeatureCard
            className="col-span-12 lg:col-span-7 min-h-[440px]"
            eyebrow="Bid Workspace"
            icon={<Users className="h-4 w-4" />}
            title="Jeden prostor pro celý bid tým."
            description="Úkoly, schvalování a komunikace — bez ztracených verzí v mailech."
            visual={<WorkspaceMock />}
          />

          <FeatureCard
            className="col-span-12 min-h-[320px]"
            eyebrow="Compliance Layer"
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Auditovatelná AI se zdrojovanými výstupy."
            description="Pro regulované sektory — bankovnictví, energetiku, zdravotnictví, veřejnou správu."
            visual={<ComplianceMock />}
            horizontal
          />
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
  center = true,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-[11px] uppercase tracking-[0.2em] text-silver-400"
      >
        {eyebrow}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="mt-5 text-3xl md:text-5xl font-display tracking-tightest text-gradient leading-[1.05] text-balance"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-silver-300 leading-relaxed text-balance"
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}

function FeatureCard({
  className = "",
  eyebrow,
  icon,
  title,
  description,
  visual,
  horizontal = false,
}: {
  className?: string;
  eyebrow: string;
  icon: ReactNode;
  title: string;
  description: string;
  visual: ReactNode;
  horizontal?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_-20%,rgba(94,139,255,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline opacity-50" />

      <div
        className={`relative h-full p-7 md:p-9 flex ${
          horizontal ? "flex-col lg:flex-row gap-10 lg:items-center" : "flex-col"
        }`}
      >
        <div className={horizontal ? "lg:w-2/5" : ""}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-silver-400">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-silver-200">
              {icon}
            </span>
            {eyebrow}
          </div>
          <h3 className="mt-5 text-xl md:text-2xl font-display tracking-tight text-silver-50 text-balance max-w-sm">
            {title}
          </h3>
          <p className="mt-4 text-[14px] text-silver-400 leading-relaxed max-w-sm text-balance">
            {description}
          </p>
        </div>

        <div className={`relative ${horizontal ? "lg:w-3/5" : "mt-8 flex-1"}`}>{visual}</div>
      </div>
    </motion.article>
  );
}

/* --- Visual mocks --- */

function MonitoringMock() {
  const items = [
    { code: "VZ-2026-04412", title: "Energetická infrastruktura", score: 94 },
    { code: "VZ-2026-04388", title: "Kyberbezpečnost — ČNB", score: 88 },
    { code: "VZ-2026-04356", title: "Zdravotnický IS — VYS", score: 81 },
    { code: "VZ-2026-04341", title: "Modernizace tramvají", score: 76 },
  ];
  return (
    <div className="relative h-full rounded-xl border border-white/[0.05] bg-ink-900/40 overflow-hidden">
      <div className="absolute inset-0 bg-grid-faint bg-[size:32px_32px] opacity-30" />
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.16em] text-silver-500">Live monitoring</div>
          <div className="flex items-center gap-1.5 text-[10.5px] text-silver-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
            24 zdrojů
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {items.map((it, i) => (
            <motion.li
              key={it.code}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-md border border-white/[0.04] bg-white/[0.015] px-3 py-2.5"
            >
              <span className="text-[10px] font-mono text-silver-500 w-24 shrink-0">{it.code}</span>
              <span className="text-[12.5px] text-silver-100 truncate flex-1">{it.title}</span>
              <span className="inline-flex items-center gap-1.5">
                <div className="h-1 w-14 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-500 to-accent-400"
                    style={{ width: `${it.score}%` }}
                  />
                </div>
                <span className="text-[10.5px] text-silver-200 tabular-nums w-6 text-right">
                  {it.score}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DocAnalysisMock() {
  return (
    <div className="relative h-full rounded-xl border border-white/[0.05] bg-ink-900/40 overflow-hidden p-5">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-silver-500">
        <span>zadavaci-dokumentace.pdf</span>
        <span className="text-accent-300">analyzováno</span>
      </div>

      <div className="mt-4 space-y-2">
        <ExtractedItem icon={<CheckCircle2 className="h-3 w-3" />} label="Kvalifikace" value="Reference ≥ 80 mil. Kč" tone="ok" />
        <ExtractedItem icon={<CheckCircle2 className="h-3 w-3" />} label="Certifikace" value="ISO 27001" tone="ok" />
        <ExtractedItem icon={<AlertTriangle className="h-3 w-3" />} label="Riziko" value="Sankce 0,5 % denně" tone="warn" />
      </div>

      <div className="mt-5 rounded-md border border-accent-500/20 bg-accent-500/[0.04] p-3">
        <div className="flex items-center gap-1.5 text-[10px] text-accent-300">
          <Sparkles className="h-3 w-3" />
          Executive summary
        </div>
        <p className="mt-1.5 text-[11.5px] text-silver-200 leading-relaxed">
          Tendr 142 mil. Kč. Vysoká shoda 94 %. Bankovní záruka při podání 4 %.
        </p>
      </div>
    </div>
  );
}

function ExtractedItem({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "ok" | "warn" | "info";
}) {
  const colors = {
    ok: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    warn: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    info: "text-accent-300 bg-accent-500/10 border-accent-500/20",
  }[tone];
  return (
    <div className="flex items-center gap-3 rounded-md border border-white/[0.05] bg-white/[0.015] px-3 py-2">
      <span className={`inline-flex h-5 w-5 items-center justify-center rounded border ${colors}`}>
        {icon}
      </span>
      <span className="text-[10px] uppercase tracking-[0.14em] text-silver-500 w-24">{label}</span>
      <span className="text-[12px] text-silver-100 truncate">{value}</span>
    </div>
  );
}

function DiffMock() {
  return (
    <div className="relative h-full rounded-xl border border-white/[0.05] bg-ink-900/40 overflow-hidden p-5 font-mono text-[11px] leading-relaxed">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-silver-500">
        <span>priloha-3.pdf</span>
        <span className="text-accent-300">v2 → v3</span>
      </div>
      <div className="mt-5 space-y-1">
        <div className="text-silver-400">Termín plnění:</div>
        <div className="rounded bg-rose-500/[0.08] text-rose-200 px-2 line-through">
          − 30 dní od podpisu smlouvy
        </div>
        <div className="rounded bg-emerald-500/[0.08] text-emerald-200 px-2">
          + 21 dní od podpisu smlouvy
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-[10px] text-silver-500">
        <span>Notifikováno 4 členů týmu</span>
        <span className="text-accent-300">před 2 min</span>
      </div>
    </div>
  );
}

function WorkspaceMock() {
  const cols = [
    {
      title: "To-do",
      items: [{ t: "Doplnit reference", who: "MK", due: "13.05" }],
    },
    {
      title: "V práci",
      items: [
        { t: "Smluvní podmínky", who: "PV", due: "16.05" },
        { t: "Cenová kalkulace", who: "AT", due: "18.05" },
      ],
    },
    {
      title: "Schvalování",
      items: [{ t: "Executive review", who: "CEO", due: "22.05" }],
    },
  ];
  const tones = ["bg-silver-300", "bg-accent-400", "bg-emerald-400"];
  return (
    <div className="relative h-full rounded-xl border border-white/[0.05] bg-ink-900/40 overflow-hidden p-5">
      <div className="text-[10px] uppercase tracking-[0.16em] text-silver-500 mb-4">
        Bid · VZ-2026-04412
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {cols.map((c, i) => (
          <div key={c.title} className="rounded-md border border-white/[0.05] bg-white/[0.015] p-2.5">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${tones[i]}`} />
                <span className="text-[10px] text-silver-400">{c.title}</span>
              </div>
              <Plus className="h-3 w-3 text-silver-500" />
            </div>
            <div className="space-y-1.5">
              {c.items.map((it, j) => (
                <div key={j} className="rounded border border-white/[0.04] bg-ink-900/60 p-2">
                  <div className="text-[11px] text-silver-100 leading-snug">{it.t}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="h-4 w-4 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-[8px] flex items-center justify-center font-medium">
                      {it.who}
                    </span>
                    <span className="text-[9.5px] text-silver-500 tabular-nums">{it.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComplianceMock() {
  return (
    <div className="relative h-full rounded-xl border border-white/[0.05] bg-ink-900/40 overflow-hidden p-6">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-silver-500">
        <Sparkles className="h-3 w-3 text-accent-400" />
        Vysvětlitelný výstup
      </div>
      <p className="mt-4 text-[13.5px] leading-relaxed text-silver-100 max-w-lg">
        <span className="text-accent-300">Rizikem</span> je kombinace bankovní záruky 4 % a krátké
        lhůty splnění. Doporučená rezerva cash-flow{" "}
        <span className="text-silver-50">5,8 mil. Kč</span>.
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {["ZD str. 14", "Příloha 3 § 4", "Zákon 134/2016 § 41"].map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 text-[10.5px] text-silver-300 rounded-full border border-white/[0.06] bg-white/[0.02] px-2 py-1"
          >
            <span className="h-1 w-1 rounded-full bg-accent-400" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
