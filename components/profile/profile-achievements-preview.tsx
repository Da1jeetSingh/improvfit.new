import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { AchievementsSummary } from "@/lib/achievements";

type ProfileAchievementsPreviewProps = {
  summary: AchievementsSummary;
};

export function ProfileAchievementsPreview({
  summary,
}: ProfileAchievementsPreviewProps) {
  const earned = summary.achievements.filter((achievement) => achievement.unlocked);
  const nextLocked = summary.achievements.find(
    (achievement) => !achievement.unlocked,
  );
  const preview = earned.slice(0, 4);

  return (
    <section className="ds-surface animate-fade-in-up p-6 sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Achievements
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            {summary.unlockedCount} of {summary.totalCount} badges earned
          </p>
        </div>
        <Link
          href="/milestones"
          className="shrink-0 text-sm font-semibold text-green-deep transition-colors hover:text-foreground"
        >
          View all
        </Link>
      </div>

      {preview.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {preview.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-3 rounded-2xl border border-green-sage/25 bg-gradient-to-r from-white to-green-tint/30 px-4 py-3"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-sage/30 bg-white text-xl"
                aria-hidden
              >
                {achievement.icon}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">
                  {achievement.title}
                </p>
                <Badge variant="brand" className="mt-1">
                  Earned
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-muted">
          No badges earned yet. Log activity to unlock your first achievement.
        </p>
      )}

      {nextLocked ? (
        <div className="mt-5 rounded-2xl border border-border-subtle bg-surface px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Next up
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {nextLocked.title}
              </p>
              <p className="mt-1 text-sm text-muted">{nextLocked.description}</p>
            </div>
            <span className="text-2xl grayscale" aria-hidden>
              {nextLocked.icon}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-foreground">
              {nextLocked.current} of {nextLocked.target}
            </p>
            <ProgressBar value={nextLocked.progress} showLabel={false} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
