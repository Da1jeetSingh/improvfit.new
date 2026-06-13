import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { GoalForm } from "@/components/goals/goal-form";
import { getSession } from "@/lib/auth";
import { getGoal } from "@/lib/goals";

type EditGoalPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditGoalPage({ params }: EditGoalPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const goal = await getGoal(id);
  if (!goal) notFound();

  return (
    <section className="space-y-6">
      <Link
        href="/goals"
        className="text-sm font-semibold text-green-deep hover:underline"
      >
        ← Back to goals
      </Link>
      <PageHeader
        title="Edit goal"
        description="Update this goal and your progress."
      />
      <GoalForm goal={goal} />
    </section>
  );
}
