import { redirect } from "next/navigation";

import { GoalForm } from "@/components/goals/goal-form";
import { GoalList } from "@/components/goals/goal-list";
import { getSession } from "@/lib/auth";
import { getGoals } from "@/lib/goals";

export default async function GoalsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const goals = await getGoals();

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
        <p className="mt-2 text-zinc-600">
          Create targets and track how close you are to reaching them.
        </p>
      </header>

      <GoalForm />
      <GoalList goals={goals} />
    </section>
  );
}
