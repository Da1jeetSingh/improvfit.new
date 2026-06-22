import { calculateRollingAverage, getBattingFormTrend } from "@/lib/stats/trends";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

export type SaveInsight = {
  title: string;
  detail: string;
  chartData?: Array<{ label: string; value: number }>;
  chartSecondary?: Array<{ label: string; value: number }>;
};

function sortMatchesChronologically(matches: Match[]) {
  return [...matches].sort((left, right) =>
    left.played_on.localeCompare(right.played_on),
  );
}

export function getMatchSaveInsight(matches: Match[]): SaveInsight | null {
  const sorted = sortMatchesChronologically(matches);

  if (sorted.length === 0) {
    return null;
  }

  const recent = sorted.slice(-5);
  const runs = recent.map((match) => match.runs ?? 0);
  const rolling = calculateRollingAverage(runs, 5);
  const latestRolling = rolling.at(-1) ?? 0;
  const latestRuns = runs.at(-1) ?? 0;
  const form = getBattingFormTrend(sorted);

  const detail =
    sorted.length === 1
      ? `${latestRuns} runs logged — your batting form chart is live.`
      : `5-match rolling average: ${latestRolling} runs. Latest innings: ${latestRuns}.`;

  return {
    title: "Batting form updated",
    detail,
    chartData: form.runs.map((value, index) => ({
      label: form.labels[index] ?? `M${index + 1}`,
      value,
    })),
    chartSecondary: form.rollingAverage.map((value, index) => ({
      label: form.labels[index] ?? `M${index + 1}`,
      value,
    })),
  };
}

export function getTrainingSaveInsight(
  sessions: TrainingSession[],
  saved: TrainingSession,
): SaveInsight | null {
  const thisWeek = sessions.filter((session) => {
    const sessionDate = new Date(`${session.session_date}T00:00:00`);
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return sessionDate >= weekStart;
  }).length;

  const focusLabel =
    saved.focus === "batting"
      ? "batting"
      : saved.focus === "bowling"
        ? "bowling"
        : "training";

  return {
    title: "Session logged",
    detail:
      thisWeek <= 1
        ? `Your first ${focusLabel} session this week — momentum starts here.`
        : `${thisWeek} sessions logged this week. Consistency is building.`,
  };
}
