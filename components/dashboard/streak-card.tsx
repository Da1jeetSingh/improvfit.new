import { formatDate } from "@/components/ui/form-styles";
import { Card } from "@/components/ui/card";
import type { ActivityStreak } from "@/lib/dashboard/streak";

type StreakCardProps = {
  streak: ActivityStreak;
  error?: string | null;
};

export function StreakCard({ streak, error }: StreakCardProps) {
  if (error) {
    return (
      <Card title="Activity streak" description="Consecutive days with logged cricket activity.">
        <p className="text-sm text-red-600" role="alert">
          Could not calculate streak: {error}
        </p>
      </Card>
    );
  }

  const streakLabel =
    streak.currentStreak === 1 ? "day in a row" : "days in a row";

  return (
    <Card
      title="Activity streak"
      description="Counts days where you log at least one training session or match."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-4xl font-bold text-foreground">{streak.currentStreak}</p>
          <p className="mt-1 text-sm font-medium text-green-deep">{streakLabel}</p>
        </div>

        <div className="text-sm text-muted">
          <p>
            Last active:{" "}
            <span className="font-medium text-foreground">
              {streak.lastActiveDate ? formatDate(streak.lastActiveDate) : "No activity yet"}
            </span>
          </p>
          {!streak.loggedToday && streak.currentStreak > 0 ? (
            <p className="mt-2">Log training or a match today to extend your streak.</p>
          ) : null}
          {streak.currentStreak === 0 && streak.lastActiveDate ? (
            <p className="mt-2">Log activity today to start a new streak.</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
