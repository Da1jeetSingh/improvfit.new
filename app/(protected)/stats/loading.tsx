import { PageHeader } from "@/components/layout/page-header";

export default function StatsLoading() {
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Analytics"
        title="Stats"
        description="Loading your performance metrics..."
      />
      <p className="text-sm text-muted">Loading stats...</p>
    </section>
  );
}
