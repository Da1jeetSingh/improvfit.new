function startOfLocalDay(date: Date) {
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

export type MonthRange = {
  monthStart: Date;
  monthEnd: Date;
  monthStartKey: string;
  monthEndKey: string;
  monthLabel: string;
};

export function getMonthRange(date = new Date()): MonthRange {
  const monthStart = startOfLocalDay(
    new Date(date.getFullYear(), date.getMonth(), 1),
  );
  const monthEnd = startOfLocalDay(
    new Date(date.getFullYear(), date.getMonth() + 1, 0),
  );

  return {
    monthStart,
    monthEnd,
    monthStartKey: toLocalDateKey(monthStart),
    monthEndKey: toLocalDateKey(monthEnd),
    monthLabel: monthStart.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    }),
  };
}

export function getPreviousMonthRange(date = new Date()): MonthRange {
  const previous = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return getMonthRange(previous);
}

export function isDateInMonth(
  dateValue: string,
  monthStart: Date,
  monthEnd: Date,
) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date >= monthStart && date <= monthEnd;
}

export type MonthWeekBucket = {
  weekStart: Date;
  weekEnd: Date;
  label: string;
};

/** Calendar weeks (Mon–Sun) that overlap the given month. */
export function getWeekBucketsInMonth(
  monthStart: Date,
  monthEnd: Date,
): MonthWeekBucket[] {
  const buckets: MonthWeekBucket[] = [];
  let cursor = new Date(monthStart);
  const day = cursor.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  cursor = addLocalDays(cursor, -daysFromMonday);

  while (cursor <= monthEnd) {
    const weekStart = new Date(cursor);
    const weekEnd = addLocalDays(weekStart, 6);
    const clippedStart = weekStart < monthStart ? monthStart : weekStart;
    const clippedEnd = weekEnd > monthEnd ? monthEnd : weekEnd;

    buckets.push({
      weekStart: clippedStart,
      weekEnd: clippedEnd,
      label: clippedStart.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    });

    cursor = addLocalDays(weekStart, 7);
  }

  return buckets;
}
