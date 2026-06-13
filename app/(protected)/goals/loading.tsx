import { PageHeader } from "@/components/layout/page-header";

export default function GoalsLoading() {
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Targets"
        title="Goals"
        description="Loading your goals..."
      />
      <p className="text-sm text-muted">Loading goals...</p>
    </section>
  );
}
