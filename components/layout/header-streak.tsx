import { StreakBadge } from "@/components/streak/streak-badge";

type HeaderStreakProps = {
  count: number;
};

export function HeaderStreak({ count }: HeaderStreakProps) {
  return <StreakBadge count={count} />;
}
