import { AchievementGrid } from "@/components/achievements/achievement-grid";
import { PageHeader } from "@/components/layout/page-header";
import { getMilestonesData } from "@/lib/milestones";
import { redirect } from "next/navigation";

export default async function MilestonesPage() {
  const data = await getMilestonesData();
  if (!data) redirect("/login");

  const { milestones, milestonesError } = data;

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Achievements"
        title="Your badges"
        description="Earn badges as you train, play, and hit meaningful cricket milestones."
      />

      <AchievementGrid summary={milestones} error={milestonesError} />
    </section>
  );
}
