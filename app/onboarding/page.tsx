import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { dashboardRoute } from "@/lib/auth";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import { isOnboardingComplete } from "@/types/profile";

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/onboarding");
  }

  const profile = await getProfile();

  if (profile && isOnboardingComplete(profile)) {
    redirect(dashboardRoute);
  }

  return <OnboardingFlow email={session.user.email} />;
}
