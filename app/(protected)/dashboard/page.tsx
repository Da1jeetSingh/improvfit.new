import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { WeeklyProgressCard } from "@/components/weekly/weekly-progress";
import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import { emptyCardClassName } from "@/components/ui/form-styles";
import { getDashboardData } from "@/lib/dashboard";
import { getDashboardSubtitle } from "@/lib/dashboard/greeting";
import { formatMetric } from "@/lib/dashboard/metrics";

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) redirect("/login");

  const {
    profile,
    metrics,
    progressSummary,
    weeklyProgress,
    progressError,
    recentMatches,
    recentSessions,
    recentGoals,
  } = data;

  const firstName = profile?.full_name?.split(" ")[0];
  const title = firstName ? `Welcome back, ${firstName}` : "Welcome back";
  const subtitle = getDashboardSubtitle(profile);
  const hasActivity = progressSummary.hasAnyData;

  return (
    <section className="space-y-8 lg:space-y-10">
      <header className="space-y-5">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-green-deep sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted">
            {subtitle}
          </p>
        </div>
        <DashboardQuickActions />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          compact
          label="Current streak"
          value={`${progressSummary.currentStreak}d`}
          hint="Consecutive active days"
        />
        <StatTile
          compact
          label="Matches"
          value={String(metrics.matchesPlayed)}
          hint="Logged innings"
        />
        <StatTile
          compact
          label="Batting average"
          value={formatMetric(metrics.battingAverage)}
          hint="Runs per dismissal"
        />
        <StatTile
          compact
          label="Active goals"
          value={String(progressSummary.activeGoals)}
          hint="In progress"
        />
      </div>

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

      <RecentActivity
        matches={recentMatches}
        sessions={recentSessions}
        goals={recentGoals}
      />
    </section>
  );
}
