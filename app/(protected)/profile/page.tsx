import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile/profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { getProfile } from "@/lib/profile";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <section>
      <PageHeader
        eyebrow="Player"
        title="Your profile"
        description="Keep your details up to date so your dashboard stays personal."
      />
      <ProfileForm profile={profile} />
    </section>
  );
}
