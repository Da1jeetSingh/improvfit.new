export const playerRoles = ["batsman", "bowler", "all-rounder"] as const;

export const battingHands = ["left", "right"] as const;

export const battingOrders = [
  "top order",
  "middle order",
  "lower order",
] as const;

export const bowlingHands = ["left", "right"] as const;

export const bowlingTypes = ["fast", "medium pace", "spinner"] as const;

export const bowlingStyleDetails = ["leg spin", "off spin"] as const;

export const skillLevels = [
  "beginner",
  "intermediate",
  "advanced",
  "elite",
] as const;

export const playingLevels = [
  "grassroots",
  "school",
  "club",
  "academy",
  "county",
  "semi-professional",
  "professional",
] as const;

export type PlayerRole = (typeof playerRoles)[number] | "wicket-keeper";
export type BattingHand = (typeof battingHands)[number];
export type BattingOrder = (typeof battingOrders)[number];
export type BowlingHand = (typeof bowlingHands)[number];
export type BowlingType = (typeof bowlingTypes)[number];
export type BowlingStyleDetail = (typeof bowlingStyleDetails)[number];
export type SkillLevel = (typeof skillLevels)[number];
export type PlayingLevel = (typeof playingLevels)[number];

export type PlayerProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  age: number | null;
  mobile_number: string | null;
  avatar_url: string | null;
  is_academy_player: boolean | null;
  played_professionally: boolean | null;
  tracks_performance: boolean | null;
  playing_level: PlayingLevel | null;
  role: PlayerRole | null;
  batting_hand: BattingHand | null;
  batting_order: BattingOrder | null;
  bowling_hand: BowlingHand | null;
  bowling_type: BowlingType | null;
  bowling_style_details: BowlingStyleDetail | null;
  skill_level: SkillLevel | null;
  personal_goals: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export const profileSelect =
  "id, email, full_name, age, mobile_number, avatar_url, is_academy_player, played_professionally, tracks_performance, playing_level, role, batting_hand, batting_order, bowling_hand, bowling_type, bowling_style_details, skill_level, personal_goals, onboarding_completed, created_at, updated_at";

export function hasBattingDetails(
  profile: Pick<PlayerProfile, "batting_hand" | "batting_order">,
) {
  return Boolean(profile.batting_hand && profile.batting_order);
}

export function hasBowlingDetails(
  profile: Pick<
    PlayerProfile,
    "bowling_hand" | "bowling_type" | "bowling_style_details"
  >,
) {
  if (!profile.bowling_hand || !profile.bowling_type) {
    return false;
  }

  if (profile.bowling_type === "spinner") {
    return Boolean(profile.bowling_style_details);
  }

  return true;
}

export function isOnboardingComplete(profile: PlayerProfile) {
  if (profile.onboarding_completed) {
    return true;
  }

  if (!profile.role) {
    return false;
  }

  if (profile.role === "batsman") {
    return hasBattingDetails(profile);
  }

  if (profile.role === "bowler") {
    return hasBowlingDetails(profile);
  }

  if (profile.role === "all-rounder") {
    return hasBattingDetails(profile) && hasBowlingDetails(profile);
  }

  return true;
}

export function hasProfileData(profile: PlayerProfile) {
  return Boolean(
    profile.full_name ||
      profile.age !== null ||
      profile.role ||
      profile.batting_hand ||
      profile.batting_order ||
      profile.bowling_hand ||
      profile.bowling_type ||
      profile.bowling_style_details ||
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
