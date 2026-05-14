import Link from "next/link";
import { ArrowLeft, GitCompare } from "lucide-react";
import { listRecentChanges } from "@/lib/queries/changes";
import { fieldLabel } from "@/lib/diff";

export const dynamic = "force-dynamic";

const dateTimeFmt = new Intl.DateTimeFormat("cs-CZ", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function ChangesPage() {
  const changes = await listRecentChanges(30, 100);

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1200px] mx-auto">
      <Link
        href="/workspace"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-silver-400 hover:text-silver-100 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Zpět na přehled
      </Link>

      <div className="mt-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-silver-500 inline-flex items-center gap-2">
            <GitCompare className="h-3.5 w-3.5" />
            Změny
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-display tracking-tightest text-silver-50">
            Historie změn tendrů
          </h1>
          <p className="mt-1.5 text-[14px] text-silver-400">
            {changes.length} tendrů s detekovanou změnou za posledních 30 dní.
          </p>
        </div>
      </div>

      {changes.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-ink-900/80 to-ink-950 p-10 text-center text-[13.5px] text-silver-400">
          Zatím žádné změny. Jakmile cron job detekuje rozdíly v ingestnutých
          tendrech, objeví se tady.
        </div>
      ) : (
        <ul className="mt-8 space-y-2">
          {changes.map((c) => {
            const sigStyles =
              c.significance === "critical"
                ? "border-rose-400/25 bg-rose-400/[0.06] text-rose-200"
                : c.significance === "important"
                ? "border-amber-400/25 bg-amber-400/[0.06] text-amber-200"
                : "border-white/[0.08] bg-white/[0.02] text-silver-300";

            const sigLabel =
              c.significance === "critical"
                ? "kritická"
                : c.significance === "important"
                ? "důležitá"
                : "drobná";

            return (
              <li key={c.tenderId}>
                <Link
                  href={`/workspace/tendry/${c.tenderId}`}
                  className="block rounded-lg border border-white/[0.06] bg-ink-900/40 hover:bg-ink-900/70 transition-colors p-4"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[9.5px] text-silver-300 uppercase tracking-[0.08em]">
                        {c.sourceCode}
                      </span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${sigStyles}`}>
                        {sigLabel}
                      </span>
                      <span className="text-[10.5px] text-silver-500 font-mono">
                        {c.tenderExternalId.replace(/^[a-z]+:/, "")}
                      </span>
                    </div>
                    <span className="text-[11px] text-silver-500 tabular-nums">
                      {dateTimeFmt.format(c.lastDetectedAt)}
                    </span>
                  </div>
                  <div className="mt-2 text-[13.5px] text-silver-100 line-clamp-2">
                    {c.tenderTitle}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.fields.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center rounded bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[10.5px] text-silver-300"
                      >
                        {fieldLabel(f)}
                      </span>
                    ))}
                    <span className="text-[10.5px] text-silver-500">
                      {c.changeCount} {c.changeCount === 1 ? "změna" : "změn"} celkem
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
