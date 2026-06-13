import { PageHeader } from "@/components/layout/page-header";

export default function MilestonesLoading() {
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Achievements"
        title="Milestones"
        description="Loading your achievements..."
      />
      <p className="text-sm text-muted">Loading milestones...</p>
    </section>
  );
}
