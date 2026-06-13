import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileSummary } from "@/components/profile/profile-summary";
import { Card } from "@/components/ui/card";
import { getProfile } from "@/lib/profile";
import { hasProfileData } from "@/types/profile";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Player"
        title="Your profile"
        description="Create and update your cricket player profile. Only you can see this."
      />

      {hasProfileData(profile) ? (
        <ProfileSummary profile={profile} />
      ) : (
        <Card className="border-dashed">
          <p className="text-sm text-muted">
            No profile saved yet. Fill in the form below and tap Save profile.
          </p>
        </Card>
      )}

      <ProfileForm profile={profile} />
    </section>
  );
}
