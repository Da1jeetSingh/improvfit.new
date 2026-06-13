import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { TrainingForm } from "@/components/training/training-form";
import { TrainingList } from "@/components/training/training-list";
import { alertErrorClassName } from "@/components/ui/form-styles";
import { getSession } from "@/lib/auth";
import { getTrainingSessions } from "@/lib/training";

export default async function TrainingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { sessions, error } = await getTrainingSessions();

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Practice"
        title="Training"
        description="Log sessions and review your own practice history."
      />

      {error ? (
        <p className={alertErrorClassName} role="alert">
          Could not load training sessions: {error}
        </p>
      ) : null}

      <TrainingForm />
      <TrainingList sessions={sessions} />
    </section>
  );
}
