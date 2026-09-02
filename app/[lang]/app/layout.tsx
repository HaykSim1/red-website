import { notFound } from "next/navigation";

import { AppProviders } from "@/components/app/providers";
import { AuthGuard } from "@/components/app/auth-guard";
import { AppShell } from "@/components/app/shell/app-shell";
import { isLocale, type Locale } from "@/lib/i18n";

import "./app.css";

interface AppLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

/** Nothing under /app belongs in search results — it is all behind a session. */
export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang: Locale = raw;

  return (
    <AppProviders lang={lang}>
      <AuthGuard lang={lang}>
        <AppShell lang={lang}>{children}</AppShell>
      </AuthGuard>
    </AppProviders>
  );
}
