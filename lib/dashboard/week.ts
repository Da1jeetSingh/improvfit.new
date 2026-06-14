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

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export type WeekRange = {
  weekStart: Date;
  weekEnd: Date;
  weekStartKey: string;
  weekEndKey: string;
};

/** Current calendar week (Monday through Sunday). */
export function getCurrentWeekRange(date = new Date()): WeekRange {
  const today = startOfLocalDay(date);
  const day = today.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const weekStart = addLocalDays(today, -daysFromMonday);
  const weekEnd = addLocalDays(weekStart, 6);

  return {
    weekStart,
    weekEnd,
    weekStartKey: toLocalDateKey(weekStart),
    weekEndKey: toLocalDateKey(weekEnd),
  };
}

export function isDateInWeek(dateValue: string, weekStart: Date, weekEnd: Date) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date >= weekStart && date <= weekEnd;
}

/** Previous calendar week (Monday through Sunday) before the given date's current week. */
export function getPreviousWeekRange(date = new Date()): WeekRange {
  const current = getCurrentWeekRange(date);
  const weekEnd = addLocalDays(current.weekStart, -1);
  const weekStart = addLocalDays(weekEnd, -6);

  return {
    weekStart,
    weekEnd,
    weekStartKey: toLocalDateKey(weekStart),
    weekEndKey: toLocalDateKey(weekEnd),
  };
}
