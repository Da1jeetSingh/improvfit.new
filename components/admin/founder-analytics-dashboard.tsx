import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { StatTile } from "@/components/ui/stat-tile";
import {
  alertErrorClassName,
  emptyCardClassName,
  sectionLinkClassName,
} from "@/components/ui/form-styles";
import type { FounderAnalytics } from "@/lib/admin/analytics";
import { dashboardRoute } from "@/lib/auth";

type FounderAnalyticsDashboardProps = {
  analytics: FounderAnalytics;
};

function formatPercent(value: number, total: number) {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

export function FounderAnalyticsDashboard({
  analytics,
}: FounderAnalyticsDashboardProps) {
  const completionRate = formatPercent(
    analytics.profileCompletions,
    analytics.totalUsers,
  );
  const hasSignupTrend = analytics.signupTrend.some((point) => point.value > 0);
  const hasActivityTrend = analytics.activityTrend.some(
    (point) => point.value > 0,
  );

  return (
    <section className="space-y-10">
      <header className="space-y-3 border-b border-border-subtle pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
          Founder only
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-green-deep sm:text-4xl">
          App analytics
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Private health board for IMPROV — signups, users, and usage at a
          glance. Not visible to players.
        </p>
        <Link href={dashboardRoute} className={sectionLinkClassName}>
          ← Back to dashboard
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile
          label="Total users"
          value={String(analytics.totalUsers)}
          hint="Registered profiles"
          accent
        />
        <StatTile
          label="New signups"
          value={String(analytics.signupsThisWeek)}
          hint={`${analytics.signupsToday} today · this week`}
        />
        <StatTile
          label="Active users"
          value={String(analytics.activeUsers)}
          hint="Logged training or match in last 30 days"
        />
        <StatTile
          label="Profile completions"
          value={String(analytics.profileCompletions)}
          hint={`${completionRate} onboarding complete`}
        />
        <StatTile
          label="Training sessions"
          value={String(analytics.trainingSessions)}
          hint="Total logged"
        />
        <StatTile
          label="Match entries"
          value={String(analytics.matchEntries)}
          hint="Total logged"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card
          title="Signup trend"
          description="New profiles by week (last 4 weeks)."
          className={!hasSignupTrend ? emptyCardClassName : undefined}
        >
          {hasSignupTrend ? (
            <ChartBars data={analytics.signupTrend} />
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              No signups in the last four weeks yet.
            </p>
          )}
        </Card>

        <Card
          title="Usage trend"
          description="Training sessions and matches logged by week."
          className={!hasActivityTrend ? emptyCardClassName : undefined}
        >
          {hasActivityTrend ? (
            <ChartBars data={analytics.activityTrend} />
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              No activity logged in the last four weeks yet.
            </p>
          )}
        </Card>
      </div>

      <Card
        title="Quick read"
        description="Snapshot of app health right now."
        padding="sm"
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-subtle bg-surface px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Signup pace
            </dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {analytics.signupsThisWeek} this week · {analytics.signupsToday}{" "}
              today
            </dd>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Engagement
            </dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {analytics.activeUsers} active of {analytics.totalUsers} users
            </dd>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Onboarding
            </dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {analytics.profileCompletions} completed ({completionRate})
            </dd>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Logged activity
            </dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {analytics.trainingSessions} sessions · {analytics.matchEntries}{" "}
              matches
            </dd>
          </div>
        </dl>
      </Card>
    </section>
  );
}

type FounderAnalyticsErrorProps = {
  message: string;
};

export function FounderAnalyticsError({ message }: FounderAnalyticsErrorProps) {
  return (
    <section className="space-y-8">
      <header className="space-y-3 border-b border-border-subtle pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
          Founder only
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-green-deep sm:text-4xl">
          App analytics
        </h1>
        <Link href={dashboardRoute} className={sectionLinkClassName}>
          ← Back to dashboard
        </Link>
      </header>

      <Card title="Analytics unavailable">
        <p className={alertErrorClassName} role="alert">
          {message}
        </p>
      </Card>
    </section>
  );
}
