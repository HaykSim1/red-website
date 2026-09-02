import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const TONE: Record<Tone, string> = {
  neutral: "bg-surface-container-high text-on-surface-variant",
  success: "bg-verified-container text-on-verified",
  warning: "bg-primary-fixed text-on-primary-fixed-variant",
  danger: "bg-error-container text-on-error-container",
  info: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  brand: "bg-primary text-on-primary",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}
