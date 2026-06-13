import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: string;
  hint?: string;
  className?: string;
  compact?: boolean;
};

export function StatTile({
  label,
  value,
  hint,
  className,
  compact = false,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "ds-stat",
        compact ? "pl-5 pr-4 py-4" : "pl-6 pr-5 py-5 sm:py-6",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-bold tracking-tight text-foreground",
          compact ? "text-2xl" : "text-3xl",
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
