import Link from "next/link";
import { redirect } from "next/navigation";

import { GoalsOverview } from "@/components/dashboard/goals-overview";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrainingChart } from "@/components/dashboard/training-chart";
import { Card } from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard";
import { formatMetric } from "@/lib/dashboard/metrics";

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  if (!dashboard) {
    redirect("/login");
  }

  const { metrics } = dashboard;
  const hasMatchData = metrics.matchesPlayed > 0;
  const hasTrainingData = metrics.trainingSessionsTotal > 0;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Performance overview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="max-w-2xl text-zinc-600">
          Your batting stats, training rhythm, and goal progress in one place.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Matches played"
          value={String(metrics.matchesPlayed)}
          hint={hasMatchData ? "Logged match innings" : "Log matches to populate"}
        />
        <StatCard
          label="Total runs"
          value={String(metrics.totalRuns)}
          hint={hasMatchData ? "Across all logged matches" : "No runs recorded yet"}
        />
        <StatCard
          label="Batting average"
          value={formatMetric(metrics.battingAverage)}
          hint={
            metrics.battingAverage === null
              ? "Needs at least one dismissal"
              : "Runs per dismissal"
          }
        />
        <StatCard
          label="Strike rate"
          value={formatMetric(metrics.strikeRate)}
          hint={
            metrics.strikeRate === null
              ? "Needs balls faced data"
              : "Runs per 100 balls"
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Training frequency"
          description="Sessions per week based on the last 30 days."
        >
          {hasTrainingData ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Last 30 days
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    {metrics.trainingSessionsLast30Days}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Per week
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    {formatMetric(metrics.trainingSessionsPerWeek)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    All time
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900">
                    {metrics.trainingSessionsTotal}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-zinc-700">
                  Last 4 weeks
                </p>
                <TrainingChart buckets={metrics.weeklyTraining} />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-zinc-500">No training sessions logged yet.</p>
              <Link
                href="/training"
                className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline"
              >
                Log your first session →
              </Link>
            </div>
          )}
        </Card>

        <GoalsOverview
          goalsTotal={metrics.goalsTotal}
          goalsCompleted={metrics.goalsCompleted}
          averageGoalProgress={metrics.averageGoalProgress}
          goalSummaries={metrics.goalSummaries}
        />
      </div>

      {!hasMatchData ? (
        <Card
          title="Get started"
          description="Your dashboard fills in as you log activity."
        >
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/matches"
              className="font-medium text-emerald-700 hover:underline"
            >
              Log a match
            </Link>
            <Link
              href="/training"
              className="font-medium text-emerald-700 hover:underline"
            >
              Log training
            </Link>
            <Link
              href="/goals"
              className="font-medium text-emerald-700 hover:underline"
            >
              Set a goal
            </Link>
          </div>
        </Card>
      ) : null}
    </section>
  );
}
