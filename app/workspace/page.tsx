import { currentUser } from "@clerk/nextjs/server";
import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";

export default async function WorkspacePage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? user?.username ?? "tým";

  return <WorkspaceHome firstName={firstName} />;
}
