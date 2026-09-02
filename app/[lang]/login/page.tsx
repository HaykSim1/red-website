import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";

import { LoginForm } from "./login-form";

interface LoginPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : "hy";
  const titles: Record<Locale, string> = {
    hy: "Մուտք — Red Auto",
    en: "Sign in — Red Auto",
    ru: "Вход — Red Auto",
  };
  return {
    ...buildPageMetadata({ lang, path: "/login", title: titles[lang], description: titles[lang] }),
    // A sign-in screen has no business in search results.
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  return <LoginForm lang={raw} />;
}
