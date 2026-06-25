import type { CoachMessage } from "@/lib/coach/types";
import type { DashboardMetrics } from "@/lib/dashboard/metrics";
import type { ProgressSummary } from "@/lib/dashboard/progress-summary";
import type { WeeklyProgress } from "@/lib/dashboard/weekly-progress";
import type { SaveInsight } from "@/lib/stats/save-insights";
import type { RoleProgressStats } from "@/lib/stats/progress";
import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { PlayerProfile } from "@/types/profile";
import type { TrainingSession } from "@/types/training";

const USER_ID = "demo-user";

export const demoProfile: PlayerProfile = {
  id: USER_ID,
  email: "alex.chen@example.com",
  full_name: "Alex Chen",
  age: 22,
  role: "all-rounder",
  batting_hand: "right",
  batting_order: "top order",
  bowling_hand: "right",
  bowling_type: "medium pace",
  bowling_style_details: null,
  skill_level: "advanced",
  personal_goals: "Improve strike rate in powerplay overs",
  onboarding_completed: true,
  created_at: "2025-09-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z",
};

export const demoMatches: Match[] = [
  {
    id: "m1",
    user_id: USER_ID,
    played_on: "2026-06-20",
    opposition: "Northside CC",
    format: "t20",
    runs: 68,
    balls_faced: 42,
    strike_rate: 161.9,
    fours: 6,
    sixes: 3,
    dismissal_type: "caught",
    wickets: 2,
    overs_bowled: 4,
    runs_conceded: 28,
    notes: null,
    created_at: "2026-06-20T12:00:00Z",
  },
  {
    id: "m2",
    user_id: USER_ID,
    played_on: "2026-06-14",
    opposition: "Valley XI",
    format: "t20",
    runs: 45,
    balls_faced: 38,
    strike_rate: 118.4,
    fours: 4,
    sixes: 1,
    dismissal_type: "bowled",
    wickets: 1,
    overs_bowled: 3,
    runs_conceded: 22,
    notes: null,
    created_at: "2026-06-14T12:00:00Z",
  },
  {
    id: "m3",
    user_id: USER_ID,
    played_on: "2026-06-08",
    opposition: "East Enders",
    format: "odi",
    runs: 82,
    balls_faced: 91,
    strike_rate: 90.1,
    fours: 8,
    sixes: 2,
    dismissal_type: "not out",
    wickets: 3,
    overs_bowled: 8,
    runs_conceded: 41,
    notes: null,
    created_at: "2026-06-08T12:00:00Z",
  },
];

export const demoSessions: TrainingSession[] = [
  {
    id: "t1",
    user_id: USER_ID,
    session_date: "2026-06-22",
    duration_minutes: 90,
    balls_faced: 120,
    overs_bowled: 6,
    balls_bowled: 36,
    focus: "batting",
    notes: "Powerplay simulation",
    self_rating: 4,
    created_at: "2026-06-22T08:00:00Z",
  },
  {
    id: "t2",
    user_id: USER_ID,
    session_date: "2026-06-19",
    duration_minutes: 75,
    balls_faced: 80,
    overs_bowled: 5,
    balls_bowled: 30,
    focus: "bowling",
    notes: "Yorker practice",
    self_rating: 5,
    created_at: "2026-06-19T08:00:00Z",
  },
  {
    id: "t3",
    user_id: USER_ID,
    session_date: "2026-06-17",
    duration_minutes: 60,
    balls_faced: 60,
    overs_bowled: null,
    balls_bowled: null,
    focus: "batting",
    notes: "Net session",
    self_rating: 4,
    created_at: "2026-06-17T08:00:00Z",
  },
];

export const demoGoals: Goal[] = [
  {
    id: "g1",
    user_id: USER_ID,
    title: "Raise batting average to 42",
    description: "Focus on building innings",
    category: "batting",
    target_value: 42,
    target_outcome: "Season average",
    current_value: 38,
    due_date: "2026-08-31",
    status: "in_progress",
    created_at: "2026-05-01T00:00:00Z",
  },
  {
    id: "g2",
    user_id: USER_ID,
    title: "Log 3 training sessions per week",
    description: "Maintain consistent rhythm",
    category: "fitness",
    target_value: 3,
    target_outcome: "Weekly sessions",
    current_value: 3,
    due_date: null,
    status: "in_progress",
    created_at: "2026-04-15T00:00:00Z",
  },
  {
    id: "g3",
    user_id: USER_ID,
    title: "Economy under 7.0 in T20",
    description: "Death bowling focus",
    category: "bowling",
    target_value: 7,
    target_outcome: "Economy rate",
    current_value: 7.2,
    due_date: "2026-07-15",
    status: "in_progress",
    created_at: "2026-03-01T00:00:00Z",
  },
];

export const demoMetrics: DashboardMetrics = {
  matchesPlayed: 24,
  totalRuns: 912,
  battingAverage: 38.0,
  strikeRate: 134.2,
  trainingSessionsTotal: 47,
  trainingSessionsLast30Days: 12,
  trainingSessionsPerWeek: 3.2,
  weeklyTraining: [
    { label: "3w ago", value: 2 },
    { label: "2w ago", value: 3 },
    { label: "1w ago", value: 4 },
    { label: "This wk", value: 3 },
  ],
  goalsTotal: 5,
  goalsCompleted: 2,
  averageGoalProgress: 72,
  goalSummaries: [],
};

