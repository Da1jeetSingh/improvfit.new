import { redirect } from "next/navigation";

import { MatchForm } from "@/components/matches/match-form";
import { MatchList } from "@/components/matches/match-list";
import { getSession } from "@/lib/auth";
import { getMatches } from "@/lib/matches";

export default async function MatchesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const matches = await getMatches();

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Matches</h1>
        <p className="mt-2 text-zinc-600">
          Log batting performances and review your match history.
        </p>
      </header>

      <MatchForm />
      <MatchList matches={matches} />
    </section>
  );
}
