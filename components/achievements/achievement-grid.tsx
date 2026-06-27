import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { alertErrorClassName, emptyCardClassName } from "@/components/ui/form-styles";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  achievementCategoryLabels,
} from "@/lib/achievements/definitions";
import type { AchievementsSummary, AchievementCategory } from "@/lib/achievements";
import { cn } from "@/lib/utils";

type AchievementGridProps = {
  summary: AchievementsSummary;
  error?: string | null;
};

function AchievementBadge({
  achievement,
}: {
  achievement: AchievementsSummary["achievements"][number];
}) {
  return (
    <div
      className={cn(
        "ds-mini-stat flex flex-col px-5 py-5 transition-all duration-300",
        achievement.unlocked
          ? "border-green-sage/35 bg-gradient-to-br from-white to-green-tint/40"
          : "opacity-95",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-xs font-bold tracking-wide shadow-sm transition-all duration-300",
            achievement.unlocked
              ? "border-green-sage/40 bg-white text-green-deep"
              : "border-border-subtle bg-surface text-muted",
          )}
          aria-hidden
        >
          {achievement.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold text-foreground">{achievement.title}</p>
            <Badge variant={achievement.unlocked ? "brand" : "muted"}>
              {achievement.unlocked ? "Earned" : "Locked"}
            </Badge>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {achievement.description}
          </p>
        </div>
      </div>

      {!achievement.unlocked ? (
        <div className="mt-5 space-y-2 pl-[4.5rem]">
          <p className="text-sm font-medium text-foreground">
            {achievement.current} of {achievement.target}
          </p>
          <ProgressBar value={achievement.progress} showLabel={false} />
        </div>
      ) : (
        <p className="mt-4 pl-[4.5rem] text-sm font-semibold text-green-deep">
          Unlocked
          {achievement.unlockedAt
            ? ` · ${new Date(achievement.unlockedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}`
            : ""}
        </p>
      )}
    </div>
  );
}

function groupAchievements(summary: AchievementsSummary) {
  const groups = new Map<AchievementCategory, AchievementsSummary["achievements"]>();

  for (const achievement of summary.achievements) {
    const existing = groups.get(achievement.category) ?? [];
    existing.push(achievement);
    groups.set(achievement.category, existing);
  }

  return [...groups.entries()];
}

export function AchievementGrid({ summary, error }: AchievementGridProps) {
  if (error) {
    return (
      <Card title="Achievements" description="Celebrate your cricket progress.">
        <p className={alertErrorClassName} role="alert">
          Could not load achievements: {error}
        </p>
      </Card>
    );
  }

  const grouped = groupAchievements(summary);

  return (
    <div className="space-y-8">
      <Card
        title="Your progress"
        description={`${summary.unlockedCount} of ${summary.totalCount} milestones earned`}
        className={summary.unlockedCount === 0 ? emptyCardClassName : undefined}
      >
        {summary.unlockedCount === 0 ? (
          <p className="text-sm leading-relaxed text-muted">
            No badges earned yet. Log training, matches, or complete a goal to
            unlock your first achievement.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Keep building momentum — every session moves you closer to the next
            milestone.
          </p>
        )}

        {summary.nextAchievement ? (
          <div className="mt-5 rounded-2xl border border-border-subtle bg-surface px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Next milestone
            </p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  {summary.nextAchievement.title}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {summary.nextAchievement.description}
                </p>
              </div>
              <span className="rounded-xl border border-border-subtle bg-white px-2 py-1 text-xs font-bold text-green-deep">
                {summary.nextAchievement.icon}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                {summary.nextAchievement.current} of{" "}
                {summary.nextAchievement.target}
              </p>
              <ProgressBar
                value={summary.nextAchievement.progress}
                showLabel={false}
              />
            </div>
          </div>
        ) : null}
      </Card>

      {grouped.map(([category, achievements]) => (
        <section key={category} className="space-y-4">
          <h2 className="text-base font-bold text-green-deep">
            {achievementCategoryLabels[category]}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
