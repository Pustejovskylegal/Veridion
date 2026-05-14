import { GitCompare } from "lucide-react";

export function ChangeBadge({
  count,
  significance,
}: {
  count: number;
  significance: "critical" | "important" | "minor";
}) {
  if (count <= 0) return null;
  const styles =
    significance === "critical"
      ? "border-rose-400/25 bg-rose-400/[0.08] text-rose-200"
      : significance === "important"
      ? "border-amber-400/25 bg-amber-400/[0.08] text-amber-200"
      : "border-white/[0.08] bg-white/[0.03] text-silver-300";
  const label =
    significance === "critical"
      ? "kritická změna"
      : significance === "important"
      ? "důležitá změna"
      : count === 1
      ? "změna"
      : "změny";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${styles}`}
      title={`${count} změn za 7 dní`}
    >
      <GitCompare className="h-2.5 w-2.5" />
      {count > 1 ? `${count} ${label}` : label}
    </span>
  );
}
