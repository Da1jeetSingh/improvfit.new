import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { MonthlyRecap } from "@/lib/recap/calculate";

type RecapHighlightsProps = {
  recap: MonthlyRecap;
};

export function RecapHighlights({ recap }: RecapHighlightsProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card
        title="Highlights"
        description="Standout moments from your month."
      >
        <div className="space-y-3">
          {recap.highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-4"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-green-sage/25 bg-green-tint/40 text-xl"
                aria-hidden
              >
                {highlight.icon}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{highlight.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {highlight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Goal progress"
        description="Where your targets stand right now."
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="ds-mini-stat px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                Active goals
              </p>
              <p className="mt-1.5 text-2xl font-bold text-foreground">
                {recap.goalProgress.active}
              </p>
            </div>
            <div className="ds-mini-stat px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                Completed
              </p>
              <p className="mt-1.5 text-2xl font-bold text-foreground">
                {recap.goalProgress.completed}
              </p>
            </div>
          </div>

          {recap.goalProgress.averageProgress !== null ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Average progress across measurable goals
              </p>
              <ProgressBar value={recap.goalProgress.averageProgress} />
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              Set measurable targets on your goals to track progress here.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
