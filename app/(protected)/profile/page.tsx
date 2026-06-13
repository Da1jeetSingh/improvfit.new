import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile/profile-form";
import { getProfile } from "@/lib/profile";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 text-zinc-600">
          View and update your player details. Only you can see this information.
        </p>
      </header>

      <ProfileForm profile={profile} />
    </section>
  );
}
