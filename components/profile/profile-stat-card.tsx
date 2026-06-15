import { StatTile } from "@/components/ui/stat-tile";

type ProfileStatCardProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
};

export function ProfileStatCard({
  label,
  value,
  hint,
  accent = false,
}: ProfileStatCardProps) {
  return (
    <StatTile
      compact
      label={label}
      value={value}
      hint={hint}
      accent={accent}
    />
  );
}
