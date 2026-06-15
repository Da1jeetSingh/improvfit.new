import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getSession, onboardingRoute } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import { getActivityStreak } from "@/lib/streak";
import { isOnboardingComplete } from "@/types/profile";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [profile, streak] = await Promise.all([
    getProfile(),
    getActivityStreak(),
  ]);

  if (profile && !isOnboardingComplete(profile)) {
    redirect(onboardingRoute);
  }

  return (
    <AppShell email={session.user.email} currentStreak={streak?.currentStreak ?? 0}>
      {children}
    </AppShell>
  );
}
