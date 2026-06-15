import { redirect } from "next/navigation";

import { AddGoalButton } from "@/components/goals/goal-form";
import { GoalList } from "@/components/goals/goal-list";
import { PageHeader } from "@/components/layout/page-header";
import { alertErrorClassName } from "@/components/ui/form-styles";
import { getSession } from "@/lib/auth";
import { getGoals } from "@/lib/goals";
import { getProfile } from "@/lib/profile";

export default async function GoalsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [profile, { goals, error }] = await Promise.all([
    getProfile(),
    getGoals(),
  ]);

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          className="mb-0 flex-1"
          eyebrow="Goals"
          title="Goals"
          description="Track targets and manage your cricket ambitions."
        />
        <AddGoalButton role={profile?.role ?? null} />
      </div>

      {error ? (
        <p className={alertErrorClassName} role="alert">
          Could not load goals: {error}
        </p>
      ) : null}

      <GoalList goals={goals} />
    </section>
  );
}
