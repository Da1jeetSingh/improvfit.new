import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { formatDate, formatLabel } from "@/components/ui/form-styles";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getDashboardData } from "@/lib/dashboard";
import { formatMetric } from "@/lib/dashboard/metrics";

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card padding="sm" className="text-center sm:text-left">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </Card>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) redirect("/login");

  const { profile, metrics, recentMatches, recentSessions, recentGoals } = data;

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={`Hey${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}`}
        description="Your recent activity, stats, and progress at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Matches" value={String(metrics.matchesPlayed)} hint="Logged innings" />
        <StatTile label="Total runs" value={String(metrics.totalRuns)} hint="All matches" />
        <StatTile label="Average" value={formatMetric(metrics.battingAverage)} hint="Runs per dismissal" />
        <StatTile label="Strike rate" value={formatMetric(metrics.strikeRate)} hint="Per 100 balls" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Training rhythm" description="Sessions over the last 4 weeks.">
          <ChartBars data={metrics.weeklyTraining} />
          <p className="mt-4 text-sm text-muted">
            {metrics.trainingSessionsLast30Days} sessions in the last 30 days
            {metrics.trainingSessionsPerWeek
              ? ` · ~${metrics.trainingSessionsPerWeek}/week`
              : ""}
          </p>
        </Card>

        <Card title="Goal progress" description={`${metrics.goalsCompleted} of ${metrics.goalsTotal} completed`}>
          {metrics.goalsTotal === 0 ? (
            <p className="text-sm text-muted">No goals yet.</p>
          ) : (
            <div className="space-y-4">
              <p className="text-2xl font-bold text-foreground">
                {metrics.averageGoalProgress === null
                  ? "—"
                  : `${metrics.averageGoalProgress}%`}
                <span className="ml-2 text-sm font-normal text-muted">avg progress</span>
              </p>
              {metrics.goalSummaries.slice(0, 3).map((goal) => (
                <div key={goal.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-muted">{formatLabel(goal.status)}</span>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Recent matches">
          {recentMatches.length === 0 ? (
            <p className="text-sm text-muted">No matches logged.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentMatches.map((m) => (
                <li key={m.id} className="flex justify-between border-b border-border pb-2">
                  <span>{formatDate(m.played_on)}</span>
                  <span className="font-semibold">{m.runs ?? 0} runs</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/matches" className="mt-4 inline-block text-sm font-semibold text-green-deep hover:underline">
            View matches →
          </Link>
        </Card>

        <Card title="Recent training">
          {recentSessions.length === 0 ? (
            <p className="text-sm text-muted">No sessions logged.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentSessions.map((s) => (
                <li key={s.id} className="flex justify-between border-b border-border pb-2">
                  <span>{formatLabel(s.focus)}</span>
                  <span className="text-muted">{s.duration_minutes} min</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/training" className="mt-4 inline-block text-sm font-semibold text-green-deep hover:underline">
            View training →
          </Link>
        </Card>

        <Card title="Recent goals">
          {recentGoals.length === 0 ? (
            <p className="text-sm text-muted">No goals set.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentGoals.map((g) => (
                <li key={g.id} className="flex justify-between border-b border-border pb-2">
                  <span className="truncate pr-2">{g.title}</span>
                  <span className="text-muted">{formatLabel(g.status)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/goals" className="mt-4 inline-block text-sm font-semibold text-green-deep hover:underline">
            View goals →
          </Link>
        </Card>
      </div>
    </section>
  );
}
