"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  // The Stitch CTA is a 135° gradient from primary to primary-container.
  primary:
    "bg-gradient-to-br from-primary to-primary-container text-on-primary hover:shadow-lg hover:shadow-primary/20",
  secondary:
    "border-2 border-outline/20 text-on-surface bg-transparent hover:bg-surface-variant/50",
  ghost: "text-on-surface-variant hover:bg-surface-variant/50",
  danger: "bg-error text-on-error hover:brightness-110",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** Renders a spinner and blocks input without collapsing the button's width. */
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-bold tracking-wide",
        "transition-all cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        VARIANT[variant],
        SIZE[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
    />
  );
}
