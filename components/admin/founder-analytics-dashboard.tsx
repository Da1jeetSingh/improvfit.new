import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { ChartLine } from "@/components/ui/chart-line";
import { StatTile } from "@/components/ui/stat-tile";
import {
  alertErrorClassName,
  emptyCardClassName,
  sectionLinkClassName,
} from "@/components/ui/form-styles";
import type { FounderAnalytics, WeeklyTrendPoint } from "@/lib/admin/analytics";
import { dashboardRoute } from "@/lib/auth";
import { cn } from "@/lib/utils";

type FounderAnalyticsDashboardProps = {
  analytics: FounderAnalytics;
};

function formatPercent(value: number, total: number) {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

function hasTrendData(points: WeeklyTrendPoint[]) {
  return points.some((point) => point.value > 0);
}

function getTrendDelta(points: WeeklyTrendPoint[]) {
  if (points.length < 2) {
    return null;
  }

  const previous = points[points.length - 2]?.value ?? 0;
  const current = points[points.length - 1]?.value ?? 0;
  const delta = current - previous;

  if (delta === 0) {
    return { label: "Flat vs last week", tone: "neutral" as const };
  }

  if (delta > 0) {
    return { label: `+${delta} vs last week`, tone: "up" as const };
  }

  return { label: `${delta} vs last week`, tone: "down" as const };
}

function ChartLegend({
  items,
}: {
  items: Array<{ label: string; color: string; dashed?: boolean }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-muted">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "h-0.5 w-5 rounded-full",
              item.dashed ? "border-t-2 border-dashed bg-transparent" : "",
            )}
            style={
              item.dashed
                ? { borderColor: item.color }
                : { backgroundColor: item.color }
            }
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function TrendChartCard({
  title,
  description,
  timeRange,
  data,
  ariaLabel,
  legend,
  emptyMessage,
  latestValue,
}: {
  title: string;
  description: string;
  timeRange: string;
  data: WeeklyTrendPoint[];
  ariaLabel: string;
  legend?: ReactNode;
  emptyMessage: string;
  latestValue?: string;
}) {
  const hasData = hasTrendData(data);
  const delta = getTrendDelta(data);

  return (
    <Card
      title={title}
      description={description}
      className={!hasData ? emptyCardClassName : undefined}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          {timeRange}
        </p>
        {latestValue ? (
          <p className="text-sm font-bold text-foreground">{latestValue}</p>
        ) : null}
      </div>

      {legend ? <div className="mb-4">{legend}</div> : null}

      {hasData ? (
        <>
          <ChartLine data={data} aria-label={ariaLabel} />
          {delta ? (
            <p
              className={cn(
                "mt-3 text-sm font-semibold",
                delta.tone === "up" && "text-green-deep",
                delta.tone === "down" && "text-red-500",
                delta.tone === "neutral" && "text-muted",
              )}
            >
              {delta.label}
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-sm leading-relaxed text-muted">{emptyMessage}</p>
      )}
    </Card>
  );
}

export function FounderAnalyticsDashboard({
  analytics,
}: FounderAnalyticsDashboardProps) {
  const completionRate = formatPercent(
    analytics.profileCompletions,
    analytics.totalUsers,
  );
  const timeRangeLabel = `Last ${analytics.trendWeekCount} weeks · weekly`;
  const latestUsers =
    analytics.userGrowthTrend.at(-1)?.value ?? analytics.totalUsers;
  const latestActive =
    analytics.activeUsersTrend.at(-1)?.value ?? analytics.activeUsers;
  const latestSignups =
    analytics.signupTrend.at(-1)?.value ?? analytics.signupsThisWeek;

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
          Private health board for IMPROV — user growth, signups, and usage
          trends at a glance. Not visible to players.
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
          hint="Logged activity in last 30 days"
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

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-green-deep">User trends</h2>
          <p className="mt-1 text-sm text-muted">
            Growth, engagement, and onboarding over time.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <TrendChartCard
            title="Total users"
            description="Cumulative registered profiles by week."
            timeRange={timeRangeLabel}
            data={analytics.userGrowthTrend}
            ariaLabel="Total users trend"
            legend={
              <ChartLegend
                items={[{ label: "Total users", color: "var(--green-deep)" }]}
              />
            }
            emptyMessage="No users registered yet."
            latestValue={`${latestUsers} total`}
          />

          <TrendChartCard
            title="Active users"
            description="Users who logged training or a match each week."
            timeRange={timeRangeLabel}
            data={analytics.activeUsersTrend}
            ariaLabel="Active users trend"
            legend={
              <ChartLegend
                items={[{ label: "Weekly active", color: "var(--green-sage)" }]}
              />
            }
            emptyMessage="No weekly activity logged yet."
            latestValue={`${latestActive} this week`}
          />

          <TrendChartCard
            title="New signups"
            description="Fresh profiles created each week."
            timeRange={timeRangeLabel}
            data={analytics.signupTrend}
            ariaLabel="Signup trend"
            legend={
              <ChartLegend
                items={[{ label: "New signups", color: "var(--green-deep)" }]}
              />
            }
            emptyMessage="No signups in this period yet."
            latestValue={`${latestSignups} this week`}
          />

          <TrendChartCard
            title="Profile completions"
            description="Onboarding completed each week."
            timeRange={timeRangeLabel}
            data={analytics.profileCompletionTrend}
            ariaLabel="Profile completion trend"
            legend={
              <ChartLegend
                items={[
                  { label: "Completions", color: "var(--green-brand)" },
                ]}
              />
            }
            emptyMessage="No profile completions in this period yet."
            latestValue={`${completionRate} overall`}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-green-deep">Usage trends</h2>
          <p className="mt-1 text-sm text-muted">
            Training and match logging volume by week.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <TrendChartCard
            title="Training sessions"
            description="Sessions logged per week."
            timeRange={timeRangeLabel}
            data={analytics.trainingTrend}
            ariaLabel="Training sessions trend"
            legend={
              <ChartLegend
                items={[{ label: "Sessions", color: "var(--green-deep)" }]}
              />
            }
            emptyMessage="No training sessions logged in this period yet."
            latestValue={`${analytics.trainingTrend.at(-1)?.value ?? 0} this week`}
          />

          <TrendChartCard
            title="Match entries"
            description="Matches logged per week."
            timeRange={timeRangeLabel}
            data={analytics.matchTrend}
            ariaLabel="Match entries trend"
            legend={
              <ChartLegend
                items={[{ label: "Matches", color: "var(--green-sage)" }]}
              />
            }
            emptyMessage="No matches logged in this period yet."
            latestValue={`${analytics.matchTrend.at(-1)?.value ?? 0} this week`}
          />
        </div>
      </div>

      <Card
        title="Quick read"
        description="Snapshot of app health right now."
        padding="sm"
      >
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="rounded-2xl border border-border-subtle bg-surface px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Weekly signups
            </dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {getTrendDelta(analytics.signupTrend)?.label ?? "—"}
            </dd>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
              Weekly sessions
            </dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              {getTrendDelta(analytics.trainingTrend)?.label ?? "—"}
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
