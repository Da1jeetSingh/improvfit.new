import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { MatchForm } from "@/components/matches/match-form";
import { getSession } from "@/lib/auth";
import { getMatch } from "@/lib/matches";

type EditMatchPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMatchPage({ params }: EditMatchPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const match = await getMatch(id);

  if (!match) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <header>
        <Link
          href="/matches"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to matches
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Edit match</h1>
        <p className="mt-2 text-zinc-600">Update this saved performance.</p>
      </header>

      <MatchForm match={match} />
    </section>
  );
}
