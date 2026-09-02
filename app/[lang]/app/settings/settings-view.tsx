"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/components/app/auth-context";
import { Button } from "@/components/app/ui/button";
import { SelectField } from "@/components/app/ui/field";
import { ConfirmDialog } from "@/components/app/ui/modal";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { Alert } from "@/components/app/ui/states";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { qk } from "@/lib/app/query-keys";
import { locales, type Locale } from "@/lib/i18n";

/**
 * The Stitch mockup puts Change Password, Two-Factor Authentication and Active
 * Sessions here. None exist: the only way in is a phone OTP, so there is no
 * password to change and no second factor to add. It also offers a currency
 * picker, but every price in the system is AMD. What is real is language, the
 * disclaimer, signing out, and deleting the account.
 */
export function SettingsView({ lang }: { lang: Locale }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { signOut } = useAuth();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localeM = useMutation({
    mutationFn: (next: Locale) =>
      apiJson("/me", { method: "PATCH", body: JSON.stringify({ preferred_locale: next }) }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: qk.me }),
  });

  const deleteM = useMutation({
    mutationFn: () => apiJson("/me", { method: "DELETE" }),
    onSuccess: () => void signOut(),
    onError: (e) => {
      setConfirmDelete(false);
      setError(translateApiError(e, i18n));
    },
  });

  function changeLocale(next: Locale) {
    // Persist for push/server-side use, then move to the same page in the new
    // locale so the whole UI follows.
    localeM.mutate(next);
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}`);
  }

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader title={t("web.settings")} />

      {error ? (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}

      <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="mb-4 font-headline text-base font-semibold text-on-surface">
          {t("web.languageRegion")}
        </h3>
        <SelectField
          label={t("profile.language")}
          value={lang}
          onChange={(e) => changeLocale(e.target.value as Locale)}
        >
          {locales.map((l) => (
            <option key={l} value={l}>
              {t(`profile.language_${l}`)}
            </option>
          ))}
        </SelectField>
      </section>

      <section className="mt-6 rounded-xl bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="mb-2 font-headline text-base font-semibold text-on-surface">
          {t("profile.disclaimer")}
        </h3>
        <p className="text-sm text-on-surface-variant">{t("profile.disclaimerBody")}</p>
      </section>

      <section className="mt-6 rounded-xl bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="mb-4 font-headline text-base font-semibold text-on-surface">
          {t("web.accountSecurity")}
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => void signOut()}>
            {t("web.signOut")}
          </Button>
          <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
            {t("profile.deleteAccount")}
          </Button>
        </div>
      </section>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => deleteM.mutate()}
        title={t("profile.deleteAccountConfirmTitle")}
        body={t("profile.deleteAccountConfirmMessage")}
        confirmLabel={t("profile.deleteAccountConfirmButton")}
        danger
        loading={deleteM.isPending}
      />
    </PageContainer>
  );
}
