import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";
import type { PlayerProfile } from "@/types/profile";
import { showsBattingLogFields, showsBowlingLogFields } from "@/lib/logging/role-fields";

export type BatsmanCareerStats = {
  matches: number;
  totalRuns: number;
  careerStrikeRate: number | null;
  trainingSessions: number;
  goalsCompleted: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
};

export type BowlerCareerStats = {
  matches: number;
  totalWickets: number;
  economyRate: number | null;
  trainingSessions: number;
  goalsCompleted: number;
  oversBowled: number;
  runsConceded: number;
};

export type CareerOverview =
  | { role: "batsman"; stats: BatsmanCareerStats }
  | { role: "bowler"; stats: BowlerCareerStats }
  | { role: "all-rounder"; batting: BatsmanCareerStats; bowling: BowlerCareerStats }
  | { role: "other" };

function sumNullable(values: Array<number | null>) {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function buildBatsmanStats(
  matches: Match[],
  sessions: TrainingSession[],
  goals: Goal[],
): BatsmanCareerStats {
  const totalRuns = sumNullable(matches.map((match) => match.runs));
  const ballsFaced = sumNullable(matches.map((match) => match.balls_faced));

  return {
    matches: matches.length,
    totalRuns,
    careerStrikeRate:
      ballsFaced > 0 ? Math.round((totalRuns / ballsFaced) * 1000) / 10 : null,
    trainingSessions: sessions.length,
    goalsCompleted: goals.filter((goal) => goal.status === "completed").length,
    ballsFaced,
    fours: sumNullable(matches.map((match) => match.fours)),
    sixes: sumNullable(matches.map((match) => match.sixes)),
  };
}

function buildBowlerStats(
  matches: Match[],
  sessions: TrainingSession[],
  goals: Goal[],
): BowlerCareerStats {
  const totalWickets = sumNullable(matches.map((match) => match.wickets));
  const oversBowled = sumNullable(matches.map((match) => match.overs_bowled));
  const runsConceded = sumNullable(matches.map((match) => match.runs_conceded));

  return {
    matches: matches.length,
    totalWickets,
    economyRate:
      oversBowled > 0
        ? Math.round((runsConceded / oversBowled) * 10) / 10
        : null,
    trainingSessions: sessions.length,
    goalsCompleted: goals.filter((goal) => goal.status === "completed").length,
    oversBowled,
    runsConceded,
  };
}

export function buildCareerOverview(
  profile: PlayerProfile,
  matches: Match[],
  sessions: TrainingSession[],
  goals: Goal[],
): CareerOverview {
  const role = profile.role;

  if (role === "batsman" || (role === "wicket-keeper" && showsBattingLogFields(role))) {
    return {
      role: "batsman",
      stats: buildBatsmanStats(matches, sessions, goals),
    };
  }

  if (role === "bowler" && showsBowlingLogFields(role)) {
    return {
      role: "bowler",
      stats: buildBowlerStats(matches, sessions, goals),
    };
  }

  if (role === "all-rounder") {
    return {
      role: "all-rounder",
      batting: buildBatsmanStats(matches, sessions, goals),
      bowling: buildBowlerStats(matches, sessions, goals),
    };
  }

  return { role: "other" };
}
