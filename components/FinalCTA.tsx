"use client";

import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section id="demo" className="relative py-32 md:py-44 overflow-hidden">
      {/* Cinematic background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid-faint bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-60" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[1300px] rounded-full bg-accent-600/15 blur-[160px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[700px] rounded-full bg-accent-400/15 blur-[120px]" />
        {/* Ridges */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full opacity-30"
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
        >
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={50 + i * 18}
              x2="800"
              y2={50 + i * 18}
              stroke="url(#ridge)"
              strokeWidth="0.5"
            />
          ))}
          <defs>
            <linearGradient id="ridge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(140,180,255,0)" />
              <stop offset="50%" stopColor="rgba(140,180,255,0.4)" />
              <stop offset="100%" stopColor="rgba(140,180,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-[12px] text-silver-200"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
          Brzy spouštíme · early access
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-[88px] font-display tracking-tightest leading-[1.02] text-balance"
        >
          <span className="text-gradient">Pracujte s každým tendrem</span>
          <br />
          <span className="text-gradient-accent">s naprostou jistotou.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-7 mx-auto max-w-2xl text-base md:text-lg text-silver-300 leading-relaxed text-balance"
        >
          Veridion proměňuje roztříštěné procesy veřejných zakázek v jeden inteligentní
          workspace — auditovatelný, vysvětlitelný a navržený pro náročné enterprise týmy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#kontakt"
            className="group relative inline-flex items-center gap-2 rounded-full bg-silver-50 text-ink-950 text-sm font-medium px-6 py-3.5 hover:bg-white transition-colors shadow-[0_10px_50px_-10px_rgba(255,255,255,0.35)]"
          >
            <span className="absolute -inset-px rounded-full bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400 opacity-0 group-hover:opacity-100 blur transition-opacity" />
            <span className="relative inline-flex items-center gap-2">
              Požádat o přístup
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 6h6M6 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm text-silver-100 hover:bg-white/[0.06] transition-colors"
          >
            Promluvit se sales
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 inline-flex items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-silver-500"
        >
          <span>EU-only deployment</span>
          <span className="h-1 w-1 rounded-full bg-silver-600" />
          <span>SOC 2 · ISO 27001</span>
          <span className="h-1 w-1 rounded-full bg-silver-600" />
          <span>99,95 % SLA</span>
        </motion.div>
      </div>
    </section>
  );
}
