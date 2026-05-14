import { notFound } from "next/navigation";
import { getTenderById } from "@/lib/queries/tenders";
import { TenderDetail } from "@/components/workspace/TenderDetail";

export const dynamic = "force-dynamic";

export default async function TenderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const tender = await getTenderById(params.id);
  if (!tender) notFound();
  return <TenderDetail tender={tender} />;
}
