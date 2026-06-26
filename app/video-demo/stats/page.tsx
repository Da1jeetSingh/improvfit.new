import { AppShell } from "@/components/layout/app-shell";
import { StatsProgress } from "@/components/stats/stats-progress";
import {
  demoProfile,
  demoStatsProgress,
} from "@/lib/video-demo/mock-data";

export default function VideoDemoStatsPage() {
  return (
    <AppShell email={demoProfile.email ?? undefined} currentStreak={12}>
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-green-deep sm:text-4xl">
          Stats & progress
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Track improvement over time with clear charts and role-specific metrics.
        </p>
      </header>
      <StatsProgress progress={demoStatsProgress} />
    </AppShell>
  );
}
