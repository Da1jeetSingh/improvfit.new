import { Card } from "@/components/ui/card";
import { listRowClassName } from "@/components/ui/form-styles";
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
    <div className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${listRowClassName}`}>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="text-sm font-bold text-foreground">{value}</dd>
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
      description="Your current details."
      className="mb-8"
    >
      <dl className="space-y-3">
        <SummaryItem label="Name" value={formatProfileValue(profile.full_name)} />
        <SummaryItem label="Age" value={formatProfileValue(profile.age)} />
        <SummaryItem label="Role" value={formatProfileValue(profile.role)} />
        <SummaryItem
          label="Batting hand"
          value={formatProfileValue(profile.batting_hand)}
        />
        <SummaryItem
          label="Batting order"
          value={formatProfileValue(profile.batting_order)}
        />
        <SummaryItem
          label="Bowling hand"
          value={formatProfileValue(profile.bowling_hand)}
        />
        <SummaryItem
          label="Bowling type"
          value={formatProfileValue(profile.bowling_type)}
        />
        {profile.bowling_type === "spinner" ? (
          <SummaryItem
            label="Spin style"
            value={formatProfileValue(profile.bowling_style_details)}
          />
        ) : null}
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
