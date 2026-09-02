import type { ReactNode } from "react";

/** Standard page gutter: tight on phones, the Stitch 32px at lg. */
export function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${className}`}>{children}</div>;
}

export function PageHeader({
  title,
  lead,
  actions,
}: {
  title: string;
  lead?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          {title}
        </h2>
        {lead ? <p className="mt-1 text-sm text-on-surface-variant">{lead}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
