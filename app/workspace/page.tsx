import { currentUser } from "@clerk/nextjs/server";
import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import {
  listRecentTenders,
  getWorkspaceStats,
  getLastSyncMeta,
} from "@/lib/queries/tenders";
import {
  getRecentChangesPerTender,
  countRecentChanges,
} from "@/lib/queries/changes";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? user?.username ?? "tým";

  const [tenders, stats, syncMeta, changesMap, recentChangesCount] =
    await Promise.all([
      listRecentTenders(20),
      getWorkspaceStats(),
      getLastSyncMeta(),
      getRecentChangesPerTender(7),
      countRecentChanges(7),
    ]);

  // Hydrate tenders with change badges
  const tendersWithChanges = tenders.map((t) => ({
    ...t,
    recentChanges: changesMap.get(t.id) ?? null,
  }));

  return (
    <WorkspaceHome
      firstName={firstName}
      tenders={tendersWithChanges}
      stats={stats}
      syncMeta={syncMeta}
      recentChangesCount={recentChangesCount}
    />
  );
}
