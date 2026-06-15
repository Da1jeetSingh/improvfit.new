import type { ProfileStats } from "@/lib/profile/page-data";

import { ProfileStatCard } from "./profile-stat-card";

type ProfileStatStripProps = {
  stats: ProfileStats;
};

export function ProfileStatStrip({ stats }: ProfileStatStripProps) {
  return (
    <section
      aria-label="Profile stats"
      className="grid gap-3 sm:grid-cols-3"
    >
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
