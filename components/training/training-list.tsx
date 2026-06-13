import { Card } from "@/components/ui/card";
import { formatDate, formatLabel } from "@/components/ui/form-styles";
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
        className="border-dashed"
      >
        <p className="text-sm text-muted">
          No training sessions yet. Log your first practice above — even a short
          net or fielding drill counts.
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Your sessions</h2>
        <p className="mt-1 text-sm text-muted">
          {sessions.length} saved {sessions.length === 1 ? "session" : "sessions"}
        </p>
      </div>

      <ul className="space-y-3">
        {sessions.map((session) => (
          <li key={session.id}>
            <Card padding="sm">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {formatDate(session.session_date)}
                  </p>
                  <span className="rounded-full bg-green-muted px-2.5 py-0.5 text-xs font-medium text-green-deep">
                    {formatLabel(session.focus)}
                  </span>
                  {session.self_rating ? (
                    <span className="rounded-full bg-green-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                      {session.self_rating}/5
                    </span>
                  ) : null}
                </div>

                <p className="text-sm text-muted">
                  {session.duration_minutes} min
                  {session.balls_faced !== null
                    ? ` · ${session.balls_faced} balls faced`
                    : ""}
                </p>

                {session.notes ? (
                  <p className="text-sm text-foreground">{session.notes}</p>
                ) : null}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
