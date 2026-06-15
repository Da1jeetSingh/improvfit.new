import { createAdminClient } from "@/lib/supabase/admin";

export type FounderAnalytics = {
  totalUsers: number;
  signupsToday: number;
  signupsThisWeek: number;
  activeUsers: number;
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

async function countProfiles(filter?: {
  createdAfter?: Date;
  updatedAfter?: Date;
}) {
  const supabase = createAdminClient();

  if (!supabase) {
    throw new Error(
      "Admin analytics is not configured. Set SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  let query = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (filter?.createdAfter) {
    query = query.gte("created_at", filter.createdAfter.toISOString());
  }

  if (filter?.updatedAfter) {
    query = query.gte("updated_at", filter.updatedAfter.toISOString());
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getFounderAnalytics(): Promise<FounderAnalytics> {
  const now = new Date();
  const todayStart = startOfUtcDay(now);
  const weekStart = startOfUtcWeek(now);
  const activeSince = new Date(now);
  activeSince.setUTCDate(activeSince.getUTCDate() - 7);

  const [totalUsers, signupsToday, signupsThisWeek, activeUsers] =
    await Promise.all([
      countProfiles(),
      countProfiles({ createdAfter: todayStart }),
      countProfiles({ createdAfter: weekStart }),
      countProfiles({ updatedAfter: activeSince }),
    ]);

  return {
    totalUsers,
    signupsToday,
    signupsThisWeek,
    activeUsers,
  };
}
