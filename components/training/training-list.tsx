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
        title="Past sessions"
        description="Saved training logs will appear here."
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          No training sessions yet. Tap Add Session to log your first practice.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className={sectionHeadingClassName}>Past sessions</h2>
        <p className="mt-1.5 text-sm text-muted">
          {sessions.length} saved {sessions.length === 1 ? "session" : "sessions"}
        </p>
      </div>

      <ul className="space-y-4">
        {sessions.map((session) => (
          <li key={session.id}>
            <Card padding="sm">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-muted">
                    {formatDate(session.session_date)}
                  </p>
                  <span className="rounded-full border border-border-subtle bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
                    {session.duration_minutes} min
                  </span>
                </div>

                <p className="text-base font-bold text-foreground">
                  {formatLabel(session.focus)}
                </p>

                {session.balls_faced !== null ? (
                  <p className="text-sm text-muted">{session.balls_faced} balls faced</p>
                ) : null}

                {session.notes ? (
                  <p className="text-sm leading-relaxed text-muted">{session.notes}</p>
                ) : null}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
