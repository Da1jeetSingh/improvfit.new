import { WeeklyProgressCard } from "@/components/weekly/weekly-progress";
import { CoachMessageCard } from "@/components/coach/coach-message-card";
import { Card } from "@/components/ui/card";
import { emptyCardClassName } from "@/components/ui/form-styles";
import type { CoachMessage } from "@/lib/coach/types";
import type { WeeklyProgress } from "@/lib/dashboard/weekly-progress";

type DashboardModuleGridProps = {
  hasActivity: boolean;
  weeklyProgress: WeeklyProgress;
  coachMessage: CoachMessage | null;
  progressError?: string | null;
};

export function DashboardModuleGrid({
  hasActivity,
  weeklyProgress,
  coachMessage,
  progressError,
}: DashboardModuleGridProps) {
  return (
    <section
      aria-label="Progress and insights"
      className="grid gap-8 lg:grid-cols-2"
    >
      {hasActivity ? (
        <WeeklyProgressCard progress={weeklyProgress} error={progressError} />
      ) : (
        <Card
          title="Get started"
          description="Your dashboard fills in as you log activity."
          className={emptyCardClassName}
        >
          <p className="text-sm leading-relaxed text-muted">
            Log your first training session or match to unlock weekly progress
            and performance insights.
          </p>
        </Card>
      )}

      <CoachMessageCard message={coachMessage} />
    </section>
  );
}
