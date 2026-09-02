"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/lib/i18n";

import { useAuth } from "./auth-context";

/**
 * Client-side gate. The API is the real authority — every route it serves is
 * behind a JWT guard — this only spares the user a screen full of 401s.
 */
export function AuthGuard({ lang, children }: { lang: Locale; children: ReactNode }) {
  const { token, ready } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (ready && !token) router.replace(`/${lang}/login`);
  }, [ready, token, lang, router]);

  if (!ready || !token) {
    return (
      <div className="flex min-h-svh items-center justify-center" role="status" aria-live="polite">
        <span className="text-sm text-on-surface-variant">{t("common.loading")}</span>
      </div>
    );
  }

  return <>{children}</>;
}
