import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { StatsAnalytics } from "@/components/stats/stats-analytics";
import { getStatsData } from "@/lib/stats";

export default async function StatsPage() {
  const data = await getStatsData();
  if (!data) redirect("/login");

  const { stats, statsError } = data;

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Stats"
        title="Match trends and workload clarity."
        description="Follow batting runs, bowling impact, and discipline focus with clean mobile-first charts."
      />

      <StatsAnalytics stats={stats} error={statsError} />
    </section>
  );
}
