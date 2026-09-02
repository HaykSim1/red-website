import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { SellerApplyForm } from "./seller-apply-form";

export default async function SellerApplyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <SellerApplyForm lang={lang} />;
}
