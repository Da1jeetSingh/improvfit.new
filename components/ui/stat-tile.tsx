import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: string;
  hint?: ReactNode;
  className?: string;
  compact?: boolean;
  accent?: boolean;
};

export function StatTile({
  label,
  value,
  hint,
  className,
  compact = false,
  accent = false,
}: StatTileProps) {
  return (
    <div
      className={cn(
        accent ? "ds-stat-accent" : "ds-mini-stat",
        compact ? "px-4 py-4" : "px-5 py-5 sm:py-6",
        className,
      )}
    >
      <p
        className={cn(
          "ds-stat-label text-[10px] font-semibold uppercase tracking-[0.1em] text-muted",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "ds-stat-value mt-1.5 font-bold tracking-tight text-foreground",
          compact ? "text-2xl" : "text-3xl",
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
