import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  emptyCardClassName,
  formatDate,
  formatLabel,
  sectionHeadingClassName,
} from "@/components/ui/form-styles";
import type { TrainingSession } from "@/types/training";

type TrainingListProps = {
  sessions: TrainingSession[];
};

export function TrainingList({ sessions }: TrainingListProps) {
  if (sessions.length === 0) {
    return (
      <Card
        title="Your sessions"
        description="Saved training logs will appear here."
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          No training sessions yet. Log your first practice above — even a short
          net or fielding drill counts.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className={sectionHeadingClassName}>Your sessions</h2>
        <p className="mt-1.5 text-sm text-muted">
          {sessions.length} saved {sessions.length === 1 ? "session" : "sessions"}
        </p>
      </div>

      <ul className="space-y-4">
        {sessions.map((session) => (
          <li key={session.id}>
            <Card padding="sm">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-foreground">
                    {formatDate(session.session_date)}
                  </p>
                  <Badge variant="success">{formatLabel(session.focus)}</Badge>
                  {session.self_rating ? (
                    <Badge>{session.self_rating}/5</Badge>
                  ) : null}
                </div>

                <p className="text-sm text-muted">
                  {session.duration_minutes} min
                  {session.balls_faced !== null
                    ? ` · ${session.balls_faced} balls faced`
                    : ""}
                </p>

                {session.notes ? (
                  <p className="text-sm leading-relaxed text-foreground">{session.notes}</p>
                ) : null}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
