import { Card } from "@/components/ui/card";
import {
  showsBattingLogFields,
  showsBowlingLogFields,
} from "@/lib/logging/role-fields";
import { formatProfileValue, type PlayerProfile } from "@/types/profile";

type ProfileIdentityProps = {
  profile: PlayerProfile;
};

function IdentityItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="ds-mini-stat px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="mt-1.5 text-base font-bold text-foreground">{value}</p>
    </div>
  );
}

export function ProfileIdentity({ profile }: ProfileIdentityProps) {
  const showBatting = showsBattingLogFields(profile.role);
  const showBowling = showsBowlingLogFields(profile.role);

  const items: { label: string; value: string }[] = [];

  if (showBatting && profile.batting_hand) {
    items.push({
      label: "Batting hand",
      value: formatProfileValue(profile.batting_hand),
    });
  }

  if (showBowling && profile.bowling_hand) {
    items.push({
      label: "Bowling hand",
      value: formatProfileValue(profile.bowling_hand),
    });
  }

  if (showBowling && profile.bowling_type) {
    const bowlingType = formatProfileValue(profile.bowling_type);
    const spinDetail =
      profile.bowling_type === "spinner" && profile.bowling_style_details
        ? ` · ${formatProfileValue(profile.bowling_style_details)}`
        : "";

    items.push({
      label: "Bowling type",
      value: `${bowlingType}${spinDetail}`,
    });
  }

  if (items.length === 0) {
    return (
      <Card
        title="Playing identity"
        description="Role-specific details from your profile."
      >
        <p className="text-sm leading-relaxed text-muted">
          Add your batting or bowling details in profile settings to complete
          your athlete card.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Playing identity"
      description="How you show up on the field."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <IdentityItem key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </Card>
  );
}
