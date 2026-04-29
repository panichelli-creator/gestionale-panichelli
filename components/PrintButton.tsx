"use client";

export default function PrintButton({
  label = "Stampa prospetto",
}: {
  label?: string;
}) {
  return (
    <button className="btn" type="button" onClick={() => window.print()}>
      {label}
    </button>
  );
}