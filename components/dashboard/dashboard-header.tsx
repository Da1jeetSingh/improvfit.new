import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { getDashboardSubtitle } from "@/lib/dashboard/greeting";
import type { PlayerProfile } from "@/types/profile";

type DashboardHeaderProps = {
  profile: PlayerProfile | null;
};

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const firstName = profile?.full_name?.split(" ")[0];
  const title = firstName ? `Welcome back, ${firstName}` : "Welcome back";

  return (
    <header className="space-y-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-green-deep sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          {getDashboardSubtitle(profile)}
        </p>
      </div>
      <DashboardQuickActions />
    </header>
  );
}
