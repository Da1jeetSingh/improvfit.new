import { PageHeader } from "@/components/layout/page-header";

export default function TrainingLoading() {
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Practice"
        title="Training"
        description="Loading your training sessions..."
      />
      <p className="text-sm text-muted">Loading training sessions...</p>
    </section>
  );
}
