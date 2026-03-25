// app/ui/icons.tsx
import React from "react";

type IconProps = {
  className?: string;
};

function Svg({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ width: "1em", height: "1em", flex: "0 0 auto" }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M16 21c0-3-2.5-5-6-5s-6 2-6 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 21c0-2.2-1.3-3.9-3.3-4.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.4a3.5 3.5 0 0 1 0 6.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M4 7h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 11v7M14 11v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 7l1 14h10l1-14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconBuilding({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M9 21v-6h3v6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19 21V10a2 2 0 0 0-2-2h-1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M7 7h6M7 10h6M7 13h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconGraduation({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M12 3 2 8l10 5 10-5-10-5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6 10v6c0 1.5 2.7 3 6 3s6-1.5 6-3v-6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </Svg>
  );
}