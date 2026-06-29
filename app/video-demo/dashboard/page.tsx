import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardModuleGrid } from "@/components/dashboard/dashboard-module-grid";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AppShell } from "@/components/layout/app-shell";
import {
  demoCoachMessage,
  demoGoals,
  demoMatches,
  demoMetrics,
  demoProfile,
  demoProgressSummary,
  demoSessions,
  demoWeeklyProgress,
} from "@/lib/video-demo/mock-data";

export default function VideoDemoDashboardPage() {
  return (
    <AppShell email={demoProfile.email ?? undefined} currentStreak={12}>
      <DashboardHeader profile={demoProfile} />
      <DashboardStats
        metrics={demoMetrics}
        progressSummary={demoProgressSummary}
      />
      <DashboardModuleGrid
        hasActivity
        weeklyProgress={demoWeeklyProgress}
        coachMessage={demoCoachMessage}
      />
      <RecentActivity
        matches={demoMatches}
        sessions={demoSessions}
        goals={demoGoals}
      />
    </AppShell>
  );
}
