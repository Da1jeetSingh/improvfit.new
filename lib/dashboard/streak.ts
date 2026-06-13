import type { Match } from "@/types/match";
import type { TrainingSession } from "@/types/training";

export type ActivityStreak = {
  /** Consecutive calendar days with at least one training session or match logged. */
  currentStreak: number;
  /** Most recent day with activity (YYYY-MM-DD), or null if none. */
  lastActiveDate: string | null;
  /** Whether the user has logged activity today. */
  loggedToday: boolean;
};

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfLocalDay(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addLocalDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function collectActivityDates(
  sessions: TrainingSession[],
  matches: Match[],
) {
  const dates = new Set<string>();

  for (const session of sessions) {
    dates.add(session.session_date);
  }

  for (const match of matches) {
    dates.add(match.played_on);
  }

  return dates;
}

/**
 * Duolingo-style grace: if you logged yesterday but not yet today, the streak
 * still counts until today ends. If you skip a full calendar day, it resets to 0.
 */
export function calculateActivityStreak(
  sessions: TrainingSession[],
  matches: Match[],
): ActivityStreak {
  const activityDates = collectActivityDates(sessions, matches);

  if (activityDates.size === 0) {
    return {
      currentStreak: 0,
      lastActiveDate: null,
      loggedToday: false,
    };
  }

  const today = startOfLocalDay();
  const yesterday = addLocalDays(today, -1);
  const todayKey = toLocalDateKey(today);
  const yesterdayKey = toLocalDateKey(yesterday);

  const lastActiveDate = [...activityDates].sort().at(-1) ?? null;
  const loggedToday = activityDates.has(todayKey);

  let anchor: Date | null = null;

  if (loggedToday) {
    anchor = today;
  } else if (activityDates.has(yesterdayKey)) {
    anchor = yesterday;
  } else {
    return {
      currentStreak: 0,
      lastActiveDate,
      loggedToday: false,
    };
  }

  let currentStreak = 0;
  let cursor = anchor;

  while (activityDates.has(toLocalDateKey(cursor))) {
    currentStreak += 1;
    cursor = addLocalDays(cursor, -1);
  }

  return {
    currentStreak,
    lastActiveDate,
    loggedToday,
  };
}

/** Longest consecutive calendar-day activity streak from all logged history. */
export function calculateBestStreak(
  sessions: TrainingSession[],
  matches: Match[],
): number {
  const activityDates = [...collectActivityDates(sessions, matches)].sort();

  if (activityDates.length === 0) {
    return 0;
  }

  let best = 1;
  let current = 1;

  for (let index = 1; index < activityDates.length; index += 1) {
    const previous = new Date(`${activityDates[index - 1]}T00:00:00`);
    const day = new Date(`${activityDates[index]}T00:00:00`);
    const dayGap = Math.round(
      (day.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (dayGap === 1) {
      current += 1;
      best = Math.max(best, current);
    } else if (dayGap > 1) {
      current = 1;
    }
  }

  return best;
}
