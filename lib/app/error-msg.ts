import type { i18n as I18n } from 'i18next';

import { ApiError } from './api-client';

/**
 * The API returns stable machine codes plus an English developer message
 * (docs/i18n.md). Clients map `code` to a localized string and fall back to the
 * server text only when we have no translation for that code yet.
 */
export function translateApiError(err: unknown, i18n: I18n): string {
  if (err instanceof ApiError) {
    const key = `errors.${err.body.code}`;
    const msg = i18n.t(key);
    if (msg !== key) return msg;
    if (typeof err.body.message === 'string' && err.body.message.trim()) {
      return err.body.message;
    }
    return i18n.t('errors.generic');
  }
  if (err instanceof Error) return err.message;
  return i18n.t('errors.generic');
}
