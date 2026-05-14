"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { label: "Platforma", href: "#ekosystem" },
  { label: "Funkce", href: "#funkce" },
  { label: "Bezpečnost", href: "#bezpecnost" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl transition-all duration-500",
            scrolled
              ? "glass-strong px-4 py-2.5 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]"
              : "px-2 py-2"
          )}
        >
          <a href="#" className="flex items-center gap-2.5 group">
            <Logo className="h-6 w-6 text-silver-50" />
            <span className="text-[15px] font-medium tracking-tight text-silver-50">
              Veridion
            </span>
            <span className="hidden sm:inline-flex ml-2 text-[10px] tracking-[0.16em] uppercase text-silver-400 border border-white/10 rounded-full px-2 py-0.5">
              Enterprise
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13.5px] text-silver-300 hover:text-silver-50 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#kontakt"
              className="hidden sm:inline-flex text-[13.5px] text-silver-300 hover:text-silver-50 px-3 py-2 transition-colors"
            >
              Přihlásit se
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-1.5 rounded-full bg-silver-50 text-ink-950 text-[13px] font-medium px-4 py-2 hover:bg-white transition-colors"
            >
              Domluvit demo
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="opacity-70"
              >
                <path
                  d="M3 6h6M6 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
