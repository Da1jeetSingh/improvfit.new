import { CoachMessageCard } from "@/components/coach/coach-message-card";
import { SaveInsightCard } from "@/components/save/save-insight-card";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import {
  demoCoachMessage,
  demoInsights,
  demoProfile,
  demoSaveInsight,
} from "@/lib/video-demo/mock-data";

export default function VideoDemoInsightsPage() {
  return (
    <AppShell email={demoProfile.email ?? undefined} currentStreak={12}>
      <header className="mb-8 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
          Intelligent coaching
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-green-deep sm:text-4xl">
          AI-powered insights
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          IMPROV analyzes your performance patterns and delivers personalized
          recommendations — so you always know what to work on next.
        </p>
      </header>

      <div className="space-y-6">
        <CoachMessageCard message={demoCoachMessage} />

        <SaveInsightCard insight={demoSaveInsight} />

        <section className="grid gap-4 lg:grid-cols-3">
          {demoInsights.map((insight) => (
            <Card key={insight.title} padding="sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
                {insight.type === "trend"
                  ? "Trend detected"
                  : insight.type === "pattern"
                    ? "Pattern found"
                    : "Recommendation"}
              </p>
              <h2 className="mt-2 text-base font-bold text-green-deep">
                {insight.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {insight.detail}
              </p>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
