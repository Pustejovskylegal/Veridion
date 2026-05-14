import { Logo } from "./Logo";

const cols = [
  {
    title: "Platforma",
    items: ["Monitoring zakázek", "AI analýza dokumentace", "Compliance", "Sledování změn", "Bid workspace"],
  },
  {
    title: "Společnost",
    items: ["O nás", "Kariéra", "Bezpečnost", "Kontakt"],
  },
  {
    title: "Zdroje",
    items: ["Dokumentace", "Změny", "Status", "Právní informace"],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-32">
      <div className="absolute inset-x-0 top-0 h-px hairline" />
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo className="h-6 w-6" />
              <span className="text-silver-50 font-medium tracking-tight">Veridion</span>
            </div>
            <p className="mt-4 text-sm text-silver-400 max-w-xs leading-relaxed">
              Inteligentní workspace pro celý životní cyklus veřejných zakázek. Postaveno pro týmy, které soutěží
              o ty největší tendry.
            </p>
            <p className="mt-8 text-xs text-silver-500">Praha · Česká republika</p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-[11px] uppercase tracking-[0.18em] text-silver-400 mb-4">
                {c.title}
              </h4>
              <ul className="space-y-3">
                {c.items.map((i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-sm text-silver-200 hover:text-silver-50 transition-colors"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-silver-500">
            © {new Date().getFullYear()} Veridion Systems s.r.o. Všechna práva vyhrazena.
          </p>
          <div className="flex items-center gap-6 text-xs text-silver-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              Všechny systémy online
            </span>
            <a href="#" className="hover:text-silver-200 transition-colors">Soukromí</a>
            <a href="#" className="hover:text-silver-200 transition-colors">Podmínky</a>
            <a href="#" className="hover:text-silver-200 transition-colors">DPA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
