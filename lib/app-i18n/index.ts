import i18next, { type i18n as I18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import hy from './hy.json';
import ru from './ru.json';

import type { Locale } from '@/lib/i18n';

/**
 * The app section reuses the mobile bundles verbatim (mobile/i18n/*.json), which
 * are authored for i18next — plural suffixes and {{interpolation}} included.
 * Copying them rather than re-authoring keeps 249 keys × 3 locales identical
 * across the two clients; the cost is that new strings must be added in both
 * places. Marketing pages keep their own typed content modules and are untouched.
 */
const resources = {
  en: { translation: en },
  hy: { translation: hy },
  ru: { translation: ru },
} as const;

let instance: I18n | null = null;

export function getAppI18n(locale: Locale): I18n {
  if (!instance) {
    instance = i18next.createInstance();
    void instance.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: 'hy',
      interpolation: { escapeValue: false },
      returnNull: false,
    });
  } else if (instance.language !== locale) {
    void instance.changeLanguage(locale);
  }
  return instance;
}
