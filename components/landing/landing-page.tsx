import Link from "next/link";

import { BrandHeader } from "@/components/brand/brand-header";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/ui/stat-tile";

const highlights = [
  {
    label: "Training logs",
    value: "Sessions",
    hint: "Track nets, drills, and practice",
  },
  {
    label: "Match stats",
    value: "Performance",
    hint: "Runs, strike rate, and form",
  },
  {
    label: "Goals & streaks",
    value: "Progress",
    hint: "Stay consistent week to week",
  },
] as const;

export function LandingPage() {
  return (
    <div className="relative min-h-full bg-background-warm">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--green-muted)_0%,_transparent_55%)]"
        aria-hidden
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <BrandHeader href="/" size="large" />
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="sm:px-4">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="sm:px-4">
              Create account
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-14">
        <section className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-deep">
            Player-only cricket performance
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Train smarter. Play better. Prove your progress.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            IMPROV helps you log training, match performances, and goals in one
            premium performance hub — built for players who care about improvement.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" fullWidth className="sm:min-w-[200px]">
                Create account
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                fullWidth
                className="sm:min-w-[200px]"
              >
                Log in
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3 animate-fade-in-up animate-delay-1">
          {highlights.map((item) => (
            <StatTile
              key={item.label}
              compact
              label={item.label}
              value={item.value}
              hint={item.hint}
            />
          ))}
        </section>

        <section className="mt-16 premium-surface p-8 text-center animate-fade-in-up animate-delay-2 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Everything you need to improve — nothing you don&apos;t.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Dashboard summaries, weekly progress, stats, milestones, and more —
            designed to feel clean, focused, and high-end.
          </p>
        </section>
      </main>
    </div>
  );
}
