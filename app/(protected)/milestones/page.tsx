import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { MilestoneList } from "@/components/milestones/milestone-list";
import { getMilestonesData } from "@/lib/milestones";

export default async function MilestonesPage() {
  const data = await getMilestonesData();
  if (!data) redirect("/login");

  const { milestones, milestonesError } = data;

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Achievements"
        title="Milestones"
        description="Celebrate your progress as you train, play, and hit your goals."
      />

      <MilestoneList summary={milestones} error={milestonesError} />
    </section>
  );
}
