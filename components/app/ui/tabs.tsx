"use client";

/** Segmented control. Uses real radio semantics so arrow keys work for free. */
export function Tabs({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div role="tablist" className="inline-flex rounded-lg bg-surface-container-low p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={[
              "cursor-pointer rounded-md px-4 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
