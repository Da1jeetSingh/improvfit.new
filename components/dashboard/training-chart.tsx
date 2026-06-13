import type { WeeklyTrainingBucket } from "@/lib/dashboard/metrics";
import { cn } from "@/lib/utils";

type TrainingChartProps = {
  buckets: WeeklyTrainingBucket[];
};

export function TrainingChart({ buckets }: TrainingChartProps) {
  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1);

  return (
    <div className="flex h-36 items-end justify-between gap-3">
      {buckets.map((bucket) => {
        const height = `${Math.max((bucket.count / maxCount) * 100, bucket.count > 0 ? 8 : 0)}%`;

        return (
          <div key={bucket.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-medium text-zinc-600">{bucket.count}</span>
            <div className="flex h-24 w-full items-end">
              <div
                className={cn(
                  "w-full rounded-t-md bg-emerald-500/90 transition-all",
                  bucket.count === 0 && "bg-zinc-100",
                )}
                style={{ height }}
              />
            </div>
            <span className="text-xs text-zinc-500">{bucket.label}</span>
          </div>
        );
      })}
    </div>
  );
}
