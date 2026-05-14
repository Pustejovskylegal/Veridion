import { notFound } from "next/navigation";
import { getTenderById } from "@/lib/queries/tenders";
import { getChangesForTender } from "@/lib/queries/changes";
import { TenderDetail } from "@/components/workspace/TenderDetail";

export const dynamic = "force-dynamic";

export default async function TenderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tender = await getTenderById(params.id);
  if (!tender) notFound();
  const changes = await getChangesForTender(tender.id, 50);
  return <TenderDetail tender={tender} changes={changes} />;
}
