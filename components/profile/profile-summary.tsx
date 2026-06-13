import { Card } from "@/components/ui/card";
import {
  formatProfileValue,
  hasProfileData,
  type PlayerProfile,
} from "@/types/profile";

type ProfileSummaryProps = {
  profile: PlayerProfile;
};

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  if (!hasProfileData(profile)) {
    return null;
  }

  return (
    <Card
      title="Saved profile"
      description="Your current details from Supabase."
      className="mb-6"
    >
      <dl className="space-y-3">
        <SummaryItem label="Name" value={formatProfileValue(profile.full_name)} />
        <SummaryItem label="Age" value={formatProfileValue(profile.age)} />
        <SummaryItem label="Role" value={formatProfileValue(profile.role)} />
        <SummaryItem
          label="Batting style"
          value={formatProfileValue(profile.batting_style)}
        />
        <SummaryItem
          label="Bowling style"
          value={formatProfileValue(profile.bowling_style)}
        />
        <SummaryItem
          label="Skill level"
          value={formatProfileValue(profile.skill_level)}
        />
        <SummaryItem
          label="Main goal"
          value={formatProfileValue(profile.personal_goals)}
        />
      </dl>
    </Card>
  );
}
