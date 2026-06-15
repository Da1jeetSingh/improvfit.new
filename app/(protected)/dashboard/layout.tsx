import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { onboardingRoute } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import { isOnboardingComplete } from "@/types/profile";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  if (profile && !isOnboardingComplete(profile)) {
    redirect(onboardingRoute);
  }

  return <DashboardShell>{children}</DashboardShell>;
}
