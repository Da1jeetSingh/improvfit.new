import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { StatsProgress } from "@/components/stats/stats-progress";
import { getDashboardSubtitle } from "@/lib/dashboard/greeting";
import { getStatsData } from "@/lib/stats";
import { getProfile } from "@/lib/profile";

export default async function StatsPage() {
  const [data, profile] = await Promise.all([getStatsData(), getProfile()]);

  if (!data) redirect("/login");

  const { progress, trends, statsError } = data;

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Progress"
        title="Stats & progress"
        description={
          profile
            ? `${getDashboardSubtitle(profile)} Track performance trends over time.`
            : "Track performance trends over time from your logged activity."
        }
      />

      <StatsProgress
        trends={trends}
        hasAnyData={progress.hasAnyData}
        error={statsError}
      />
    </section>
  );
}
