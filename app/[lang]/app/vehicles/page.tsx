import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { VehiclesView } from "./vehicles-view";

export default async function VehiclesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <VehiclesView />;
}
