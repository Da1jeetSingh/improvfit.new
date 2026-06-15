import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardModuleGrid } from "@/components/dashboard/dashboard-module-grid";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { getDashboardData } from "@/lib/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) redirect("/login");

  const {
    profile,
    metrics,
    progressSummary,
    weeklyProgress,
    progressError,
    recentMatches,
    recentSessions,
    recentGoals,
  } = data;

  return (
    <>
      <DashboardHeader profile={profile} />

      <DashboardStats metrics={metrics} progressSummary={progressSummary} />

      <DashboardModuleGrid
        hasActivity={progressSummary.hasAnyData}
        weeklyProgress={weeklyProgress}
        progressError={progressError}
      />

      <RecentActivity
        matches={recentMatches}
        sessions={recentSessions}
        goals={recentGoals}
      />
    </>
  );
}
