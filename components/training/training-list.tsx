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
      >
        <p className="text-sm text-zinc-500">No training sessions logged yet.</p>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Your sessions</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {sessions.length} saved {sessions.length === 1 ? "session" : "sessions"}
        </p>
      </div>

      <ul className="space-y-3">
        {sessions.map((session) => (
          <li key={session.id}>
            <Card className="p-4 sm:p-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-zinc-900">
                    {formatDate(session.session_date)}
                  </p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    {formatLabel(session.focus)}
                  </span>
                  {session.self_rating ? (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                      {session.self_rating}/5
                    </span>
                  ) : null}
                </div>

                <p className="text-sm text-zinc-600">
                  {session.duration_minutes} min
                  {session.balls_faced !== null
                    ? ` · ${session.balls_faced} balls`
                    : ""}
                </p>

                {session.notes ? (
                  <p className="text-sm text-zinc-600">{session.notes}</p>
                ) : null}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
