import { redirect } from "next/navigation";

import { ProfileAchievementsPreview } from "@/components/profile/profile-achievements-preview";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileIdentity } from "@/components/profile/profile-identity";
import { ProfileStatStrip } from "@/components/profile/profile-stat-strip";
import { pageSectionClassName } from "@/components/ui/form-styles";
import { getProfilePageData } from "@/lib/profile/page-data";

export default async function ProfilePage() {
  const data = await getProfilePageData();

  if (!data) {
    redirect("/login");
  }

  const { profile, stats, achievements } = data;

  return (
    <section className={pageSectionClassName}>
      <ProfileHeader profile={profile} />
      <ProfileStatStrip stats={stats} />
      <ProfileIdentity profile={profile} />
      <ProfileAchievementsPreview summary={achievements} />
    </section>
  );
}
