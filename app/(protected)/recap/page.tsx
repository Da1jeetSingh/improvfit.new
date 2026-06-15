import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { RecapActivityChart } from "@/components/recap/recap-activity-chart";
import { RecapComparison } from "@/components/recap/recap-comparison";
import { RecapHighlights } from "@/components/recap/recap-highlights";
import { RecapSummary } from "@/components/recap/recap-summary";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { alertErrorClassName, pageSectionClassName } from "@/components/ui/form-styles";
import { getMonthlyRecapData } from "@/lib/recap";

export default async function RecapPage() {
  const data = await getMonthlyRecapData();
  if (!data) redirect("/login");

  const { recap, recapError } = data;

  if (recapError) {
    return (
      <section className={pageSectionClassName}>
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
    <section className={pageSectionClassName}>
      <PageHeader
        eyebrow="Recap"
        title={recap.monthLabel}
        description="Your month in review — activity, momentum, and progress at a glance."
      />

      {!recap.hasDataThisMonth ? (
        <EmptyState
          title="Getting started"
          message="No activity logged this month yet. Log a training session or match to start building your recap."
        />
      ) : null}

      <RecapSummary recap={recap} />
      <RecapComparison recap={recap} />
      <RecapActivityChart recap={recap} />
      <RecapHighlights recap={recap} />
    </section>
  );
}
