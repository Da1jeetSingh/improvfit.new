import { StreakBadge } from "@/components/streak/streak-badge";

type HeaderStreakProps = {
  count: number;
};

export function HeaderStreak({ count }: HeaderStreakProps) {
  if (count <= 0) {
    return null;
  }

  return <StreakBadge count={count} />;
}
