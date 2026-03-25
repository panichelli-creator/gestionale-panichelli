import { redirect } from "next/navigation";

export default function TrainingRecordPage({ params }: { params: { id: string } }) {
  redirect(`/training/${params.id}/edit`);
}