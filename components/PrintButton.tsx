"use client";

export default function PrintButton() {
  return (
    <button
      className="btn"
      onClick={() => window.print()}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      🖨️ Stampa
    </button>
  );
}