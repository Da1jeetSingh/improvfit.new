import { PageHeader } from "@/components/layout/page-header";

export default function DashboardLoading() {
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Loading your overview..."
      />
      <p className="text-sm text-muted">Loading dashboard...</p>
    </section>
  );
}
