import Link from "next/link";

import { Card } from "@/components/ui/card";
import {
  emptyCardClassName,
  formatDate,
  formatLabel,
  listRowClassName,
  sectionLinkClassName,
} from "@/components/ui/form-styles";
import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

type RecentActivityProps = {
  matches: Match[];
  sessions: TrainingSession[];
  goals: Goal[];
};

type ActivityItem = {
  id: string;
  date: string;
  label: string;
  detail: string;
  href: string;
};

function buildActivityItems(
  matches: Match[],
  sessions: TrainingSession[],
  goals: Goal[],
): ActivityItem[] {
  const items: ActivityItem[] = [
    ...matches.slice(0, 3).map((match) => ({
      id: `match-${match.id}`,
      date: match.played_on,
      label: "Match",
      detail: `${match.runs ?? 0} runs`,
      href: "/matches",
    })),
    ...sessions.slice(0, 3).map((session) => ({
      id: `session-${session.id}`,
      date: session.session_date,
      label: formatLabel(session.focus),
      detail: `${session.duration_minutes} min`,
      href: "/training",
    })),
    ...goals.slice(0, 2).map((goal) => ({
      id: `goal-${goal.id}`,
      date: goal.due_date ?? goal.created_at.slice(0, 10),
      label: "Goal",
      detail: goal.title,
      href: "/goals",
    })),
  ];

  return items
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
}

export function RecentActivity({
  matches,
  sessions,
  goals,
}: RecentActivityProps) {
  const items = buildActivityItems(matches, sessions, goals);

  if (items.length === 0) {
    return (
      <Card
        title="Recent activity"
        description="Your latest matches, training, and goals."
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          Nothing logged yet. Start with a training session or match to build
          your performance history.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Recent activity"
      description="Your latest matches, training, and goals."
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center justify-between gap-3 px-4 py-3 text-sm ${listRowClassName}`}
          >
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{item.label}</p>
              <p className="truncate text-muted">{item.detail}</p>
            </div>
            <span className="shrink-0 text-xs font-medium text-muted">
              {formatDate(item.date)}
            </span>
          </li>
        ))}
      </ul>
      <Link href="/stats" className={`mt-5 ${sectionLinkClassName}`}>
        View stats →
      </Link>
    </Card>
  );
}
