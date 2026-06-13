export const playerRoles = ["batsman", "bowler", "all-rounder"] as const;

export const battingStyles = ["right-hand", "left-hand"] as const;

export const bowlingStyles = [
  "none",
  "right-arm fast",
  "right-arm medium",
  "right-arm spin",
  "left-arm fast",
  "left-arm medium",
  "left-arm spin",
] as const;

export const skillLevels = [
  "beginner",
  "intermediate",
  "advanced",
  "elite",
] as const;

export type PlayerRole = (typeof playerRoles)[number] | "wicket-keeper";
export type BattingStyle = (typeof battingStyles)[number];
export type BowlingStyle = (typeof bowlingStyles)[number];
export type SkillLevel = (typeof skillLevels)[number];

export type PlayerProfile = {
  id: string;
  full_name: string | null;
  age: number | null;
  role: PlayerRole | null;
  batting_style: BattingStyle | null;
  bowling_style: BowlingStyle | null;
  skill_level: SkillLevel | null;
  personal_goals: string | null;
  created_at: string;
};

export const profileSelect =
  "id, full_name, age, role, batting_style, bowling_style, skill_level, personal_goals, created_at";

export function hasProfileData(profile: PlayerProfile) {
  return Boolean(
    profile.full_name ||
      profile.age !== null ||
      profile.role ||
      profile.batting_style ||
      profile.bowling_style ||
      profile.skill_level ||
      profile.personal_goals,
  );
}

export function formatProfileValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return String(value);
  }

  return value
    .split(/[\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
