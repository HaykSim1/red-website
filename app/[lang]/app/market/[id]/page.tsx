import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { OpenRequestView } from "./open-request-view";

export default async function OpenRequestPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  return <OpenRequestView lang={lang} requestId={id} />;
}
