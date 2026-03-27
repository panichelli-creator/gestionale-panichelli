import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TrainingRecordPage({ params }: { params: { id: string } }) {
  redirect(`/training/${params.id}/edit`);
}