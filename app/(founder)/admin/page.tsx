import Link from "next/link";

import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import {
  alertErrorClassName,
  sectionLinkClassName,
} from "@/components/ui/form-styles";
import { getFounderAnalytics } from "@/lib/admin/analytics";
import { dashboardRoute } from "@/lib/auth";
import { isAdminClientConfigured } from "@/lib/supabase/admin";

export default async function AdminPage() {
  let analytics = null;
  let error: string | null = null;

  if (!isAdminClientConfigured()) {
    error =
      "Admin analytics is not configured. Add SUPABASE_SERVICE_ROLE_KEY to your environment.";
  } else {
    try {
      analytics = await getFounderAnalytics();
    } catch (loadError) {
      error =
        loadError instanceof Error
          ? loadError.message
          : "Could not load analytics.";
    }
  }

  return (
    <section className="space-y-8">
      <header className="space-y-3 border-b border-border-subtle pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Founder only
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Signup analytics
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Private metrics for monitoring IMPROV growth. This page is not part
          of the player experience.
        </p>
        <Link href={dashboardRoute} className={sectionLinkClassName}>
          ← Back to dashboard
        </Link>
      </header>

      {error ? (
        <Card title="Analytics unavailable">
          <p className={alertErrorClassName} role="alert">
            {error}
          </p>
        </Card>
      ) : analytics ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            label="Total users"
            value={String(analytics.totalUsers)}
            hint="All registered profiles"
          />
          <StatTile
            label="Signups today"
            value={String(analytics.signupsToday)}
            hint="Since midnight UTC"
            accent
          />
          <StatTile
            label="Signups this week"
            value={String(analytics.signupsThisWeek)}
            hint="Since Monday UTC"
          />
          <StatTile
            label="Active users"
            value={String(analytics.activeUsers)}
            hint="Profile updated in last 7 days"
          />
        </div>
      ) : null}
    </section>
  );
}
