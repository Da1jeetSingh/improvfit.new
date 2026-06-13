import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { StatsAnalytics } from "@/components/stats/stats-analytics";
import { getStatsData } from "@/lib/stats";

export default async function StatsPage() {
  const data = await getStatsData();
  if (!data) redirect("/login");

  const { stats, statsError } = data;

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Analytics"
        title="Stats"
        description="Useful performance metrics from your training and match logs."
      />

      <StatsAnalytics stats={stats} error={statsError} />
    </section>
  );
}
