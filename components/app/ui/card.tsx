import type { ReactNode } from "react";

/**
 * The elevated surface from the Stitch design: white against the warm canvas.
 * Sectioning uses tonal shifts, not borders — see docs/mobile-design.md.
 */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag className={`bg-surface-container-lowest rounded-xl ${className}`}>{children}</Tag>
  );
}
