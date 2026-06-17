import { Card } from "@/components/ui/card";
import { emptyCardClassName } from "@/components/ui/form-styles";
import type { CareerOverviewStats } from "@/lib/stats/trends";
import {
  showsBattingLogFields,
  showsBowlingLogFields,
} from "@/lib/logging/role-fields";
import type { PlayerRole } from "@/types/profile";

import { ProfileStatCard } from "./profile-stat-card";

type ProfileCareerOverviewProps = {
  role: PlayerRole | null;
  career: CareerOverviewStats | null;
};

export function ProfileCareerOverview({
  role,
  career,
}: ProfileCareerOverviewProps) {
  const showBatting = showsBattingLogFields(role);
  const showBowling = showsBowlingLogFields(role);

  if (!career) {
    return (
      <Card
        title="Career overview"
        description="Match totals from your logged performances."
        className={emptyCardClassName}
      >
        <p className="text-sm leading-relaxed text-muted">
          Log your first match to see career totals here.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Career overview"
      description="Match totals from your logged performances."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ProfileStatCard
          label="Matches"
          value={String(career.matches)}
          accent
        />

        {showBatting && career.runs !== undefined ? (
          <>
            <ProfileStatCard label="Runs" value={String(career.runs)} />
            <ProfileStatCard
              label="Balls faced"
              value={String(career.ballsFaced ?? 0)}
            />
            <ProfileStatCard label="Fours" value={String(career.fours ?? 0)} />
            <ProfileStatCard label="Sixes" value={String(career.sixes ?? 0)} />
          </>
        ) : null}

        {showBowling && career.wickets !== undefined ? (
          <>
            <ProfileStatCard label="Overs" value={String(career.overs ?? 0)} />
            <ProfileStatCard label="Wickets" value={String(career.wickets)} />
          </>
        ) : null}
      </div>
    </Card>
  );
}
