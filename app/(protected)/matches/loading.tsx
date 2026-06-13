import { PageHeader } from "@/components/layout/page-header";

export default function MatchesLoading() {
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Performance"
        title="Matches"
        description="Loading your match performances..."
      />
      <p className="text-sm text-muted">Loading matches...</p>
    </section>
  );
}