export const demoProgressSummary: ProgressSummary = {
  currentStreak: 12,
  activeGoals: 3,
  latestTrainingDate: "2026-06-22",
  latestMatchDate: "2026-06-20",
  totalTrainingSessions: 47,
  totalMatchPerformances: 24,
  hasAnyData: true,
};

export const demoWeeklyProgress: WeeklyProgress = {
  weekStart: "2026-06-16",
  weekEnd: "2026-06-22",
  trainingSessions: 3,
  matches: 1,
  totalTrainingMinutes: 225,
  totalTrainingBallsFaced: 260,
  totalMatchRuns: 68,
  activeGoals: 3,
  currentStreak: 12,
  hasDataThisWeek: true,
};

export const demoCoachMessage: CoachMessage = {
  label: "Coach insight",
  text: "Your batting average climbed 8% over the last month. Strike rate in the powerplay is trending up — keep attacking the first 6 overs with your current approach.",
};

export const demoSaveInsight: SaveInsight = {
  title: "Batting form updated",
  detail:
    "5-match rolling average: 52 runs. Latest innings: 68. Your form index is at its highest point this season.",
  chartData: [
    { label: "M1", value: 28 },
    { label: "M2", value: 35 },
    { label: "M3", value: 42 },
    { label: "M4", value: 45 },
    { label: "M5", value: 68 },
  ],
  chartSecondary: [
    { label: "M1", value: 28 },
    { label: "M2", value: 31 },
    { label: "M3", value: 35 },
    { label: "M4", value: 38 },
    { label: "M5", value: 44 },
  ],
};

export const demoStatsProgress: RoleProgressStats = {
  role: "all-rounder",
  batting: {
    totalRuns: 912,
    battingAverage: 38.0,
    strikeRate: 134.2,
    totalBallsFaced: 680,
    totalFours: 78,
    totalSixes: 24,
    weekRuns: { thisWeek: 68, lastWeek: 45 },
    weekMatches: { thisWeek: 1, lastWeek: 1 },
  },
  bowling: {
    totalWickets: 28,
    totalOvers: 86,
    runsConceded: 612,
    economy: 7.1,
    weekWickets: { thisWeek: 2, lastWeek: 1 },
    weekOvers: { thisWeek: 4, lastWeek: 3 },
  },
  training: {
    totalSessions: 47,
    totalMinutes: 3420,
    battingSessions: 28,
    bowlingSessions: 19,
    weekSessions: { thisWeek: 3, lastWeek: 4 },
  },
  goals: {
    total: 5,
    active: 3,
    completed: 2,
    averageProgress: 72,
  },
  consistency: {
    currentStreak: 12,
    loggedToday: false,
    lastActiveDate: "2026-06-22",
  },
  weeklyActivity: [
    { label: "Mon", value: 1 },
    { label: "Tue", value: 0 },
    { label: "Wed", value: 1 },
    { label: "Thu", value: 0 },
    { label: "Fri", value: 1 },
    { label: "Sat", value: 1 },
    { label: "Sun", value: 0 },
  ],
  weeklyCharts: [
    {
      id: "batting-scores",
      title: "Batting scores (last 8 matches)",
      data: [
        { label: "M1", value: 28 },
        { label: "M2", value: 35 },
        { label: "M3", value: 42 },
        { label: "M4", value: 31 },
        { label: "M5", value: 55 },
        { label: "M6", value: 48 },
        { label: "M7", value: 45 },
        { label: "M8", value: 68 },
      ],
      secondary: [
        { label: "M1", value: 28 },
        { label: "M2", value: 31 },
        { label: "M3", value: 35 },
        { label: "M4", value: 34 },
        { label: "M5", value: 38 },
        { label: "M6", value: 40 },
        { label: "M7", value: 42 },
        { label: "M8", value: 44 },
      ],
      secondaryColor: "var(--green-sage)",
      secondaryLabel: "Rolling avg",
      secondaryDashed: true,
    },
    {
      id: "training-volume",
      title: "Training volume (weekly)",
      data: [
        { label: "3w ago", value: 2 },
        { label: "2w ago", value: 3 },
        { label: "1w ago", value: 4 },
        { label: "This wk", value: 3 },
      ],
    },
  ],
  hasAnyData: true,
};

export const demoInsights = [
  {
    title: "Powerplay strike rate",
    detail:
      "Your strike rate in overs 1–6 improved from 118 to 147 over the last 6 innings. You're converting more dot balls into boundaries.",
    type: "trend" as const,
  },
  {
    title: "Training consistency",
    detail:
      "You've logged training 3+ times per week for 8 consecutive weeks. Players with this rhythm improve batting average 12% faster.",
    type: "pattern" as const,
  },
  {
    title: "Recommended focus",
    detail:
      "Add 20 minutes of death bowling practice. Your economy in overs 16–20 is 9.2 vs 6.8 in middle overs.",
    type: "recommendation" as const,
  },
];
