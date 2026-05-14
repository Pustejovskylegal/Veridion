import { currentUser } from "@clerk/nextjs/server";
import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import {
  listRecentTenders,
  getWorkspaceStats,
  getLastSyncMeta,
} from "@/lib/queries/tenders";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? user?.username ?? "tým";

  const [tenders, stats, syncMeta] = await Promise.all([
    listRecentTenders(20),
    getWorkspaceStats(),
    getLastSyncMeta(),
  ]);

  return (
    <WorkspaceHome
      firstName={firstName}
      tenders={tenders}
      stats={stats}
      syncMeta={syncMeta}
    />
  );
}
