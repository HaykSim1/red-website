import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { MyRequestsView } from "./my-requests-view";

export default async function MyRequestsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <MyRequestsView lang={lang} />;
}
