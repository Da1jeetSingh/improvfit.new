import { FounderAnalyticsDashboard, FounderAnalyticsError } from "@/components/admin/founder-analytics-dashboard";
import { getFounderAnalytics } from "@/lib/admin/analytics";
import type { FounderAnalytics } from "@/lib/admin/analytics";
import { isAdminClientConfigured } from "@/lib/supabase/admin";

async function loadFounderAnalytics(): Promise<
  { analytics: FounderAnalytics } | { error: string }
> {
  try {
    const analytics = await getFounderAnalytics();
    return { analytics };
  } catch (loadError) {
    return {
      error:
        loadError instanceof Error
          ? loadError.message
          : "Could not load analytics.",
    };
  }
}

export default async function AdminPage() {
  if (!isAdminClientConfigured()) {
    return (
      <FounderAnalyticsError message="Admin analytics is not configured. Add SUPABASE_SERVICE_ROLE_KEY to your environment." />
    );
  }

  const result = await loadFounderAnalytics();

  if ("error" in result) {
    return <FounderAnalyticsError message={result.error} />;
  }

  return <FounderAnalyticsDashboard analytics={result.analytics} />;
}
