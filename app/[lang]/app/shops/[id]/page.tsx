import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { ShopDetailView } from "./shop-detail-view";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  return <ShopDetailView lang={lang} shopId={id} />;
}
