import Link from "next/link";

import { BrandHeader } from "@/components/brand/brand-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/ui/stat-tile";

const quickStats = [
  { label: "Form Index", value: "92" },
  { label: "Win Impact", value: "+18%" },
  { label: "Consistency", value: "69%" },
  { label: "Streak", value: "12d" },
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

      <header className="border-b border-border-subtle bg-surface-raised">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <BrandHeader href="/" size="large" showLogo={false} />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
        <section className="mx-auto max-w-3xl animate-fade-in-up">
          <Badge variant="eyebrow" className="text-xs">
            Premium sports performance
          </Badge>
          <h1 className="mt-5 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            IMPROV
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            A premium performance platform for serious athletes — log training,
            track match outcomes, and convert ambition into visible progress.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" fullWidth className="sm:min-w-[200px]">
                Log training →
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                fullWidth
                className="sm:min-w-[200px]"
              >
                View stats
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 animate-fade-in-up animate-delay-1">
          {quickStats.map((stat) => (
            <StatTile
              key={stat.label}
              compact
              label={stat.label}
              value={stat.value}
            />
          ))}
        </section>

        <section className="mt-14 ds-surface p-8 sm:p-10 animate-fade-in-up animate-delay-2">
          <div className="mx-auto max-w-2xl">
            <Badge variant="section">Player profile</Badge>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-green-deep sm:text-3xl">
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
                className="ds-surface-subtle flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-foreground-secondary"
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
