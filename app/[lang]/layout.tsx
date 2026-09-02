import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Validates the locale segment for every route below it. Chrome lives one level
 * down, in the route groups: (marketing) keeps the site header/footer, (app) and
 * (auth) render the product shell instead.
 */
export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return children;
}
