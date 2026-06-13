import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { MatchForm } from "@/components/matches/match-form";
import { getSession } from "@/lib/auth";
import { getMatch } from "@/lib/matches";

type EditMatchPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMatchPage({ params }: EditMatchPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const match = await getMatch(id);
  if (!match) notFound();

  return (
    <section className="space-y-6">
      <Link
        href="/matches"
        className="text-sm font-semibold text-green-deep hover:underline"
      >
        ← Back to matches
      </Link>
      <PageHeader
        title="Edit match"
        description="Update this saved performance."
      />
      <MatchForm match={match} />
    </section>
  );
}
