"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

const CONTROL =
  "w-full bg-surface-container-low rounded-lg px-4 text-sm text-on-surface " +
  "placeholder:text-on-surface-variant/60 " +
  "focus:outline-none focus:ring-2 focus:ring-primary/30 " +
  "disabled:opacity-60 disabled:cursor-not-allowed " +
  "aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error/50";

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant mb-2"
    >
      {children}
    </label>
  );
}

function Hint({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (!error && !hint) return null;
  return (
    <p id={id} className={`mt-1.5 text-xs ${error ? "text-error" : "text-on-surface-variant"}`}>
      {error ?? hint}
    </p>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Field({ label, hint, error, className = "", ...rest }: FieldProps) {
  const id = useId();
  const describedBy = `${id}-hint`;
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <input
        {...rest}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? describedBy : undefined}
        className={`${CONTROL} h-12`}
      />
      <Hint id={describedBy} error={error} hint={hint} />
    </div>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextAreaField({ label, hint, error, className = "", rows = 4, ...rest }: TextAreaProps) {
  const id = useId();
  const describedBy = `${id}-hint`;
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        {...rest}
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? describedBy : undefined}
        className={`${CONTROL} py-3 resize-y`}
      />
      <Hint id={describedBy} error={error} hint={hint} />
    </div>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function SelectField({ label, hint, error, className = "", children, ...rest }: SelectProps) {
  const id = useId();
  const describedBy = `${id}-hint`;
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <select
        {...rest}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? describedBy : undefined}
        className={`${CONTROL} h-12 appearance-none cursor-pointer`}
      >
        {children}
      </select>
      <Hint id={describedBy} error={error} hint={hint} />
    </div>
  );
}
