import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { MarketView } from "./market-view";

export default async function MarketPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <MarketView lang={lang} />;
}
