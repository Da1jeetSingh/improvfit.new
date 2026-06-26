import { createAdminClient } from "@/lib/supabase/admin";

export type WeeklyTrendPoint = {
  label: string;
  value: number;
};

export type FounderAnalytics = {
  totalUsers: number;
  signupsToday: number;
  signupsThisWeek: number;
  activeUsers: number;
  profileCompletions: number;
  trainingSessions: number;
  matchEntries: number;
  signupTrend: WeeklyTrendPoint[];
  activityTrend: WeeklyTrendPoint[];
};

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function startOfUtcWeek(date: Date) {
  const day = date.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const weekStart = new Date(date);
  weekStart.setUTCDate(date.getUTCDate() - diff);
  return startOfUtcDay(weekStart);
}

function getWeekLabel(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function buildWeeklyBuckets(weekCount: number, now: Date) {
  const buckets: { start: Date; label: string }[] = [];

  for (let index = weekCount - 1; index >= 0; index -= 1) {
    const start = startOfUtcWeek(now);
    start.setUTCDate(start.getUTCDate() - index * 7);
    buckets.push({
      start,
      label: getWeekLabel(start),
    });
  }

  return buckets;
}

function getWeekIndex(dateValue: string, buckets: { start: Date }[]) {
  const date = startOfUtcDay(new Date(`${dateValue.slice(0, 10)}T00:00:00Z`));

  for (let index = buckets.length - 1; index >= 0; index -= 1) {
    const bucketStart = buckets[index].start;
    const bucketEnd = new Date(bucketStart);
    bucketEnd.setUTCDate(bucketEnd.getUTCDate() + 7);

    if (date >= bucketStart && date < bucketEnd) {
      return index;
    }
  }

  return -1;
}

function requireAdminClient() {
  const supabase = createAdminClient();

  if (!supabase) {
    throw new Error(
      "Admin analytics is not configured. Set SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return supabase;
}

async function countProfiles(filter?: {
  createdAfter?: Date;
  onboardingCompleted?: boolean;
}) {
  const supabase = requireAdminClient();

  let query = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (filter?.createdAfter) {
    query = query.gte("created_at", filter.createdAfter.toISOString());
  }

  if (filter?.onboardingCompleted !== undefined) {
    query = query.eq("onboarding_completed", filter.onboardingCompleted);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

async function countTable(table: "training_sessions" | "matches") {
  const supabase = requireAdminClient();

  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

async function countActiveUsers(activeSince: Date) {
  const supabase = requireAdminClient();
  const activeSinceDate = activeSince.toISOString().slice(0, 10);

  const [trainingResult, matchResult] = await Promise.all([
    supabase
      .from("training_sessions")
      .select("user_id")
      .gte("session_date", activeSinceDate),
    supabase
      .from("matches")
      .select("user_id")
      .gte("played_on", activeSinceDate),
  ]);

  if (trainingResult.error) {
    throw new Error(trainingResult.error.message);
  }

  if (matchResult.error) {
    throw new Error(matchResult.error.message);
  }

  const activeUserIds = new Set<string>();

  for (const row of trainingResult.data ?? []) {
    activeUserIds.add(row.user_id);
  }

  for (const row of matchResult.data ?? []) {
    activeUserIds.add(row.user_id);
  }

  return activeUserIds.size;
}

async function getSignupTrend(weekCount: number, now: Date) {
  const supabase = requireAdminClient();
  const buckets = buildWeeklyBuckets(weekCount, now);
  const trendStart = buckets[0]?.start ?? startOfUtcWeek(now);

  const { data, error } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", trendStart.toISOString());

  if (error) {
    throw new Error(error.message);
  }

  const counts = buckets.map(() => 0);

  for (const profile of data ?? []) {
    const weekIndex = getWeekIndex(profile.created_at, buckets);

    if (weekIndex >= 0) {
      counts[weekIndex] += 1;
    }
  }

  return buckets.map((bucket, index) => ({
    label: bucket.label,
    value: counts[index],
  }));
}

async function getActivityTrend(weekCount: number, now: Date) {
  const supabase = requireAdminClient();
  const buckets = buildWeeklyBuckets(weekCount, now);
  const trendStart = buckets[0]?.start ?? startOfUtcWeek(now);
  const trendStartDate = trendStart.toISOString().slice(0, 10);

  const [trainingResult, matchResult] = await Promise.all([
    supabase
      .from("training_sessions")
      .select("session_date")
      .gte("session_date", trendStartDate),
    supabase
      .from("matches")
      .select("played_on")
      .gte("played_on", trendStartDate),
  ]);

  if (trainingResult.error) {
    throw new Error(trainingResult.error.message);
  }

  if (matchResult.error) {
    throw new Error(matchResult.error.message);
  }

  const counts = buckets.map(() => 0);

  for (const session of trainingResult.data ?? []) {
    const weekIndex = getWeekIndex(session.session_date, buckets);

    if (weekIndex >= 0) {
      counts[weekIndex] += 1;
    }
  }

  for (const match of matchResult.data ?? []) {
    const weekIndex = getWeekIndex(match.played_on, buckets);

    if (weekIndex >= 0) {
      counts[weekIndex] += 1;
    }
  }

  return buckets.map((bucket, index) => ({
    label: bucket.label,
    value: counts[index],
  }));
}

export async function getFounderAnalytics(): Promise<FounderAnalytics> {
  const now = new Date();
  const todayStart = startOfUtcDay(now);
  const weekStart = startOfUtcWeek(now);
  const activeSince = new Date(now);
  activeSince.setUTCDate(activeSince.getUTCDate() - 30);

  const [
    totalUsers,
    signupsToday,
    signupsThisWeek,
    activeUsers,
    profileCompletions,
    trainingSessions,
    matchEntries,
    signupTrend,
    activityTrend,
  ] = await Promise.all([
    countProfiles(),
    countProfiles({ createdAfter: todayStart }),
    countProfiles({ createdAfter: weekStart }),
    countActiveUsers(activeSince),
    countProfiles({ onboardingCompleted: true }),
    countTable("training_sessions"),
    countTable("matches"),
    getSignupTrend(4, now),
    getActivityTrend(4, now),
  ]);

  return {
    totalUsers,
    signupsToday,
    signupsThisWeek,
    activeUsers,
    profileCompletions,
    trainingSessions,
    matchEntries,
    signupTrend,
    activityTrend,
  };
}
