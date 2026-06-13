import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { GoalForm } from "@/components/goals/goal-form";
import { GoalList } from "@/components/goals/goal-list";
import { getSession } from "@/lib/auth";
import { getGoals } from "@/lib/goals";

export default async function GoalsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const goals = await getGoals();

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Targets"
        title="Goals"
        description="Set targets and track how close you are to reaching them."
      />
      <GoalForm />
      <GoalList goals={goals} />
    </section>
  );
}
