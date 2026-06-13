import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrainingForm } from "@/components/training/training-form";
import { TrainingList } from "@/components/training/training-list";
import { getSession } from "@/lib/auth";
import { getTrainingSessions } from "@/lib/training";

export default async function TrainingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const sessions = await getTrainingSessions();

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Practice"
        title="Training"
        description="Log sessions fast and build a clear training habit."
      />
      <TrainingForm />
      <TrainingList sessions={sessions} />
    </section>
  );
}
