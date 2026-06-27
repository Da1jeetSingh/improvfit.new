import { redirect } from "next/navigation";

import { ProfileAchievementsPreview } from "@/components/profile/profile-achievements-preview";
import { ProfileCareerOverview } from "@/components/profile/profile-career-overview";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileIdentity } from "@/components/profile/profile-identity";
import { ProfileStatStrip } from "@/components/profile/profile-stat-strip";
import { getProfilePageData } from "@/lib/profile/page-data";

export default async function ProfilePage() {
  const data = await getProfilePageData();

  if (!data) {
    redirect("/login");
  }

  const { profile, stats, career, achievements } = data;

  return (
    <section className="space-y-8">
      <ProfileHeader profile={profile} />
      <ProfileStatStrip stats={stats} />
      <ProfileCareerOverview career={career} />
      <ProfileIdentity profile={profile} />
      <ProfileAchievementsPreview summary={achievements} />
    </section>
  );
}
