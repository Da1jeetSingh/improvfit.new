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
    <div className={cn("space-y-1.5", className)}>
      {showLabel ? (
        <div className="flex justify-between text-sm">
          <span className="font-medium text-foreground">{Math.round(percent)}%</span>
        </div>
      ) : null}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-green-muted">
        <div
          className="h-full rounded-full bg-green-light transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
