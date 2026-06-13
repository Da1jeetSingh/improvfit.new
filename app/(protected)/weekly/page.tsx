import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { WeeklyProgressCard } from "@/components/weekly/weekly-progress";
import { getWeeklyProgressData } from "@/lib/weekly";

export default async function WeeklyPage() {
  const data = await getWeeklyProgressData();
  if (!data) redirect("/login");

  const { weeklyProgress, weeklyProgressError } = data;

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Progress"
        title="Weekly progress"
        description="How your current week is going — training, matches, and momentum."
      />

      <WeeklyProgressCard
        progress={weeklyProgress}
        error={weeklyProgressError}
      />
    </section>
  );
}
