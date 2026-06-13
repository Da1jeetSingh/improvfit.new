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
        "flex h-40 items-end justify-between gap-2 sm:gap-4",
        className,
      )}
    >
      {data.map((bar) => {
        const height = `${Math.max((bar.value / max) * 100, bar.value > 0 ? 12 : 0)}%`;

        return (
          <div
            key={bar.label}
            className="group flex flex-1 flex-col items-center gap-2"
          >
            <span className="text-sm font-bold text-foreground transition-transform duration-200 group-hover:scale-105">
              {bar.value}
            </span>
            <div className="flex h-28 w-full items-end">
              <div
                className={cn(
                  "w-full rounded-t-xl transition-all duration-500 ease-out",
                  bar.value === 0
                    ? "bg-green-muted"
                    : "bg-gradient-to-t from-green-deep to-green-light group-hover:from-green-brand group-hover:to-green-soft",
                )}
                style={{ height }}
              />
            </div>
            <span className="text-center text-[10px] font-semibold text-muted sm:text-xs">
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
