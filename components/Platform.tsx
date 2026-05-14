"use client";

import { motion } from "framer-motion";
import {
  Radar,
  Brain,
  ShieldCheck,
  Users,
  Workflow,
  BarChart3,
} from "lucide-react";

const modules = [
  { key: "monitoring", label: "Monitoring", icon: Radar, x: 50, y: 8 },
  { key: "intelligence", label: "Intelligence", icon: Brain, x: 86, y: 30 },
  { key: "compliance", label: "Compliance", icon: ShieldCheck, x: 86, y: 70 },
  { key: "collaboration", label: "Collaboration", icon: Users, x: 50, y: 92 },
  { key: "workflow", label: "Workflow", icon: Workflow, x: 14, y: 70 },
  { key: "analytics", label: "Analytics", icon: BarChart3, x: 14, y: 30 },
];

export function Platform() {
  return (
    <section id="ekosystem" className="relative py-28 md:py-44 overflow-hidden">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid-faint bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[1100px] rounded-full bg-accent-600/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.2em] text-silver-400"
          >
            Ekosystém
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mt-5 text-3xl md:text-5xl lg:text-6xl font-display tracking-tightest text-gradient leading-[1.05] text-balance"
          >
            Jeden systém pro celý životní cyklus tendru.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-silver-300 leading-relaxed text-balance"
          >
            Šest vrstev, jedna inteligence.
          </motion.p>
        </div>

        {/* Graph */}
        <div className="relative mt-24 mx-auto aspect-[1.5/1] max-w-4xl">
          <EcosystemGraph />
        </div>
      </div>
    </section>
  );
}

function EcosystemGraph() {
  // SVG-based connecting graph, percent coords
  return (
    <div className="relative h-full w-full">
      {/* Connectors */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(94,139,255,0.0)" />
            <stop offset="50%" stopColor="rgba(94,139,255,0.6)" />
            <stop offset="100%" stopColor="rgba(94,139,255,0.0)" />
          </linearGradient>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94,139,255,0.6)" />
            <stop offset="60%" stopColor="rgba(94,139,255,0.1)" />
            <stop offset="100%" stopColor="rgba(94,139,255,0)" />
          </radialGradient>
        </defs>

        {/* Faint connection grid (all → all) */}
        {modules.map((a, i) =>
          modules.slice(i + 1).map((b, j) => (
            <line
              key={`${a.key}-${b.key}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.15"
            />
          ))
        )}

        {/* Hub-connected animated lines */}
        {modules.map((m, i) => (
          <g key={`hub-${m.key}`}>
            <line
              x1="50"
              y1="50"
              x2={m.x}
              y2={m.y}
              stroke="url(#line-gradient)"
              strokeWidth="0.25"
              strokeLinecap="round"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="0.6"
              fill="#8CB4FF"
              initial={{ opacity: 0 }}
              animate={{
                cx: [50, m.x],
                cy: [50, m.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.45,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}

        {/* Hub glow */}
        <circle cx="50" cy="50" r="14" fill="url(#hub-glow)" />
      </svg>

      {/* Center node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute inset-0 -m-6 rounded-full bg-accent-500/10 blur-2xl animate-pulse-soft" />
          <div className="relative h-24 w-24 rounded-2xl glass-strong glow-blue flex items-center justify-center">
            <div className="text-center">
              <div className="text-[9px] uppercase tracking-[0.18em] text-silver-400">Core</div>
              <div className="mt-1 text-[12px] font-medium text-silver-50">Veridion AI</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Module nodes */}
      {modules.map((m, i) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              className="group flex flex-col items-center gap-2"
            >
              <div className="relative">
                <div className="absolute inset-0 -m-2 rounded-xl bg-accent-500/0 blur-md group-hover:bg-accent-500/30 transition-colors" />
                <div className="relative h-14 w-14 rounded-xl glass-strong flex items-center justify-center text-silver-100 group-hover:text-accent-300 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[11px] text-silver-200 tracking-tight">{m.label}</div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
