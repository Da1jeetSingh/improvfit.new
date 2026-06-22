import { cn } from "@/lib/utils";
import type { TrendDirection } from "@/lib/stats/trends";

type TrendIndicatorProps = {
  direction: TrendDirection;
  label: string;
  className?: string;
};

function TrendArrow({ direction }: { direction: TrendDirection }) {
  if (direction === "neutral") {
    return null;
  }

  const isUp = direction === "above";

  return (
    <svg
      className={cn("h-3 w-3 shrink-0", isUp ? "text-green-deep" : "text-red-500")}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      {isUp ? (
        <path
          d="M6 2.5 9.5 7H2.5L6 2.5Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M6 9.5 2.5 5h7L6 9.5Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

export function TrendIndicator({ direction, label, className }: TrendIndicatorProps) {
  if (direction === "neutral") {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[10px] font-semibold leading-none",
        direction === "above" ? "text-green-deep" : "text-red-500",
        className,
      )}
    >
      <TrendArrow direction={direction} />
      {label}
    </span>
  );
}
