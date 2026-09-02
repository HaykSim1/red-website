"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/app/ui/button";
import { Field } from "@/components/app/ui/field";
import { PageContainer, PageHeader } from "@/components/app/ui/page";
import { PhotoPicker, type PickedPhoto } from "@/components/app/ui/photo-picker";
import { Alert, LoadingBlock } from "@/components/app/ui/states";
import { useMe } from "@/hooks/app/use-me";
import { apiJson } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import { qk } from "@/lib/app/query-keys";
import type { Locale } from "@/lib/i18n";

/** Same rule the API enforces on shop_phone. */
const PHONE_RE = /^\+374\d{8}$/;

export function SellerApplyForm({ lang }: { lang: Locale }) {
  const { me, isPending } = useMe();

  if (isPending || !me) {
    return (
      <PageContainer>
        <LoadingBlock rows={3} />
      </PageContainer>
    );
  }

  // Keyed so the phone prefill comes from a useState initialiser rather than an
  // effect that could overwrite what the user typed.
  return <ApplyForm key={me.id} lang={lang} accountPhone={me.phone ?? ""} />;
}

function ApplyForm({ lang, accountPhone }: { lang: Locale; accountPhone: string }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  // Prefilled with the account number; a shop may well publish a different one.
  const [shopPhone, setShopPhone] = useState(accountPhone);
  const [logo, setLogo] = useState<PickedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const applyM = useMutation({
    mutationFn: () =>
      apiJson("/seller-applications", {
        method: "POST",
        body: JSON.stringify({
          shop_name: shopName.trim(),
          shop_address: shopAddress.trim(),
          shop_phone: shopPhone.trim(),
          ...(logo[0] ? { logo_storage_key: logo[0].storageKey } : {}),
        }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.me });
      router.replace(`/${lang}/app/profile`);
    },
    onError: (e) => setError(translateApiError(e, i18n)),
  });

  const detailsOk = Boolean(shopName.trim() && shopAddress.trim());
  const phoneOk = PHONE_RE.test(shopPhone.trim());

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader title={t("profile.sellerApplyTitle")} lead={t("profile.sellerApplyIntro")} />

      {error ? (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}

      <form
        noValidate
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (!detailsOk || !phoneOk) return;
          setError(null);
          applyM.mutate();
        }}
      >
        <Field
          label={t("profile.shopName")}
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          maxLength={120}
          error={touched && !shopName.trim() ? t("profile.sellerApplyRequired") : undefined}
          required
        />
        <Field
          label={t("profile.shopAddress")}
          value={shopAddress}
          onChange={(e) => setShopAddress(e.target.value)}
          maxLength={200}
          error={touched && !shopAddress.trim() ? t("profile.sellerApplyRequired") : undefined}
          required
        />
        <Field
          label={t("profile.shopPhone")}
          type="tel"
          inputMode="tel"
          value={shopPhone}
          onChange={(e) => setShopPhone(e.target.value.replace(/[^\d+]/g, "").slice(0, 12))}
          hint={t("profile.shopPhoneHint")}
          error={touched && !phoneOk ? t("auth.phoneInvalid") : undefined}
          required
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

        <p className="text-xs text-on-surface-variant">{t("profile.sellerApplyReLoginHint")}</p>

        <Button type="submit" size="lg" fullWidth loading={applyM.isPending}>
          {t("profile.submitSellerApply")}
        </Button>
      </form>
    </PageContainer>
  );
}
