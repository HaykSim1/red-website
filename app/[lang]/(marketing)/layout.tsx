import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipToContent } from "@/components/skip-to-content";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

import "@/app/globals.css";

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function MarketingLayout({ children, params }: MarketingLayoutProps) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang: Locale = raw;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative" }}>
      <SkipToContent lang={lang} />
      <SiteHeader />
      <main id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
