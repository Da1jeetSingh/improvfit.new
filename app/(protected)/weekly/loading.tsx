import { PageHeader } from "@/components/layout/page-header";

export default function WeeklyLoading() {
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Progress"
        title="Weekly progress"
        description="Loading your week..."
      />
      <p className="text-sm text-muted">Loading weekly progress...</p>
    </section>
  );
}
