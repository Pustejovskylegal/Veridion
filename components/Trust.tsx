"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "63h", label: "ušetřených hodin týdně" },
  { value: "−74%", label: "snížení compliance rizik" },
  { value: "8×", label: "rychlejší analýza dokumentace" },
  { value: "1", label: "systém pro celý tendr" },
];

const logos = [
  "ČEZ Group",
  "Komerční banka",
  "Škoda Auto",
  "O2 Czech",
  "PPF",
  "Innogy",
  "ČSOB",
  "Avast",
];

export function Trust() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="text-[11px] uppercase tracking-[0.2em] text-silver-400">
            Postaveno pro enterprise
          </div>
          <h2 className="mt-5 text-3xl md:text-5xl font-display tracking-tightest text-balance text-gradient leading-[1.05]">
            Pro týmy, které soutěží o ty nejnáročnější veřejné zakázky.
          </h2>
        </motion.div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06]">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-ink-950 p-8 md:p-10"
            >
              <div className="text-4xl md:text-5xl font-display tracking-tightest text-gradient-accent">
                {s.value}
              </div>
              <div className="mt-4 text-[13px] text-silver-300">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-28">
          <div className="text-center text-[11px] uppercase tracking-[0.2em] text-silver-500 mb-10">
            Důvěra předních českých společností
          </div>
          <div className="marquee overflow-hidden">
            <div className="marquee-track flex gap-16 whitespace-nowrap">
              {[...logos, ...logos].map((l, i) => (
                <span
                  key={i}
                  className="text-lg md:text-xl font-display tracking-tight text-silver-400/60 hover:text-silver-200 transition-colors"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
