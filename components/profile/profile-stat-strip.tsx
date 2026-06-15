import type { ProfileStats } from "@/lib/profile/page-data";

import { ProfileStatCard } from "./profile-stat-card";

type ProfileStatStripProps = {
  stats: ProfileStats;
};

export function ProfileStatStrip({ stats }: ProfileStatStripProps) {
  const streakLabel = stats.streakDays === 1 ? "1 day" : `${stats.streakDays} days`;

  return (
    <section
      aria-label="Profile stats"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <ProfileStatCard
        label="Streak"
        value={streakLabel}
        hint="Current activity"
        accent={stats.streakDays > 0}
      />
      <ProfileStatCard
        label="Sessions"
        value={String(stats.sessionsLogged)}
        hint="Training logged"
      />
      <ProfileStatCard
        label="Matches"
        value={String(stats.matchesLogged)}
        hint="Performances logged"
      />
      <ProfileStatCard
        label="Goals"
        value={String(stats.goalsCompleted)}
        hint="Completed"
      />
    </section>
  );
}
