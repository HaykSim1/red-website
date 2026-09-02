"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { isValidVinFormat, normalizeVin, VIN_LENGTH } from "@/lib/app/vin";
import { decodeVinFromVpic } from "@/lib/app/vpic-decode-vin";

export type VinAutofill = {
  brand: string;
  model: string;
  year: string;
  engine: string;
};

/** Typing pause before an automatic lookup fires — same as the mobile field. */
const DECODE_DEBOUNCE_MS = 600;

/**
 * VIN input that looks the vehicle up on NHTSA vPIC and fills in the rest of the
 * form. Mirrors mobile's VinFieldWithDecode: it fires by itself once the field
 * holds a complete 17-character VIN, and the button is there for a manual retry.
 *
 * vPIC is a public US service with no key and no auth, called straight from the
 * browser. It only ever knows about VINs it has records for, so a miss is normal
 * and never blocks the form — brand/model/year stay editable by hand.
 */
export function VinField({
  value,
  onChange,
  onAutofill,
  label,
}: {
  value: string;
  onChange: (vin: string) => void;
  onAutofill: (payload: VinAutofill) => void;
  label?: string;
}) {
  const { t } = useTranslation();
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  /** Last VIN already looked up — stops a repeat call and a repeat message. */
  const decodedVinRef = useRef<string | null>(null);
  /**
   * Callers pass an inline arrow, so onAutofill has a new identity every render.
   * Holding it in a ref keeps runDecode stable — otherwise the debounce effect
   * tears down and restarts on every unrelated re-render (typing in the brand
   * field, say) and the pending lookup never fires.
   */
  const onAutofillRef = useRef(onAutofill);
  onAutofillRef.current = onAutofill;

  const runDecode = useCallback(
    async (vin: string) => {
      if (!isValidVinFormat(vin)) {
        setMessage({ tone: "error", text: t("vehicles.vinCheckAndRetry") });
        return;
      }
      decodedVinRef.current = vin;
      setBusy(true);
      setMessage(null);
      try {
        const result = await decodeVinFromVpic(vin);
        if (!result.ok) {
          // Network vs not-found is not a distinction the user can act on, so
          // only the unreachable case gets its own wording.
          setMessage({
            tone: "error",
            text:
              result.messageKey === "network"
                ? t("vehicles.vinDecodeNetwork")
                : t("vehicles.vinCheckAndRetry"),
          });
          // Let the same VIN be retried after a failure.
          decodedVinRef.current = null;
          return;
        }
        onAutofillRef.current({
          brand: result.brand,
          model: result.model,
          year: result.year,
          engine: result.engine,
        });
        setMessage({
          tone: "success",
          text: [result.brand, result.model, result.year].filter(Boolean).join(" "),
        });
      } finally {
        setBusy(false);
      }
    },
    [t],
  );

  // Automatic lookup once the field holds a well-formed VIN.
  useEffect(() => {
    const vin = normalizeVin(value);
    if (vin.length !== VIN_LENGTH) {
      // Shorter again because the user is editing — let the next complete VIN re-fire.
      decodedVinRef.current = null;
      return;
    }
    if (vin === decodedVinRef.current) return;
    const timer = setTimeout(() => void runDecode(vin), DECODE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, runDecode]);

  const describedBy = `${id}-status`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant"
      >
        {label ?? t("vehicles.vin")}
      </label>

      <div className="flex h-12 items-center gap-1 rounded-lg bg-surface-container-low pr-1 focus-within:ring-2 focus-within:ring-primary/30">
        <input
          id={id}
          value={value}
          onChange={(e) => {
            onChange(normalizeVin(e.target.value).slice(0, VIN_LENGTH));
            setMessage(null);
          }}
          placeholder={t("vehicles.vinPlaceholder")}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={VIN_LENGTH}
          disabled={busy}
          aria-describedby={message ? describedBy : undefined}
          className="h-full min-w-0 flex-1 bg-transparent px-4 font-mono text-sm tracking-wider text-on-surface placeholder:font-sans placeholder:tracking-normal placeholder:text-on-surface-variant/60 focus:outline-none disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => void runDecode(normalizeVin(value))}
          disabled={busy || value.trim() === ""}
          aria-label={t("vehicles.decodeVin")}
          title={t("vehicles.decodeVin")}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-primary hover:bg-surface-variant/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          ) : (
            <span className="material-symbols-outlined text-[22px]">cloud_download</span>
          )}
        </button>
      </div>

      {message ? (
        <p
          id={describedBy}
          role={message.tone === "error" ? "alert" : "status"}
          className={`mt-1.5 text-xs ${
            message.tone === "error" ? "text-error" : "text-on-verified"
          }`}
        >
          {message.tone === "success" ? (
            <span className="material-symbols-outlined mr-1 align-middle text-[14px]">
              check_circle
            </span>
          ) : null}
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
