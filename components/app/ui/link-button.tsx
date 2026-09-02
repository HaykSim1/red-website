import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-primary to-primary-container text-on-primary hover:shadow-lg hover:shadow-primary/20",
  secondary: "border-2 border-outline/20 text-on-surface hover:bg-surface-variant/50",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

/** Same look as <Button>, but it navigates — so it stays a real anchor. */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-bold tracking-wide transition-all",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        VARIANT[variant],
        SIZE[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {icon}
      {children}
    </Link>
  );
}
