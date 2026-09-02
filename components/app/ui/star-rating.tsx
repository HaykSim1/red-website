"use client";

import { useTranslation } from "react-i18next";

/** Read-only star row. */
export function Stars({ score, size = 16 }: { score: number; size?: number }) {
  return (
    <span className="inline-flex" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="material-symbols-outlined text-primary"
          style={{
            fontSize: size,
            fontVariationSettings: `'FILL' ${n <= Math.round(score) ? 1 : 0}, 'wght' 400`,
          }}
        >
          star
        </span>
      ))}
    </span>
  );
}

/** Interactive 1–5 picker, exposed as a radio group so it is keyboard-operable. */
export function StarPicker({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const { t } = useTranslation();
  return (
    <fieldset>
      <legend className="mb-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input
              type="radio"
              name="rating-score"
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="sr-only peer"
            />
            <span
              className="material-symbols-outlined text-[32px] text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
              style={{ fontVariationSettings: `'FILL' ${n <= value ? 1 : 0}, 'wght' 400` }}
            >
              star
            </span>
            <span className="sr-only">{t("shop.reviewScore", { score: n })}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
