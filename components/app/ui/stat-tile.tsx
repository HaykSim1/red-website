"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The Stitch bento tile. `href` makes the whole tile a link — the mockup's
 * counters are navigation, not decoration.
 */
export function StatTile({
  label,
  value,
  icon,
  href,
  hint,
}: {
  label: string;
  value: ReactNode;
  icon: string;
  href?: string;
  hint?: string;
}) {
  const body = (
    <>
      <div className="mb-4 flex items-start justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
        </span>
        <span className="material-symbols-outlined text-primary/50">{icon}</span>
      </div>
      <div className="font-headline text-3xl font-bold tracking-tighter text-on-surface sm:text-4xl">
        {value}
      </div>
      {hint ? <p className="mt-1 text-xs text-on-surface-variant">{hint}</p> : null}
    </>
  );

  const className =
    "flex flex-col justify-between rounded-xl bg-surface-container p-4 transition-colors sm:p-6";

  if (!href) return <div className={className}>{body}</div>;

  return (
    <Link
      href={href}
      className={`${className} hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
    >
      {body}
    </Link>
  );
}
