import type { Match } from "@/types/match";

export type TrendDirection = "above" | "below" | "neutral";

export type MetricContext = {
  direction: TrendDirection;
  label: string;
};

const WINDOW_SIZE = 5;

/**
 * Rolling average using up to `windowSize` prior values including the current point.
 * With fewer than windowSize matches, averages all available matches up to that point.
 */
export function calculateRollingAverage(
  values: number[],
  windowSize = WINDOW_SIZE,
): number[] {
  return values.map((_, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const window = values.slice(start, index + 1);
    const sum = window.reduce((total, value) => total + value, 0);
    return Math.round((sum / window.length) * 100) / 100;
  });
}

export function compareToBaseline(
  value: number | null,
  baseline: number | null,
  tolerance = 0.01,
): TrendDirection {
  if (value === null || baseline === null) {
    return "neutral";
  }

  if (value > baseline + tolerance) {
    return "above";
  }

  if (value < baseline - tolerance) {
    return "below";
  }

  return "neutral";
}

function sortMatchesChronologically(matches: Match[]) {
  return [...matches].sort((left, right) =>
    left.played_on.localeCompare(right.played_on),
  );
}

function averageNullable(values: Array<number | null>) {
  const valid = values.filter((value): value is number => value !== null);
  if (valid.length === 0) {
    return null;
  }

  const sum = valid.reduce((total, value) => total + value, 0);
  return Math.round((sum / valid.length) * 100) / 100;
}

/**
 * Baseline for a match = rolling average of up to 5 prior innings (chronological).
 */
export function getMatchRollingBaselines(
  matches: Match[],
  matchId: string,
  windowSize = WINDOW_SIZE,
) {
  const sorted = sortMatchesChronologically(matches);
  const index = sorted.findIndex((match) => match.id === matchId);

  if (index <= 0) {
    return { strikeRateBaseline: null, ballsFacedBaseline: null };
  }

  const prior = sorted.slice(Math.max(0, index - windowSize), index);

  return {
    strikeRateBaseline: averageNullable(prior.map((match) => match.strike_rate)),
    ballsFacedBaseline: averageNullable(prior.map((match) => match.balls_faced)),
  };
}

export function getMetricContext(
  value: number | null,
  baseline: number | null,
): MetricContext | null {
  const direction = compareToBaseline(value, baseline);

  if (direction === "neutral") {
    return null;
  }

  return {
    direction,
    label: direction === "above" ? "Above average" : "Below average",
  };
}

export function hasConsecutiveDecrease(
  values: Array<number | null>,
  consecutive = 3,
): boolean {
  const valid = values.filter((value): value is number => value !== null);

  if (valid.length < consecutive + 1) {
    return false;
  }

  const recent = valid.slice(-(consecutive + 1));

  for (let index = 1; index < recent.length; index += 1) {
    if (recent[index] >= recent[index - 1]) {
      return false;
    }
  }

  return true;
}

export function hasConsecutiveIncrease(
  values: Array<number | null>,
  consecutive = 3,
): boolean {
  const valid = values.filter((value): value is number => value !== null);

  if (valid.length < consecutive + 1) {
    return false;
  }

  const recent = valid.slice(-(consecutive + 1));

  for (let index = 1; index < recent.length; index += 1) {
    if (recent[index] <= recent[index - 1]) {
      return false;
    }
  }

  return true;
}

export function getRecentMatchValues(
  matches: Match[],
  getValue: (match: Match) => number | null,
  limit = WINDOW_SIZE,
) {
  return sortMatchesChronologically(matches)
    .slice(-limit)
    .map(getValue);
}

function isDismissed(match: Match) {
  return Boolean(match.dismissal_type && match.dismissal_type !== "not out");
}

export function getBattingFormTrend(matches: Match[]) {
  const sorted = sortMatchesChronologically(matches);
  const runs = sorted.map((match) => match.runs ?? 0);
  const rolling = calculateRollingAverage(runs, WINDOW_SIZE);

  return {
    labels: sorted.slice(-WINDOW_SIZE).map((_, index) => `M${index + 1}`),
    runs: runs.slice(-WINDOW_SIZE),
    rollingAverage: rolling.slice(-WINDOW_SIZE),
  };
}

export function getWeakestBattingTrend(matches: Match[]): string | null {
  const recentRuns = getRecentMatchValues(matches, (match) => match.runs);
  const recentBalls = getRecentMatchValues(matches, (match) => match.balls_faced);
  const recentStrikeRates = getRecentMatchValues(
    matches,
    (match) => match.strike_rate,
  );

  if (hasConsecutiveDecrease(recentBalls, 3)) {
    return "Time at the crease is dipping";
  }

  if (hasConsecutiveDecrease(recentRuns, 3)) {
    return "Runs trending down";
  }

  if (hasConsecutiveDecrease(recentStrikeRates, 3)) {
    return "Strike rate cooling off";
  }

  return null;
}

export function calculateMonthBattingStats(matches: Match[], monthStart: Date, monthEnd: Date) {
  const monthMatches = matches.filter((match) => {
    const date = new Date(`${match.played_on}T00:00:00`);
    return date >= monthStart && date <= monthEnd;
  });

  if (monthMatches.length === 0) {
    return null;
  }

  const totalRuns = monthMatches.reduce((sum, match) => sum + (match.runs ?? 0), 0);
  const totalBalls = monthMatches.reduce(
    (sum, match) => sum + (match.balls_faced ?? 0),
    0,
  );
  const dismissals = monthMatches.filter(isDismissed).length;

  const bestMatch = [...monthMatches].sort(
    (left, right) => (right.runs ?? 0) - (left.runs ?? 0),
  )[0];

  return {
    totalRuns,
    matchesPlayed: monthMatches.length,
    battingAverage:
      dismissals > 0
        ? Math.round((totalRuns / dismissals) * 100) / 100
        : null,
    strikeRate:
      totalBalls > 0
        ? Math.round((totalRuns / totalBalls) * 10000) / 100
        : null,
    bestMatch: {
      runs: bestMatch.runs ?? 0,
      opposition: bestMatch.opposition,
      playedOn: bestMatch.played_on,
    },
    weakestTrend: getWeakestBattingTrend(monthMatches),
  };
}
