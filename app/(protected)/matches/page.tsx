import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { MatchForm } from "@/components/matches/match-form";
import { MatchList } from "@/components/matches/match-list";
import { getSession } from "@/lib/auth";
import { getMatches } from "@/lib/matches";

export default async function MatchesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const matches = await getMatches();

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Performance"
        title="Matches"
        description="Log batting performances and track your match history."
      />
      <MatchForm />
      <MatchList matches={matches} />
    </section>
  );
}
