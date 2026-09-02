import { notFound } from "next/navigation";

import { AppProviders } from "@/components/app/providers";
import { isLocale, type Locale } from "@/lib/i18n";

import "../app/app.css";

interface LoginLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

/**
 * Bare shell for the sign-in screen — no sidebar, no marketing header. It still
 * needs the provider stack because signing in writes the access token into the
 * auth context that the app section reads.
 */
export default async function LoginLayout({ children, params }: LoginLayoutProps) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang: Locale = raw;

  return (
    <AppProviders lang={lang}>
      <div className="app-root flex min-h-svh flex-col items-center justify-center px-4 py-10">
        {children}
      </div>
    </AppProviders>
  );
}
