import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { getProfile } from "@/lib/profile";

export default async function ProfileEditPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Edit profile"
        description="Update your player details and cricket identity."
      />

      <p className="text-sm">
        <Link
          href="/profile"
          className="font-semibold text-green-deep transition-colors hover:text-foreground"
        >
          ← Back to profile
        </Link>
      </p>

      <ProfileForm profile={profile} />
    </section>
  );
}
