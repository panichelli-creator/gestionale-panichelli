"use client";

import { useFormStatus } from "react-dom";

export default function ConfirmSubmitButton({
  children,
  confirmMessage = "Confermi l’operazione?",
  className = "btn primary",
}: {
  children: React.ReactNode;
  confirmMessage?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={className}
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirmMessage && !confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {pending ? "Salvo..." : children}
    </button>
  );
}