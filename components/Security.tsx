"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ScrollText, Eye, Server, KeyRound } from "lucide-react";
import { SectionHeader } from "./Features";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Enterprise bezpečnost",
    desc: "Šifrování AES-256 a TLS 1.3. SSO, SCIM, role-based access.",
  },
  {
    icon: ScrollText,
    title: "Auditní stopa",
    desc: "Každá akce v neměnitelném logu. Plně exportovatelné.",
  },
  {
    icon: Eye,
    title: "Vysvětlitelná AI",
    desc: "Každý výstup zdrojován do konkrétní pasáže dokumentu.",
  },
  {
    icon: Server,
    title: "EU infrastruktura",
    desc: "Geo-redundantní deployment v EU. SLA 99,95 %.",
  },
];

const dataPolicies = [
  { label: "Data residency", value: "EU only" },
  { label: "Šifrování", value: "AES-256 / TLS 1.3" },
  { label: "Model training", value: "Vaše data nikdy" },
  { label: "Zálohování", value: "PITR · 30 dní" },
];

export function Security() {
  return (
    <section id="bezpecnost" className="relative py-28 md:py-44">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Enterprise trust"
          title="Bezpečnost na úrovni kritické infrastruktury."
          sub="Veridion pracuje s dokumenty největších veřejných investic. Tomu odpovídá i naše architektura."
        />

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 p-8 md:p-10"
              >
                <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-silver-100 group-hover:text-accent-300 group-hover:border-accent-500/30 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg md:text-xl font-medium tracking-tight text-silver-50">
                  {p.title}
                </h3>
                <p className="mt-3 text-[14px] text-silver-400 leading-relaxed max-w-xs">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Data & privacy strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mt-6 relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-ink-900 via-navy-900/40 to-ink-950"
        >
          <div className="absolute inset-0 bg-grid-faint bg-[size:48px_48px] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 p-10 md:p-14 items-center">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-silver-400">
                <KeyRound className="h-3.5 w-3.5" />
                Data & privacy
              </div>
              <h3 className="mt-4 text-2xl md:text-3xl font-display tracking-tightest text-gradient leading-[1.1] text-balance">
                Vaše data zůstávají vaše.
              </h3>
              <div className="mt-8 flex items-center gap-2 flex-wrap text-[11px] text-silver-400">
                <Badge label="SOC 2" />
                <Badge label="ISO 27001" />
                <Badge label="GDPR" />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-xl border border-white/[0.06] bg-ink-950/60 overflow-hidden">
                {dataPolicies.map((d, i) => (
                  <div
                    key={d.label}
                    className={`flex items-center justify-between px-6 py-4 text-[13.5px] ${
                      i !== dataPolicies.length - 1 ? "border-b border-white/[0.04]" : ""
                    }`}
                  >
                    <span className="text-silver-400">{d.label}</span>
                    <span className="text-silver-100 font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-silver-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {label}
    </span>
  );
}
