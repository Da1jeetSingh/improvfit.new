import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
};

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = true,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel ? (
        <div className="flex justify-end text-xs">
          <span className="font-medium text-muted">{Math.round(percent)}% complete</span>
        </div>
      ) : null}
      <div className="h-3 w-full overflow-hidden rounded-full bg-green-muted/60">
        <div
          className="h-full rounded-full bg-green-deep transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
