import { Card } from "@/components/ui/card";
import type {
  BatsmanCareerStats,
  BowlerCareerStats,
  CareerOverview,
} from "@/lib/profile/career-stats";
import { formatProfileValue } from "@/types/profile";

type ProfileCareerOverviewProps = {
  career: CareerOverview;
};

function CareerStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="ds-mini-stat px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function BatsmanOverview({
  stats,
  title,
}: {
  stats: BatsmanCareerStats;
  title?: string;
}) {
  return (
    <div className="space-y-4">
      {title ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
          {title}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CareerStat label="Matches" value={String(stats.matches)} />
        <CareerStat label="Total runs" value={String(stats.totalRuns)} />
        <CareerStat
          label="Strike rate"
          value={
            stats.careerStrikeRate !== null
              ? String(stats.careerStrikeRate)
              : "—"
          }
          hint="Career average"
        />
        <CareerStat
          label="Training sessions"
          value={String(stats.trainingSessions)}
        />
        <CareerStat
          label="Goals completed"
          value={String(stats.goalsCompleted)}
        />
        <CareerStat label="Balls faced" value={String(stats.ballsFaced)} />
        <CareerStat label="Fours" value={String(stats.fours)} />
        <CareerStat label="Sixes" value={String(stats.sixes)} />
      </div>
    </div>
  );
}

function BowlerOverview({
  stats,
  title,
}: {
  stats: BowlerCareerStats;
  title?: string;
}) {
  return (
    <div className="space-y-4">
      {title ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
          {title}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <CareerStat label="Matches" value={String(stats.matches)} />
        <CareerStat label="Wickets" value={String(stats.totalWickets)} />
        <CareerStat
          label="Economy"
          value={stats.economyRate !== null ? String(stats.economyRate) : "—"}
        />
        <CareerStat
          label="Training sessions"
          value={String(stats.trainingSessions)}
        />
        <CareerStat
          label="Goals completed"
          value={String(stats.goalsCompleted)}
        />
        <CareerStat label="Overs bowled" value={String(stats.oversBowled)} />
      </div>
    </div>
  );
}

export function ProfileCareerOverview({ career }: ProfileCareerOverviewProps) {
  if (career.role === "other") {
    return (
      <Card
        title="Career overview"
        description="Log matches and training to build your career snapshot."
      >
        <p className="text-sm leading-relaxed text-muted">
          Complete your playing role in profile settings to unlock role-specific
          career stats.
        </p>
      </Card>
    );
  }

  if (career.role === "batsman") {
    return (
      <Card
        title="Career overview"
        description="Your batting record across logged matches and training."
      >
        <BatsmanOverview stats={career.stats} />
      </Card>
    );
  }

  if (career.role === "bowler") {
    return (
      <Card
        title="Career overview"
        description="Your bowling record across logged matches and training."
      >
        <BowlerOverview stats={career.stats} />
      </Card>
    );
  }

  return (
    <Card
      title="Career overview"
      description={`All-round snapshot · ${formatProfileValue(career.role)}`}
    >
      <div className="space-y-8">
        <BatsmanOverview stats={career.batting} title="Batting" />
        <BowlerOverview stats={career.bowling} title="Bowling" />
      </div>
    </Card>
  );
}
