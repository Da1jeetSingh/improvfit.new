import type { FocusArea } from "@/types/training";
import type { GoalCategory } from "@/types/goal";
import type { PlayerRole } from "@/types/profile";

export function showsBattingLogFields(role: PlayerRole | null | undefined) {
  return role === "batsman" || role === "all-rounder";
}

export function showsBowlingLogFields(role: PlayerRole | null | undefined) {
  return role === "bowler" || role === "all-rounder";
}

export function getDefaultTrainingFocus(
  role: PlayerRole | null | undefined,
): FocusArea {
  if (role === "bowler") {
    return "bowling";
  }

  if (role === "batsman") {
    return "batting";
  }

  return "batting";
}

export function getTrainingFocusOptions(
  role: PlayerRole | null | undefined,
): FocusArea[] {
  if (role === "batsman") {
    return ["batting", "fielding", "other"];
  }

  if (role === "bowler") {
    return ["bowling", "fielding", "other"];
  }

  return ["batting", "bowling", "fielding", "other"];
}

export function getDefaultGoalCategory(
  role: PlayerRole | null | undefined,
): GoalCategory | "" {
  if (role === "batsman") {
    return "batting";
  }

  if (role === "bowler") {
    return "bowling";
  }

  if (role === "all-rounder") {
    return "general";
  }

  return "";
}

export function getGoalCategoryOptions(
  role: PlayerRole | null | undefined,
): GoalCategory[] {
  if (role === "batsman") {
    return ["batting", "fitness", "mental", "general"];
  }

  if (role === "bowler") {
    return ["bowling", "fitness", "mental", "general"];
  }

  return ["batting", "bowling", "fitness", "mental", "general"];
}
