import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { alertErrorClassName, emptyCardClassName } from "@/components/ui/form-styles";
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
        "ds-stat pl-5 pr-4 py-5 transition-all duration-300",
        milestone.unlocked && "border-green-sage/35",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">{milestone.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {milestone.description}
          </p>
        </div>
        <Badge variant={milestone.unlocked ? "brand" : "muted"}>
          {milestone.unlocked ? "Unlocked" : "Locked"}
        </Badge>
      </div>

      {!milestone.unlocked ? (
        <div className="mt-5 space-y-2">
          <p className="text-sm font-medium text-foreground">
            {milestone.current} of {milestone.target}
          </p>
          <ProgressBar value={milestone.progress} showLabel={false} />
        </div>
      ) : (
        <p className="mt-4 text-sm font-semibold text-green-deep">
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
        <p className={alertErrorClassName} role="alert">
          Could not load milestones: {error}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card
        title="Your progress"
        description={`${summary.unlockedCount} of ${summary.totalCount} milestones unlocked`}
        className={summary.unlockedCount === 0 ? emptyCardClassName : undefined}
      >
        {summary.unlockedCount === 0 ? (
          <p className="text-sm leading-relaxed text-muted">
            No milestones unlocked yet. Log training, matches, or complete a
            goal to earn your first achievement.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Keep going — every session and match brings you closer to the next
            milestone.
          </p>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {summary.milestones.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
      </div>
    </div>
  );
}
