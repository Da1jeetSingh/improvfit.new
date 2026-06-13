import Link from "next/link";
import { redirect } from "next/navigation";

import { StatCard } from "@/components/dashboard/stat-card";
import { TrainingChart } from "@/components/dashboard/training-chart";
import { Card } from "@/components/ui/card";
import { formatDate, formatLabel } from "@/components/ui/form-styles";
import { getDashboardData } from "@/lib/dashboard";
import { formatMetric } from "@/lib/dashboard/metrics";
import type { PlayerProfile } from "@/types/profile";

function ProfileSummary({ profile }: { profile: PlayerProfile | null }) {
  if (!profile?.full_name && !profile?.role) {
    return (
      <Card title="Player profile" description="Your cricket profile at a glance.">
        <p className="text-sm text-zinc-500">Profile not filled in yet.</p>
        <Link
          href="/profile"
          className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          Complete your profile →
        </Link>
      </Card>
    );
  }

  return (
    <Card title="Player profile" description="Your cricket profile at a glance.">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Name</dt>
          <dd className="font-medium text-zinc-900">
            {profile.full_name ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Role</dt>
          <dd className="font-medium text-zinc-900">
            {profile.role ? formatLabel(profile.role) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Skill level</dt>
          <dd className="font-medium text-zinc-900">
            {profile.skill_level ? formatLabel(profile.skill_level) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Batting</dt>
          <dd className="font-medium text-zinc-900">
            {profile.batting_style ? formatLabel(profile.batting_style) : "—"}
          </dd>
        </div>
      </dl>
      <Link
        href="/profile"
        className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline"
      >
        Edit profile →
      </Link>
    </Card>
  );
}

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  if (!dashboard) {
    redirect("/login");
  }

  const { profile, metrics, recentSessions } = dashboard;
  const hasTrainingData = metrics.trainingSessionsTotal > 0;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Player overview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="max-w-2xl text-zinc-600">
          Your profile and training activity in one place.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Sessions (30 days)"
          value={String(metrics.trainingSessionsLast30Days)}
          hint="Training logged this month"
        />
        <StatCard
          label="Per week"
          value={formatMetric(metrics.trainingSessionsPerWeek)}
          hint="Average based on last 30 days"
        />
        <StatCard
          label="All time"
          value={String(metrics.trainingSessionsTotal)}
          hint="Total sessions logged"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileSummary profile={profile} />

        <Card
          title="Training frequency"
          description="Sessions over the last four weeks."
        >
          {hasTrainingData ? (
            <TrainingChart buckets={metrics.weeklyTraining} />
          ) : (
            <div>
              <p className="text-sm text-zinc-500">No training sessions yet.</p>
              <Link
                href="/training"
                className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline"
              >
                Log your first session →
              </Link>
            </div>
          )}
        </Card>
      </div>

      <Card title="Recent sessions" description="Your latest training logs.">
        {recentSessions.length === 0 ? (
          <p className="text-sm text-zinc-500">Nothing logged yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {recentSessions.map((session) => (
              <li
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-zinc-900">
                    {formatDate(session.session_date)}
                  </p>
                  <p className="text-zinc-500">
                    {formatLabel(session.focus)} · {session.duration_minutes} min
                  </p>
                </div>
                {session.self_rating ? (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                    {session.self_rating}/5
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/training"
          className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          View all training →
        </Link>
      </Card>
    </section>
  );
}
