import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { RequestDetailView } from "./request-detail-view";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  return <RequestDetailView lang={lang} requestId={id} />;
}
