"use client";

import { motion } from "framer-motion";
import { DashboardMock } from "./DashboardMock";
import { FloatingCards } from "./FloatingCards";

export function Hero() {
  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background layers */}
      <BackgroundFx />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <a
            href="#funkce"
            className="group inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-[12px] text-silver-200"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-accent-500 opacity-70 animate-ping" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent-400" />
            </span>
            Představujeme Veridion Intelligence Layer
            <span className="text-silver-400 group-hover:text-silver-200 transition-colors">→</span>
          </a>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 text-center font-display text-[44px] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[88px] tracking-tightest text-balance"
        >
          <span className="text-gradient">Veřejné zakázky.</span>
          <br />
          <span className="text-gradient-accent">Znovu promyšlené.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-7 max-w-2xl text-center text-base md:text-lg text-silver-300 leading-relaxed text-balance"
        >
          AI workspace pro monitoring, analýzu a řízení veřejných zakázek — sjednocený do jednoho
          inteligentního systému, navrženého pro náročné enterprise týmy.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-silver-50 text-ink-950 text-sm font-medium px-5 py-3 hover:bg-white transition-colors shadow-[0_8px_30px_-10px_rgba(255,255,255,0.25)]"
          >
            Vyzkoušet zdarma
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#funkce"
            className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm text-silver-100 hover:bg-white/[0.06] transition-colors"
          >
            Prozkoumat platformu
          </a>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 md:mt-24"
        >
          <div className="relative">
            {/* Glow under dashboard */}
            <div className="pointer-events-none absolute -inset-x-20 -top-20 -bottom-32 bg-radial-fade opacity-80" />
            <div className="pointer-events-none absolute -inset-px rounded-[20px] bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-2xl opacity-50" />

            <div className="relative glass-strong rounded-[18px] p-1.5 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)]">
              <DashboardMock />
            </div>

            <FloatingCards />
          </div>

          {/* Bottom fade scrim */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-40 scrim-bottom" />
        </motion.div>
      </div>
    </section>
  );
}

function BackgroundFx() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Vignette gradient */}
      <div className="absolute inset-0 bg-radial-fade" />
      {/* Subtle grid */}
      <div className="absolute inset-x-0 top-0 h-[900px] bg-grid-faint bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      {/* Glow orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[1100px] rounded-full bg-accent-600/20 blur-[120px]" />
      <div className="absolute top-40 -left-32 h-[300px] w-[300px] rounded-full bg-accent-700/10 blur-[100px]" />
      <div className="absolute top-60 -right-32 h-[300px] w-[300px] rounded-full bg-accent-500/10 blur-[100px]" />
      {/* Hairline at top */}
      <div className="absolute inset-x-0 top-[88px] h-px hairline opacity-60" />
    </div>
  );
}
