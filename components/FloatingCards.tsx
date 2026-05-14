"use client";

import { motion } from "framer-motion";
import { AlertTriangle, FileEdit, Clock, ShieldCheck } from "lucide-react";

const cards = [
  {
    title: "Detekováno 4 kvalifikační požadavky",
    sub: "VZ-2026-04412 · Ministerstvo dopravy",
    icon: ShieldCheck,
    tone: "blue",
    pos: "left-[-2%] top-[18%]",
    delay: 0.9,
    rotate: -3,
  },
  {
    title: "Kritická změna v dokumentaci",
    sub: "Příloha č. 3 · verze 2026-05-08",
    icon: FileEdit,
    tone: "amber",
    pos: "right-[-3%] top-[8%]",
    delay: 1.05,
    rotate: 3,
  },
  {
    title: "Termín se blíží — 9 dní",
    sub: "ČNB · Kyberbezpečnostní platforma",
    icon: Clock,
    tone: "neutral",
    pos: "right-[-1%] bottom-[14%]",
    delay: 1.2,
    rotate: -2,
  },
  {
    title: "Identifikováno compliance riziko",
    sub: "Bankovní záruka — vyhláška § 41",
    icon: AlertTriangle,
    tone: "rose",
    pos: "left-[-3%] bottom-[8%]",
    delay: 1.35,
    rotate: 2,
  },
] as const;

const toneStyles: Record<string, { dot: string; icon: string; ring: string }> = {
  blue: {
    dot: "bg-accent-400",
    icon: "text-accent-300 bg-accent-500/10 border-accent-500/20",
    ring: "shadow-[0_0_0_1px_rgba(94,139,255,0.15),0_20px_40px_-20px_rgba(94,139,255,0.4)]",
  },
  amber: {
    dot: "bg-amber-400",
    icon: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    ring: "shadow-[0_0_0_1px_rgba(251,191,36,0.12),0_20px_40px_-20px_rgba(251,191,36,0.3)]",
  },
  rose: {
    dot: "bg-rose-400",
    icon: "text-rose-300 bg-rose-400/10 border-rose-400/20",
    ring: "shadow-[0_0_0_1px_rgba(251,113,133,0.12),0_20px_40px_-20px_rgba(251,113,133,0.3)]",
  },
  neutral: {
    dot: "bg-silver-200",
    icon: "text-silver-200 bg-white/[0.06] border-white/[0.08]",
    ring: "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_40px_-20px_rgba(0,0,0,0.6)]",
  },
};

export function FloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {cards.map((c, i) => {
        const tone = toneStyles[c.tone];
        const Icon = c.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, rotate: c.rotate }}
            animate={{ opacity: 1, y: 0, rotate: c.rotate }}
            transition={{
              duration: 0.9,
              delay: c.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute ${c.pos} max-w-[280px]`}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 0.4 }}
              className={`glass-strong rounded-xl px-3.5 py-3 ${tone.ring}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${tone.icon}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${tone.dot} animate-pulse-soft`} />
                    <span className="text-[10px] uppercase tracking-[0.14em] text-silver-400">
                      Veridion AI
                    </span>
                  </div>
                  <div className="mt-0.5 text-[12.5px] font-medium text-silver-50 leading-snug">
                    {c.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-silver-400 truncate">{c.sub}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
