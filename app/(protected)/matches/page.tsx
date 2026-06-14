import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { MatchForm } from "@/components/matches/match-form";
import { MatchList } from "@/components/matches/match-list";
import { alertErrorClassName } from "@/components/ui/form-styles";
import { getSession } from "@/lib/auth";
import { getMatches } from "@/lib/matches";

export default async function MatchesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { matches, error } = await getMatches();

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Match"
        title="Log match-day batting outcomes."
        description="Log match performances and review your own batting history."
      />

      {error ? (
        <p className={alertErrorClassName} role="alert">
          Could not load matches: {error}
        </p>
      ) : null}

      <MatchForm />
      <MatchList matches={matches} />
    </section>
  );
}
