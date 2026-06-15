import { redirect } from "next/navigation";

import { AddMatchButton } from "@/components/matches/match-form";
import { MatchList } from "@/components/matches/match-list";
import { PageHeader } from "@/components/layout/page-header";
import { alertErrorClassName } from "@/components/ui/form-styles";
import { getSession } from "@/lib/auth";
import { getMatches } from "@/lib/matches";
import { getProfile } from "@/lib/profile";

export default async function MatchesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [profile, { matches, error }] = await Promise.all([
    getProfile(),
    getMatches(),
  ]);

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          className="mb-0 flex-1"
          eyebrow="Match"
          title="Match log"
          description="Review your performances and log new match-day outcomes."
        />
        <AddMatchButton role={profile?.role ?? null} />
      </div>

      {error ? (
        <p className={alertErrorClassName} role="alert">
          Could not load matches: {error}
        </p>
      ) : null}

      <MatchList matches={matches} />
    </section>
  );
}
