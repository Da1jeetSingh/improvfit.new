import { cn } from "@/lib/utils";

export type ChartBar = {
  label: string;
  value: number;
};

type ChartBarsProps = {
  data: ChartBar[];
  className?: string;
};

const barTones = [
  "from-[var(--chart-primary)] to-[var(--chart-secondary)]",
  "from-[var(--chart-secondary)] to-[var(--chart-tertiary)]",
  "from-[var(--chart-tertiary)] to-[var(--chart-quaternary)]",
  "from-[var(--chart-quaternary)] to-[var(--chart-muted)]",
] as const;

export function ChartBars({ data, className }: ChartBarsProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      className={cn(
        "flex h-44 items-end justify-between gap-2 rounded-xl bg-green-tint/50 p-4 sm:gap-4",
        className,
      )}
    >
      {data.map((bar, index) => {
        const height = `${Math.max((bar.value / max) * 100, bar.value > 0 ? 10 : 0)}%`;
        const tone = barTones[index % barTones.length];

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
                  "w-full rounded-t-lg bg-gradient-to-t transition-all duration-500 ease-out",
                  bar.value === 0
                    ? "bg-[var(--chart-muted)]/70"
                    : `${tone} group-hover:opacity-90`,
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
