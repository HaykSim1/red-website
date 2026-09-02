"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/components/app/auth-context";
import { Button } from "@/components/app/ui/button";
import { apiFetch } from "@/lib/app/api-client";
import { translateApiError } from "@/lib/app/error-msg";
import type { Locale } from "@/lib/i18n";

/** Same rule the API enforces on OtpRequestDto — Armenia only, E.164. */
const PHONE_RE = /^\+374\d{8}$/;
const RESEND_COOLDOWN_SEC = 60;
const OTP_LENGTH = 6;

export function LoginForm({ lang }: { lang: Locale }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { signIn, token, ready } = useAuth();

  const [phone, setPhone] = useState("+374");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);
  const prevOtpLenRef = useRef(0);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const phoneOk = PHONE_RE.test(phone.trim());

  // Someone with a live session has no business on the login screen.
  useEffect(() => {
    if (ready && token) router.replace(`/${lang}/app`);
  }, [ready, token, lang, router]);

  useEffect(() => {
    if (resendSecondsLeft <= 0) return;
    const id = setTimeout(() => setResendSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendSecondsLeft]);

  useEffect(() => {
    if (step === "code") codeInputRef.current?.focus();
  }, [step]);

  const requestOtp = useCallback(
    () =>
      apiFetch("/auth/otp/request", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ phone: phone.trim() }),
      }),
    [phone],
  );

  async function sendOtp() {
    if (!phoneOk) {
      setError(t("auth.phoneInvalid"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await requestOtp();
      setCode("");
      setStep("code");
      setResendSecondsLeft(RESEND_COOLDOWN_SEC);
    } catch (e) {
      setError(translateApiError(e, i18n));
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    if (resendSecondsLeft > 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      await requestOtp();
      setResendSecondsLeft(RESEND_COOLDOWN_SEC);
    } catch (e) {
      setError(translateApiError(e, i18n));
    } finally {
      setLoading(false);
    }
  }

  /**
   * Verification goes through our own route handler rather than the API: it keeps
   * the rotating refresh token in an httpOnly cookie and hands back only the
   * short-lived access token.
   */
  const verify = useCallback(
    async (digits: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ phone: phone.trim(), code: digits }),
        });
        const data = (await res.json().catch(() => null)) as
          | { access_token?: string; code?: string; message?: string }
          | null;
        if (!res.ok || !data?.access_token) {
          const key = data?.code ? `errors.${data.code}` : "errors.generic";
          const translated = i18n.t(key);
          setError(translated !== key ? translated : (data?.message ?? t("errors.generic")));
          setCode("");
          prevOtpLenRef.current = 0;
          return;
        }
        signIn(data.access_token);
        router.replace(`/${lang}/app`);
      } catch {
        setError(t("errors.generic"));
      } finally {
        setLoading(false);
      }
    },
    [phone, signIn, router, lang, t, i18n],
  );

  // Auto-submit the moment the sixth digit lands, matching the mobile screen.
  useEffect(() => {
    if (step !== "code") {
      prevOtpLenRef.current = 0;
      return;
    }
    const digits = code.replace(/\D/g, "");
    const reachedFull = digits.length === OTP_LENGTH && prevOtpLenRef.current < OTP_LENGTH;
    prevOtpLenRef.current = digits.length;
    if (loading || !reachedFull) return;
    void verify(digits);
  }, [code, step, loading, verify]);

  return (
    <main className="w-full max-w-sm">
      <div className="flex flex-col items-center text-center">
        {/* The source PNG carries ~40% transparent margin, so the box is larger
            than the mark should appear. */}
        <Image src="/logo.png" alt="Red Auto" width={500} height={500} priority className="mb-1 h-28 w-auto" />
        <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
          {t("web.signInTitle")}
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          {step === "phone" ? t("web.signInSubtitle") : t("auth.enterCode")}
        </p>
      </div>

      <div className="mt-8">
        {step === "phone" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendOtp();
            }}
            noValidate
          >
            <label
              htmlFor="login-phone"
              className="block text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2"
            >
              {t("profile.accountPhone")}
            </label>
            <input
              id="login-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              autoFocus
              placeholder={t("auth.phoneHint")}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, "").slice(0, 12))}
              aria-invalid={phone.length > 4 && !phoneOk ? true : undefined}
              aria-describedby={error ? "login-error" : undefined}
              className="h-14 w-full rounded-lg bg-surface-container-low px-4 text-lg tracking-wide text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" size="lg" fullWidth loading={loading} className="mt-6">
              {t("auth.sendCode")}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void verify(code.replace(/\D/g, ""));
            }}
            noValidate
          >
            <p className="mb-4 text-center text-sm font-medium text-on-surface">{phone}</p>

            <OtpInput
              ref={codeInputRef}
              value={code}
              onChange={setCode}
              disabled={loading}
              label={t("auth.enterCode")}
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              disabled={code.replace(/\D/g, "").length !== OTP_LENGTH}
              className="mt-6"
            >
              {t("auth.verify")}
            </Button>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setError(null);
                  setResendSecondsLeft(0);
                }}
                className="cursor-pointer text-sm font-medium text-on-surface-variant hover:text-on-surface"
              >
                {t("common.back")}
              </button>
              <button
                type="button"
                onClick={() => void resendCode()}
                disabled={resendSecondsLeft > 0 || loading}
                className="cursor-pointer text-sm font-bold text-primary disabled:cursor-not-allowed disabled:text-on-surface-variant"
              >
                {resendSecondsLeft > 0
                  ? t("auth.resendIn", { seconds: resendSecondsLeft })
                  : t("auth.resend")}
              </button>
            </div>
          </form>
        )}

        {error ? (
          <p
            id="login-error"
            role="alert"
            className="mt-4 rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container"
          >
            {error}
          </p>
        ) : null}
      </div>

      <p className="mt-10 text-center text-xs text-on-surface-variant">
        <Link href={`/${lang}`} className="hover:text-on-surface">
          ← {t("web.backToSite")}
        </Link>
      </p>
    </main>
  );
}

/**
 * Six boxes backed by a single input. One field keeps SMS autofill and paste
 * working (per-box inputs break both); the boxes are decorative and marked
 * aria-hidden so screen readers hear one labelled control.
 */
function OtpInput({
  ref,
  value,
  onChange,
  disabled,
  label,
}: {
  ref: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  label: string;
}) {
  const digits = value.replace(/\D/g, "");
  return (
    <div className="relative">
      <label htmlFor="login-otp" className="sr-only">
        {label}
      </label>
      <input
        ref={ref}
        id="login-otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={8}
        value={digits}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
        className="absolute inset-0 h-full w-full cursor-text text-transparent caret-transparent opacity-0"
      />
      <div aria-hidden className="pointer-events-none flex justify-between gap-2">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <span
            key={i}
            className={[
              "flex h-14 flex-1 items-center justify-center rounded-lg bg-surface-container-low",
              "text-xl font-bold text-on-surface transition-shadow",
              i === digits.length && !disabled ? "ring-2 ring-primary/40" : "",
            ].join(" ")}
          >
            {digits[i] ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
