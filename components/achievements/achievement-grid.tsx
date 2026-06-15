import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { alertErrorClassName, emptyCardClassName } from "@/components/ui/form-styles";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { AchievementsSummary } from "@/lib/achievements";
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
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-2xl shadow-sm transition-all duration-300",
            achievement.unlocked
              ? "border-green-sage/40 bg-white"
              : "border-border-subtle bg-surface grayscale",
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

  return (
    <div className="space-y-8">
      <Card
        title="Your badges"
        description={`${summary.unlockedCount} of ${summary.totalCount} achievements earned`}
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
            badge.
          </p>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {summary.achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}
