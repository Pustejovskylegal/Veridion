import Link from "next/link";
import { Logo } from "./Logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left — form */}
      <section className="relative flex flex-col px-6 py-10 sm:px-12 lg:px-16">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <Logo className="h-6 w-6" />
          <span className="text-[15px] font-medium tracking-tight text-silver-50">
            Veridion
          </span>
        </Link>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-display tracking-tightest text-gradient leading-[1.1]">
                {title}
              </h1>
              <p className="mt-3 text-silver-400 text-[14.5px] leading-relaxed">
                {subtitle}
              </p>
            </div>
            {children}
          </div>
        </div>

        <div className="text-[11.5px] text-silver-500 flex items-center gap-4">
          <Link href="/" className="hover:text-silver-200 transition-colors">
            ← Zpět na veridion.cz
          </Link>
          <span className="text-silver-700">·</span>
          <span>EU-only · SOC 2 · ISO 27001</span>
        </div>
      </section>

      {/* Right — branded panel */}
      <aside className="relative hidden lg:flex overflow-hidden bg-ink-950 border-l border-white/[0.04]">
        {/* Background */}
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-faint bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-accent-600/15 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-accent-400/10 blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="text-[11px] uppercase tracking-[0.22em] text-silver-400">
            Enterprise · CZ
          </div>

          <div>
            <h2 className="text-4xl xl:text-5xl font-display tracking-tightest text-gradient-accent leading-[1.05] max-w-md">
              Inteligentní workspace pro veřejné zakázky.
            </h2>
            <p className="mt-6 text-silver-300 text-[15px] leading-relaxed max-w-md">
              Sjednocený systém pro monitoring, analýzu a řízení tendrů. Auditovatelná AI s
              vysvětlitelnými výstupy.
            </p>

            <ul className="mt-10 space-y-3 max-w-md">
              {[
                "Monitoring tendrů ze všech zdrojů v reálném čase",
                "AI analýza zadávací dokumentace za vteřiny",
                "Sledování změn s upozorněním celého týmu",
                "Auditní stopa pro každou akci AI i uživatele",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-[13.5px] text-silver-200"
                >
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-accent-400 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-silver-500">
            <span>EU-only deployment</span>
            <span className="h-1 w-1 rounded-full bg-silver-600" />
            <span>99,95 % SLA</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
