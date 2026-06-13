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
        "premium-stat",
        compact ? "p-4" : "p-5 sm:p-6",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
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
      {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
