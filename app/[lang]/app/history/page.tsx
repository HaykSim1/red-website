import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { HistoryView } from "./history-view";

export default async function HistoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <HistoryView lang={lang} />;
}
