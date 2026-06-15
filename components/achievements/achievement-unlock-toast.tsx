"use client";

import { cn } from "@/lib/utils";
import type { AchievementUnlock } from "@/lib/achievements";

type AchievementUnlockToastProps = {
  unlocks: AchievementUnlock[];
  className?: string;
  compact?: boolean;
};

export function AchievementUnlockToast({
  unlocks,
  className,
  compact = false,
}: AchievementUnlockToastProps) {
  if (unlocks.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-5 py-4 shadow-soft",
        compact ? "text-sm" : "",
        className,
      )}
      aria-live="polite"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">
        Achievement unlocked
      </p>

      <div className="mt-3 space-y-3">
        {unlocks.map((unlock) => (
          <div key={unlock.id} className="flex items-start gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200/70 bg-white text-lg shadow-sm"
              aria-hidden
            >
              {unlock.icon}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{unlock.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                {unlock.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
