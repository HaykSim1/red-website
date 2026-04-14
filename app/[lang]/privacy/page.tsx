import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalDocumentView } from "@/components/legal-document-view";
import { getPrivacy } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { isLocale, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLocale(raw)) return {};
  const lang = raw;
  const doc = getPrivacy(lang);
  return buildPageMetadata({
    lang,
    path: "privacy",
    title: doc.metaTitle,
    description: doc.metaDescription,
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang: Locale = raw;
  const doc = getPrivacy(lang);

  return (
    <div className="u-section" style={{ background: "var(--color-background)" }}>
      <LegalDocumentView
        lang={lang}
        document={{ pageTitle: doc.pageTitle, sections: doc.sections, lastUpdated: doc.lastUpdated }}
      />
    </div>
  );
}
