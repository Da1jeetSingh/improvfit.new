import { redirect } from "next/navigation";

import { StatsProgress } from "@/components/stats/stats-progress";
import { getStatsData } from "@/lib/stats";

export default async function StatsPage() {
  const data = await getStatsData();

  if (!data) redirect("/login");

  const { progress, statsError } = data;

  return (
    <section>
      <StatsProgress progress={progress} error={statsError} />
    </section>
  );
}
