import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { GoalForm } from "@/components/goals/goal-form";
import { GoalList } from "@/components/goals/goal-list";
import { alertErrorClassName } from "@/components/ui/form-styles";
import { getSession } from "@/lib/auth";
import { getGoals } from "@/lib/goals";

export default async function GoalsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { goals, error } = await getGoals();

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Goals"
        title="Convert ambition into visible targets."
        description="Create, track, and manage your own cricket goals."
      />

      {error ? (
        <p className={alertErrorClassName} role="alert">
          Could not load goals: {error}
        </p>
      ) : null}

      <GoalForm />
      <GoalList goals={goals} />
    </section>
  );
}
