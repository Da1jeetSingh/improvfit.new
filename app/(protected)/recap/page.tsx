import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { RecapActivityChart } from "@/components/recap/recap-activity-chart";
import { RecapBattingSummary } from "@/components/recap/recap-batting-summary";
import { RecapComparison } from "@/components/recap/recap-comparison";
import { RecapHighlights } from "@/components/recap/recap-highlights";
import { RecapSummary } from "@/components/recap/recap-summary";
import { Card } from "@/components/ui/card";
import { alertErrorClassName, emptyCardClassName } from "@/components/ui/form-styles";
import { getMonthlyRecapData } from "@/lib/recap";

export default async function RecapPage() {
  const data = await getMonthlyRecapData();
  if (!data) redirect("/login");

  const { recap, recapError } = data;

  if (recapError) {
    return (
      <section className="space-y-10">
        <PageHeader
          eyebrow="Recap"
          title="Monthly recap"
          description="A coaching-style summary of your month."
        />
        <Card>
          <p className={alertErrorClassName} role="alert">
            Could not load monthly recap: {recapError}
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Recap"
        title={recap.monthLabel}
        description="Your month in review — activity, momentum, and progress at a glance."
      />

      {!recap.hasDataThisMonth ? (
        <Card className={emptyCardClassName}>
          <p className="text-sm leading-relaxed text-muted">
            No activity logged this month yet. Log a training session or match to
            start building your recap.
          </p>
        </Card>
      ) : null}

      <RecapSummary recap={recap} />
      <RecapBattingSummary recap={recap} />
      <RecapComparison recap={recap} />
      <RecapActivityChart recap={recap} />
      <RecapHighlights recap={recap} />
    </section>
  );
}
