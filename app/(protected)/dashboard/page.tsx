import Link from "next/link";
import { redirect } from "next/navigation";

import { ProgressSummaryCard } from "@/components/dashboard/progress-summary";
import { WeeklyProgressCard } from "@/components/weekly/weekly-progress";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { formatDate, formatLabel, listRowClassName, sectionLinkClassName } from "@/components/ui/form-styles";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatTile } from "@/components/ui/stat-tile";
import { getDashboardData } from "@/lib/dashboard";
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

  return (
    <section className="space-y-10 lg:space-y-12">
      <PageHeader
        eyebrow="Overview"
        title={`Hey${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}`}
        description="Your recent activity, stats, and progress at a glance."
      />

      <div className="space-y-8">
        <ProgressSummaryCard summary={progressSummary} error={progressError} />
        <WeeklyProgressCard progress={weeklyProgress} error={progressError} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Matches" value={String(metrics.matchesPlayed)} hint="Logged innings" />
        <StatTile label="Total runs" value={String(metrics.totalRuns)} hint="All matches" />
        <StatTile label="Average" value={formatMetric(metrics.battingAverage)} hint="Runs per dismissal" />
        <StatTile label="Strike rate" value={formatMetric(metrics.strikeRate)} hint="Per 100 balls" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Training rhythm" description="Sessions over the last 4 weeks.">
          <ChartBars data={metrics.weeklyTraining} />
          <p className="mt-6 text-sm leading-relaxed text-muted">
            {metrics.trainingSessionsLast30Days} sessions in the last 30 days
            {metrics.trainingSessionsPerWeek
              ? ` · ~${metrics.trainingSessionsPerWeek}/week`
              : ""}
          </p>
        </Card>

        <Card title="Goal progress" description={`${metrics.goalsCompleted} of ${metrics.goalsTotal} completed`}>
          {metrics.goalsTotal === 0 ? (
            <p className="text-sm leading-relaxed text-muted">No goals yet.</p>
          ) : (
            <div className="space-y-5">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {metrics.averageGoalProgress === null
                  ? "—"
                  : `${metrics.averageGoalProgress}%`}
                <span className="ml-2 text-sm font-normal text-muted">avg progress</span>
              </p>
              {metrics.goalSummaries.slice(0, 3).map((goal) => (
                <div key={goal.id}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold text-foreground">{goal.title}</span>
                    <Badge variant="muted">{formatLabel(goal.status)}</Badge>
                  </div>
                  <ProgressBar
                    value={goal.progress ?? 0}
                    showLabel={goal.progress !== null}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card title="Recent matches">
          {recentMatches.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">No matches logged.</p>
          ) : (
            <ul className="space-y-3">
              {recentMatches.map((m) => (
                <li
                  key={m.id}
                  className={`flex items-center justify-between px-4 py-3 text-sm ${listRowClassName}`}
                >
                  <span className="text-muted">{formatDate(m.played_on)}</span>
                  <span className="font-bold text-foreground">{m.runs ?? 0} runs</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/matches" className={`mt-5 ${sectionLinkClassName}`}>
            View matches →
          </Link>
        </Card>

        <Card title="Recent training">
          {recentSessions.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">No sessions logged.</p>
          ) : (
            <ul className="space-y-3">
              {recentSessions.map((s) => (
                <li
                  key={s.id}
                  className={`flex items-center justify-between px-4 py-3 text-sm ${listRowClassName}`}
                >
                  <span className="font-medium text-foreground">{formatLabel(s.focus)}</span>
                  <span className="text-muted">{s.duration_minutes} min</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/training" className={`mt-5 ${sectionLinkClassName}`}>
            View training →
          </Link>
        </Card>

        <Card title="Recent goals">
          {recentGoals.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted">No goals set.</p>
          ) : (
            <ul className="space-y-3">
              {recentGoals.map((g) => (
                <li
                  key={g.id}
                  className={`flex items-center justify-between px-4 py-3 text-sm ${listRowClassName}`}
                >
                  <span className="truncate pr-2 font-medium text-foreground">{g.title}</span>
                  <Badge variant="muted">{formatLabel(g.status)}</Badge>
                </li>
              ))}
            </ul>
          )}
          <Link href="/goals" className={`mt-5 ${sectionLinkClassName}`}>
            View goals →
          </Link>
        </Card>
      </div>
    </section>
  );
}
