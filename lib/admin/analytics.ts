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
  userGrowthTrend: WeeklyTrendPoint[];
  activeUsersTrend: WeeklyTrendPoint[];
  signupTrend: WeeklyTrendPoint[];
  trainingTrend: WeeklyTrendPoint[];
  matchTrend: WeeklyTrendPoint[];
  profileCompletionTrend: WeeklyTrendPoint[];
  trendWeekCount: number;
};

const TREND_WEEK_COUNT = 8;

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
  const buckets: { start: Date; end: Date; label: string }[] = [];

  for (let index = weekCount - 1; index >= 0; index -= 1) {
    const start = startOfUtcWeek(now);
    start.setUTCDate(start.getUTCDate() - index * 7);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);

    buckets.push({
      start,
      end,
      label: getWeekLabel(start),
    });
  }

  return buckets;
}

function getWeekIndex(dateValue: string, buckets: { start: Date; end: Date }[]) {
  const date = startOfUtcDay(new Date(`${dateValue.slice(0, 10)}T00:00:00Z`));

  for (let index = buckets.length - 1; index >= 0; index -= 1) {
    const bucket = buckets[index];

    if (date >= bucket.start && date < bucket.end) {
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
  createdBefore?: Date;
  onboardingCompleted?: boolean;
}) {
  const supabase = requireAdminClient();

  let query = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (filter?.createdAfter) {
    query = query.gte("created_at", filter.createdAfter.toISOString());
  }

  if (filter?.createdBefore) {
    query = query.lt("created_at", filter.createdBefore.toISOString());
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

async function countTable(
  table: "training_sessions" | "matches",
  filter?: { createdAfter?: string; createdBefore?: string },
) {
  const supabase = requireAdminClient();

  let query = supabase.from(table).select("id", { count: "exact", head: true });

  const dateColumn = table === "training_sessions" ? "session_date" : "played_on";

  if (filter?.createdAfter) {
    query = query.gte(dateColumn, filter.createdAfter);
  }

  if (filter?.createdBefore) {
    query = query.lt(dateColumn, filter.createdBefore);
  }

  const { count, error } = await query;

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

async function countActiveUsersInRange(start: Date, end: Date) {
  const supabase = requireAdminClient();
  const startDate = start.toISOString().slice(0, 10);
  const endDate = end.toISOString().slice(0, 10);

  const [trainingResult, matchResult] = await Promise.all([
    supabase
      .from("training_sessions")
      .select("user_id")
      .gte("session_date", startDate)
      .lt("session_date", endDate),
    supabase
      .from("matches")
      .select("user_id")
      .gte("played_on", startDate)
      .lt("played_on", endDate),
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

async function getProfileCompletionTrend(weekCount: number, now: Date) {
  const supabase = requireAdminClient();
  const buckets = buildWeeklyBuckets(weekCount, now);
  const trendStart = buckets[0]?.start ?? startOfUtcWeek(now);

  const { data, error } = await supabase
    .from("profiles")
    .select("updated_at")
    .eq("onboarding_completed", true)
    .gte("updated_at", trendStart.toISOString());

  if (error) {
    throw new Error(error.message);
  }

  const counts = buckets.map(() => 0);

  for (const profile of data ?? []) {
    const weekIndex = getWeekIndex(profile.updated_at, buckets);

    if (weekIndex >= 0) {
      counts[weekIndex] += 1;
    }
  }

  return buckets.map((bucket, index) => ({
    label: bucket.label,
    value: counts[index],
  }));
}

async function getDateKeyedTrend(
  weekCount: number,
  now: Date,
  table: "training_sessions" | "matches",
  dateColumn: "session_date" | "played_on",
) {
  const supabase = requireAdminClient();
  const buckets = buildWeeklyBuckets(weekCount, now);
  const trendStart = buckets[0]?.start ?? startOfUtcWeek(now);
  const trendStartDate = trendStart.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from(table)
    .select(dateColumn)
    .gte(dateColumn, trendStartDate);

  if (error) {
    throw new Error(error.message);
  }

  const counts = buckets.map(() => 0);

  for (const row of data ?? []) {
    const dateValue = String(row[dateColumn as keyof typeof row]);
    const weekIndex = getWeekIndex(dateValue, buckets);

    if (weekIndex >= 0) {
      counts[weekIndex] += 1;
    }
  }

  return buckets.map((bucket, index) => ({
    label: bucket.label,
    value: counts[index],
  }));
}

async function getUserGrowthTrend(weekCount: number, now: Date) {
  const buckets = buildWeeklyBuckets(weekCount, now);

  const values = await Promise.all(
    buckets.map((bucket) => countProfiles({ createdBefore: bucket.end })),
  );

  return buckets.map((bucket, index) => ({
    label: bucket.label,
    value: values[index],
  }));
}

async function getActiveUsersTrend(weekCount: number, now: Date) {
  const buckets = buildWeeklyBuckets(weekCount, now);

  const values = await Promise.all(
    buckets.map((bucket) => countActiveUsersInRange(bucket.start, bucket.end)),
  );

  return buckets.map((bucket, index) => ({
    label: bucket.label,
    value: values[index],
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
    userGrowthTrend,
    activeUsersTrend,
    signupTrend,
    trainingTrend,
    matchTrend,
    profileCompletionTrend,
  ] = await Promise.all([
    countProfiles(),
    countProfiles({ createdAfter: todayStart }),
    countProfiles({ createdAfter: weekStart }),
    countActiveUsers(activeSince),
    countProfiles({ onboardingCompleted: true }),
    countTable("training_sessions"),
    countTable("matches"),
    getUserGrowthTrend(TREND_WEEK_COUNT, now),
    getActiveUsersTrend(TREND_WEEK_COUNT, now),
    getSignupTrend(TREND_WEEK_COUNT, now),
    getDateKeyedTrend(TREND_WEEK_COUNT, now, "training_sessions", "session_date"),
    getDateKeyedTrend(TREND_WEEK_COUNT, now, "matches", "played_on"),
    getProfileCompletionTrend(TREND_WEEK_COUNT, now),
  ]);

  return {
    totalUsers,
    signupsToday,
    signupsThisWeek,
    activeUsers,
    profileCompletions,
    trainingSessions,
    matchEntries,
    userGrowthTrend,
    activeUsersTrend,
    signupTrend,
    trainingTrend,
    matchTrend,
    profileCompletionTrend,
    trendWeekCount: TREND_WEEK_COUNT,
  };
}
