import type { TFunction } from 'i18next';

const locales: Record<string, string> = {
  en: 'en-AM',
  hy: 'hy-AM',
  ru: 'ru-AM',
};

export function formatAmd(amount: string | number, lang: string): string {
  const n = typeof amount === 'string' ? Number(amount) : amount;
  const loc = locales[lang] ?? 'en-AM';
  return new Intl.NumberFormat(loc, {
    style: 'currency',
    currency: 'AMD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDateTime(iso: string, lang: string): string {
  const loc = locales[lang] ?? 'en-AM';
  return new Intl.DateTimeFormat(loc, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function offerConditionLabel(
  c: string,
  t: TFunction,
): string {
  if (c === 'new') return t('offers.condition_new');
  if (c === 'used') return t('offers.condition_used');
  return c;
}

export function offerDeliveryLabel(
  d: string,
  t: TFunction,
): string {
  if (d === 'available') return t('offers.delivery_available');
  if (d === 'pickup_only') return t('offers.delivery_pickup');
  return d;
}
