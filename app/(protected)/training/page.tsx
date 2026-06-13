import { redirect } from "next/navigation";

import { TrainingForm } from "@/components/training/training-form";
import { TrainingList } from "@/components/training/training-list";
import { getSession } from "@/lib/auth";
import { getTrainingSessions } from "@/lib/training";

export default async function TrainingPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const sessions = await getTrainingSessions();

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Training</h1>
        <p className="mt-2 text-zinc-600">
          Log practice sessions and track what you are working on.
        </p>
      </header>

      <TrainingForm />
      <TrainingList sessions={sessions} />
    </section>
  );
}
