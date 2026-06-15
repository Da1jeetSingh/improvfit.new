import { redirect } from "next/navigation";

import { isFounderEmail } from "@/lib/admin/access";
import { dashboardRoute, getSession, onboardingRoute } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import { isOnboardingComplete } from "@/types/profile";

export default async function FounderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/admin");
  }

  if (!isFounderEmail(session.user.email)) {
    redirect(dashboardRoute);
  }

  const profile = await getProfile();

  if (profile && !isOnboardingComplete(profile)) {
    redirect(onboardingRoute);
  }

  return (
    <div className="relative min-h-full bg-background">
      <div className="ds-ambient" aria-hidden />
      <div className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </div>
    </div>
  );
}
