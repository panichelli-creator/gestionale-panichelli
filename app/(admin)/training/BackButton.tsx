"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "← Torna indietro" }: { label?: string }) {
  const router = useRouter();

  return (
    <button className="btn" type="button" onClick={() => router.back()}>
      {label}
    </button>
  );
}