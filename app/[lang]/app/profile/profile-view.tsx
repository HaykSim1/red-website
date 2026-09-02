"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useMediaUrl } from "@/components/app/media-config-context";
import { Badge } from "@/components/app/ui/badge";
import { Button } from "@/components/app/ui/button";
import { Field } from "@/components/app/ui/field";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { PhotoPicker, type PickedPhoto } from "@/components/app/ui/photo-picker";
import { Alert, LoadingBlock } from "@/components/app/ui/states";
import { useMe } from "@/hooks/app/use-me";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { qk } from "@/lib/app/query-keys";
import type { MeResponse } from "@/lib/app/types";
import type { Locale } from "@/lib/i18n";

export function ProfileView({ lang }: { lang: Locale }) {
  const { me, isSeller, isPending } = useMe();

  if (isPending || !me) {
    return (
      <PageContainer>
        <LoadingBlock rows={3} />
      </PageContainer>
    );
  }

  // Keyed on the account id so the form seeds itself from useState initialisers
  // exactly once. A background refetch of /me then cannot overwrite half-typed
  // fields, and there is no effect racing the render to fill them in.
  return <ProfileForm key={me.id} lang={lang} me={me} isSeller={isSeller} />;
}

function ProfileForm({
  lang,
  me,
  isSeller,
}: {
  lang: Locale;
  me: MeResponse;
  isSeller: boolean;
}) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const mediaUrl = useMediaUrl();

  const [displayName, setDisplayName] = useState(me.display_name ?? "");
  const [shopName, setShopName] = useState(me.shop_name ?? "");
  const [shopAddress, setShopAddress] = useState(me.shop_address ?? "");
  const [sellerPhone, setSellerPhone] = useState(me.seller_phone ?? "");
  const [sellerTelegram, setSellerTelegram] = useState(me.seller_telegram ?? "");
  const [logo, setLogo] = useState<PickedPhoto[]>(() =>
    me.shop_logo_storage_key
      ? [
          {
            storageKey: me.shop_logo_storage_key,
            previewUrl: mediaUrl(me.shop_logo_storage_key) ?? "",
          },
        ]
      : [],
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const saveM = useMutation({
    mutationFn: () =>
      apiJson("/me", {
        method: "PATCH",
        body: JSON.stringify({
          display_name: displayName.trim() || null,
          // Shop and contact fields are seller-only; the API returns 403
          // seller_shop_fields_forbidden if a buyer sends them.
          ...(isSeller
            ? {
                shop_name: shopName.trim() || null,
                shop_address: shopAddress.trim() || null,
                seller_phone: sellerPhone.trim() || null,
                seller_telegram: sellerTelegram.trim() || null,
                shop_logo_storage_key: logo[0]?.storageKey ?? null,
              }
            : {}),
        }),
      }),
    onSuccess: () => {
      setError(null);
      setSaved(true);
      void queryClient.invalidateQueries({ queryKey: qk.me });
    },
    onError: (e) => {
      setSaved(false);
      setError(translateApiError(e, i18n));
    },
  });

  const application = me.seller_application;

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader title={t("tabs.profile")} />

      {error ? (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}
      {saved ? (
        <div className="mb-4">
          <Alert tone="info">{t("common.save")}</Alert>
        </div>
      ) : null}

      {!isSeller ? (
        <section className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container p-6 text-on-primary">
          <h3 className="font-headline text-xl font-bold tracking-tight">
            {t("profile.partnerTitle")}
          </h3>
          <p className="mt-2 max-w-md text-sm opacity-90">{t("profile.partnerBody")}</p>

          {application?.status === "pending" ? (
            <p className="mt-4">
              <Badge tone="neutral">{t("profile.becomeSellerPending")}</Badge>
            </p>
          ) : (
            <>
              {application?.status === "rejected" ? (
                <p className="mt-3 rounded-lg bg-white/15 px-3 py-2 text-sm">
                  {t("profile.sellerApplyRejected")}
                  {application.rejection_reason ? ` — ${application.rejection_reason}` : ""}
                </p>
              ) : null}
              <Link
                href={`/${lang}/app/profile/apply`}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-surface-container-lowest px-6 text-sm font-bold text-primary"
              >
                {t("profile.becomeSeller")}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </>
          )}
        </section>
      ) : null}

      <form
        noValidate
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(false);
          setError(null);
          saveM.mutate();
        }}
      >
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
          <h3 className="mb-4 font-headline text-base font-semibold text-on-surface">
            {t("profile.accountSectionTitle")}
          </h3>
          <div className="space-y-5">
            <Field
              label={t("profile.displayName")}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={120}
            />
            <Field
              label={t("profile.accountPhone")}
              value={me.phone}
              hint={t("profile.accountPhoneHint")}
              readOnly
              disabled
            />
          </div>
        </section>

        {isSeller ? (
          <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <h3 className="mb-4 font-headline text-base font-semibold text-on-surface">
              {t("profile.shopSectionTitle")}
            </h3>
            <div className="space-y-5">
              <Field
                label={t("profile.shopName")}
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                maxLength={120}
              />
              <Field
                label={t("profile.shopAddress")}
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                maxLength={200}
              />
              <div>
                <p className="mb-1 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("profile.shopLogo")}
                </p>
                <p className="mb-3 text-xs text-on-surface-variant">
                  {t("profile.shopLogoRecommendedSize")}
                </p>
                <PhotoPicker purpose="shop_logo" photos={logo} onChange={setLogo} max={1} />
              </div>

              <div className="border-t border-outline-variant/20 pt-5">
                <p className="mb-1 text-sm font-semibold text-on-surface">
                  {t("profile.buyerContactSubtitle")}
                </p>
                <p className="mb-4 text-xs text-on-surface-variant">
                  {t("profile.buyerContactHint")}
                </p>
                <div className="space-y-5">
                  <Field
                    label={t("profile.sellerPhone")}
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    maxLength={32}
                  />
                  <Field
                    label={t("profile.sellerTelegram")}
                    value={sellerTelegram}
                    onChange={(e) => setSellerTelegram(e.target.value)}
                    maxLength={64}
                  />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <Button type="submit" size="lg" loading={saveM.isPending}>
          {t("common.save")}
        </Button>
      </form>
    </PageContainer>
  );
}
