import type { ActivityStreak } from "@/lib/dashboard/streak";

export type StreakReminderCopy = {
  title: string;
  body: string;
  /** Short line for push notification previews */
  preview: string;
};

/**
 * Copy for streak retention push/email reminders.
 * Ready to wire into notification services.
 */
export function getStreakReminderCopy(streak: ActivityStreak): StreakReminderCopy | null {
  if (streak.loggedToday) {
    return null;
  }

  const { currentStreak } = streak;

  if (currentStreak === 0) {
    return {
      title: "Start your streak today",
      body: "Log a training session or match to begin building momentum.",
      preview: "One log today starts your streak.",
    };
  }

  if (currentStreak === 1) {
    return {
      title: "Keep the chain going",
      body: "You started a streak yesterday. Log something today to make it two days.",
      preview: "You're only one session away from a 2-day streak.",
    };
  }

  if (currentStreak === 2) {
    return {
      title: "Almost at 3 days",
      body: "You're only one session away from your 3-day streak. A quick net or match log locks it in.",
      preview: "You're only one session away from your 3-day streak.",
    };
  }

  if (currentStreak >= 3 && currentStreak < 7) {
    return {
      title: `${currentStreak}-day streak on the line`,
      body: `You've logged ${currentStreak} days in a row. One session today keeps the run alive.`,
      preview: `Protect your ${currentStreak}-day streak — log today.`,
    };
  }

  if (currentStreak >= 7) {
    return {
      title: "Elite streak — don't break it",
      body: `${currentStreak} days strong. Log today and keep the discipline rolling.`,
      preview: `${currentStreak}-day streak — one log keeps it alive.`,
    };
  }

  return null;
}

export function getStreakReminderPreview(streak: ActivityStreak): string | null {
  return getStreakReminderCopy(streak)?.preview ?? null;
}
