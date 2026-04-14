import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AudiencesSection } from "@/components/home/audiences-section";
import { ContactSection } from "@/components/home/contact-section";
import { FaqTeaserSection } from "@/components/home/faq-teaser-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ValuePropsSection } from "@/components/home/value-props-section";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { StoreDownloadSection } from "@/components/store-download-section";
import { getMarketing } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";
import { isLocale, type Locale } from "@/lib/i18n";
import { getSupportEmail } from "@/lib/support-email";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLocale(raw)) return {};
  const lang = raw;
  const c = getMarketing(lang);
  return buildPageMetadata({
    lang,
    path: "",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang: Locale = raw;
  const c = getMarketing(lang);
  const supportEmail = getSupportEmail();

  return (
    <>
      <HeroSection content={c} />
      <ValuePropsSection content={c} />
      <HowItWorksSection content={c} />
      <AudiencesSection content={c} />
      <FaqTeaserSection content={c} lang={lang} />
      <ScreenshotGallery
        sectionTitle={c.screenshotsSectionTitle}
        emptyMessage={c.screenshotsEmpty}
        items={c.screenshots}
      />
      <ContactSection lang={lang} content={c} supportEmail={supportEmail} />
      <StoreDownloadSection lang={lang} />
    </>
  );
}
