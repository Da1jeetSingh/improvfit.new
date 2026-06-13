import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { MatchForm } from "@/components/matches/match-form";
import { MatchList } from "@/components/matches/match-list";
import { getSession } from "@/lib/auth";
import { getMatches } from "@/lib/matches";

export default async function MatchesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { matches, error } = await getMatches();

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Performance"
        title="Matches"
        description="Log match performances and review your own batting history."
      />

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          Could not load matches: {error}
        </p>
      ) : null}

      <MatchForm />
      <MatchList matches={matches} />
    </section>
  );
}
