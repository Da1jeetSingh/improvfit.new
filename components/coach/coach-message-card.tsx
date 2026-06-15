import { cn } from "@/lib/utils";
import type { CoachMessage } from "@/lib/coach/types";

type CoachMessageCardProps = {
  message: CoachMessage | null;
  className?: string;
  compact?: boolean;
};

export function CoachMessageCard({
  message,
  className,
  compact = false,
}: CoachMessageCardProps) {
  if (!message) {
    return null;
  }

  return (
    <aside
      className={cn(
        "rounded-2xl border border-green-muted bg-green-tint px-5 py-4 shadow-soft",
        compact ? "text-sm" : "",
        className,
      )}
      aria-live="polite"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
        {message.label ?? "Coach"}
      </p>
      <p
        className={cn(
          "mt-2 font-medium leading-relaxed text-green-deep",
          compact ? "text-sm" : "text-base",
        )}
      >
        {message.text}
      </p>
    </aside>
  );
}
