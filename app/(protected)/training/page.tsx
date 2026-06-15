import { redirect } from "next/navigation";

import { AddTrainingButton } from "@/components/training/training-form";
import { TrainingList } from "@/components/training/training-list";
import { PageHeader } from "@/components/layout/page-header";
import { alertErrorClassName } from "@/components/ui/form-styles";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import { getTrainingSessions } from "@/lib/training";

export default async function TrainingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [profile, { sessions, error }] = await Promise.all([
    getProfile(),
    getTrainingSessions(),
  ]);

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          className="mb-0 flex-1"
          eyebrow="Training"
          title="Training log"
          description="Review your practice history and log new sessions."
        />
        <AddTrainingButton role={profile?.role ?? null} />
      </div>

      {error ? (
        <p className={alertErrorClassName} role="alert">
          Could not load training sessions: {error}
        </p>
      ) : null}

      <TrainingList sessions={sessions} />
    </section>
  );
}
