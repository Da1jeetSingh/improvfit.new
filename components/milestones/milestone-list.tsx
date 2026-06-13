import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Milestone, MilestonesSummary } from "@/lib/dashboard/milestones";
import { cn } from "@/lib/utils";

type MilestoneListProps = {
  summary: MilestonesSummary;
  error?: string | null;
};

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 p-4 transition-colors",
        milestone.unlocked
          ? "border-green-deep/30 bg-green-muted/40"
          : "border-border bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{milestone.title}</p>
          <p className="mt-1 text-sm text-muted">{milestone.description}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
            milestone.unlocked
              ? "bg-green-deep text-white"
              : "bg-green-muted text-muted",
          )}
        >
          {milestone.unlocked ? "Unlocked" : "Locked"}
        </span>
      </div>

      {!milestone.unlocked ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted">
            {milestone.current} of {milestone.target}
          </p>
          <ProgressBar value={milestone.progress} showLabel={false} />
        </div>
      ) : (
        <p className="mt-3 text-sm font-medium text-green-deep">
          Milestone achieved
        </p>
      )}
    </div>
  );
}

export function MilestoneList({ summary, error }: MilestoneListProps) {
  if (error) {
    return (
      <Card title="Milestones" description="Celebrate your cricket progress.">
        <p className="text-sm text-red-600" role="alert">
          Could not load milestones: {error}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card
        title="Your progress"
        description={`${summary.unlockedCount} of ${summary.totalCount} milestones unlocked`}
      >
        {summary.unlockedCount === 0 ? (
          <p className="text-sm text-muted">
            No milestones unlocked yet. Log training, matches, or complete a
            goal to earn your first achievement.
          </p>
        ) : (
          <p className="text-sm text-muted">
            Keep going — every session and match brings you closer to the next
            milestone.
          </p>
        )}
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {summary.milestones.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
      </div>
    </div>
  );
}
