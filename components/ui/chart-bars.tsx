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
    <div className={cn("flex h-36 items-end justify-between gap-2 sm:gap-3", className)}>
      {data.map((bar) => {
        const height = `${Math.max((bar.value / max) * 100, bar.value > 0 ? 10 : 0)}%`;

        return (
          <div
            key={bar.label}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <span className="text-xs font-semibold text-foreground">{bar.value}</span>
            <div className="flex h-24 w-full items-end">
              <div
                className={cn(
                  "w-full rounded-t-lg bg-green-light transition-all",
                  bar.value === 0 && "bg-green-muted",
                )}
                style={{ height }}
              />
            </div>
            <span className="text-center text-[10px] font-medium text-muted sm:text-xs">
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
