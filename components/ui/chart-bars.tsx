import { cn } from "@/lib/utils";

export type ChartBar = {
  label: string;
  value: number;
};

type ChartBarsProps = {
  data: ChartBar[];
  className?: string;
};

export function ChartBars({ data, className }: ChartBarsProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      className={cn(
        "flex h-44 items-end justify-between gap-2 rounded-2xl border border-border-subtle bg-surface p-4 sm:gap-4",
        className,
      )}
    >
      {data.map((bar) => {
        const height = `${Math.max((bar.value / max) * 100, bar.value > 0 ? 10 : 0)}%`;

        return (
          <div
            key={bar.label}
            className="group flex flex-1 flex-col items-center gap-2"
          >
            <span className="text-sm font-bold text-foreground">
              {bar.value}
            </span>
            <div className="flex h-28 w-full items-end">
              <div
                className={cn(
                  "w-full rounded-t-xl transition-all duration-500 ease-out",
                  bar.value === 0 ? "bg-green-muted/50" : "bg-green-deep group-hover:bg-green-brand",
                )}
                style={{ height }}
              />
            </div>
            <span className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
