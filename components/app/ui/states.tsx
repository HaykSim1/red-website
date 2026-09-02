"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./button";

export function Alert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "info" }) {
  return (
    <p
      role="alert"
      className={
        tone === "error"
          ? "rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container"
          : "rounded-lg bg-surface-container px-4 py-3 text-sm text-on-surface-variant"
      }
    >
      {children}
    </p>
  );
}

export function EmptyState({
  icon = "inbox",
  title,
  body,
  action,
}: {
  icon?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="material-symbols-outlined mb-3 text-[40px] text-on-surface-variant/40">
        {icon}
      </span>
      <p className="font-headline text-base font-semibold text-on-surface">{title}</p>
      {body ? <p className="mt-1 max-w-sm text-sm text-on-surface-variant">{body}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="material-symbols-outlined mb-3 text-[40px] text-error/60">error</span>
      <p className="max-w-sm text-sm text-on-surface-variant">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-6" onClick={onRetry}>
          {t("common.retry")}
        </Button>
      ) : null}
    </div>
  );
}

/** Shimmering placeholder block; `aria-hidden` because the live region says "loading". */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-surface-container ${className}`} />;
}

export function LoadingBlock({ rows = 3 }: { rows?: number }) {
  const { t } = useTranslation();
  return (
    <div role="status" aria-live="polite" aria-busy>
      <span className="sr-only">{t("common.loading")}</span>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
