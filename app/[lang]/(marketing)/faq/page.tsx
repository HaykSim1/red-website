import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FaqPageContent } from "@/components/faq-page-content";
import { getFaq } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { isLocale, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLocale(raw)) return {};
  const lang = raw;
  const doc = getFaq(lang);
  return buildPageMetadata({
    lang,
    path: "faq",
    title: doc.metaTitle,
    description: doc.metaDescription,
  });
}

export default async function FaqPage({ params }: PageProps) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang: Locale = raw;
  const doc = getFaq(lang);

  return (
    <div className="u-section" style={{ background: "var(--color-background)" }}>
      <FaqPageContent doc={doc} />
    </div>
  );
}
