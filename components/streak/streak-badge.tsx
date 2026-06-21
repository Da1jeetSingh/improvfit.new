"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type StreakBadgeProps = {
  count: number;
  className?: string;
};

function FireIcon({
  className,
  gradientId,
}: {
  className?: string;
  gradientId: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("h-4 w-4 shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="12" y1="2" x2="12" y2="22">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M12 2c1.2 2.4 3.6 3.4 3.6 6.6 0 1.2-.4 2.2-1 3 1.4-.8 2.4-2.2 2.4-4.1 0-.5-.1-1-.2-1.4 1.5 1.1 2.2 2.8 2.2 4.7 0 3.8-2.8 6.8-6.4 7.1-.2 1.5-1.3 2.6-2.8 2.6-1.7 0-3-1.3-3-3 0-.4.1-.8.2-1.1-2.8-.8-4.8-3.3-4.8-6.3 0-2.2 1.1-4.1 2.8-5.2C8.1 4.8 9.8 2.8 12 2z"
      />
    </svg>
  );
}

export function StreakBadge({ count, className }: StreakBadgeProps) {
  const gradientId = useId();
  const label = count === 1 ? "1 day" : `${count} days`;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[#f5dcc8] bg-[#fff4ea] px-2.5 py-1",
        className,
      )}
      title={`${label} activity streak`}
      aria-label={`Activity streak: ${label}`}
    >
      <FireIcon gradientId={gradientId} />
      <span className="text-xs font-bold tracking-tight text-[#9a4f1a]">
        {label}
      </span>
    </div>
  );
}
