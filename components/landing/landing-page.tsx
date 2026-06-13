import Link from "next/link";

import { BrandHeader } from "@/components/brand/brand-header";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/ui/stat-tile";

const highlights = [
  {
    label: "Training intelligence",
    value: "Sessions",
    hint: "Structured practice logging",
  },
  {
    label: "Match analytics",
    value: "Performance",
    hint: "Runs, form, and outcomes",
  },
  {
    label: "Development arc",
    value: "Progress",
    hint: "Goals, streaks, and milestones",
  },
] as const;

const pillars = [
  "Measurable improvement over time",
  "Disciplined training rhythm",
  "Calm, data-driven decisions",
] as const;

export function LandingPage() {
  return (
    <div className="relative min-h-full bg-background">
      <div className="ds-ambient" aria-hidden />

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

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-16">
        <section className="mx-auto max-w-3xl text-center animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-green-deep">
            Athlete performance operating system
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Professional development. Measurable growth.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            IMPROV is a premium performance platform for serious athletes —
            combining training intelligence, match analytics, and long-term
            progress in one calm, disciplined workspace.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" fullWidth className="sm:min-w-[220px]">
                Start developing
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                fullWidth
                className="sm:min-w-[220px]"
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

        <section className="mt-16 ds-surface p-8 sm:p-10 animate-fade-in-up animate-delay-2">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built for athletes who take development seriously
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              A trustworthy, intelligent environment — not a flashy fitness toy.
              Track what matters, review with clarity, and build consistency over
              seasons.
            </p>
          </div>
          <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-3">
            {pillars.map((pillar) => (
              <li
                key={pillar}
                className="ds-surface-subtle flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground-secondary"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-deep" />
                {pillar}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
