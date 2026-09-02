import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { OfferEditor } from "./offer-editor";

export default async function OfferPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  return <OfferEditor lang={lang} requestId={id} />;
}
