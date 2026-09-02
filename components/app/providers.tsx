"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

import { getAppI18n } from "@/lib/app-i18n";
import type { Locale } from "@/lib/i18n";

import { AuthProvider } from "./auth-context";
import { MediaConfigProvider } from "./media-config-context";

/**
 * Provider stack for the whole authenticated section, mirroring the order in
 * mobile/app/_layout.tsx: query client → media config → auth → i18n.
 * AuthProvider needs the query client (it clears the cache on sign-out), so it
 * has to sit inside QueryClientProvider.
 */
export function AppProviders({ lang, children }: { lang: Locale; children: ReactNode }) {
  // One client per mount, never recreated on re-render.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            // The tab can sit open for hours; treat data as stale on return
            // rather than showing yesterday's offers.
            refetchOnWindowFocus: true,
            staleTime: 30_000,
          },
        },
      }),
  );
  // <html lang> is already kept in step with the URL by <LangAttribute /> in the
  // root layout, so nothing to do here.
  const i18n = getAppI18n(lang);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider lang={lang}>
          <MediaConfigProvider>{children}</MediaConfigProvider>
        </AuthProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
