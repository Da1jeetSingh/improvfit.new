import { PageHeader } from "@/components/layout/page-header";

export default function ProfileLoading() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Player"
        title="Your profile"
        description="Loading your profile..."
      />
      <p className="text-sm text-muted">Loading profile...</p>
    </section>
  );
}
