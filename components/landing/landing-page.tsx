import Link from "next/link";

import { BrandHeader } from "@/components/brand/brand-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartBars } from "@/components/ui/chart-bars";
import { ChartLine } from "@/components/ui/chart-line";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatTile } from "@/components/ui/stat-tile";

const heroStats = [
  { label: "Sessions logged", value: "847", hint: "This month across beta" },
  { label: "Progress trend", value: "+24%", hint: "Avg. improvement rate" },
  { label: "Consistency", value: "78%", hint: "Training adherence" },
  { label: "Goals completed", value: "312", hint: "Targets hit this season" },
] as const;

const benefits = [
  {
    title: "Track every session",
    description:
      "Log nets, gym, and match prep in seconds. No more guessing what you did last week.",
  },
  {
    title: "Measure real progress",
    description:
      "See your batting average, strike rate, and training volume trend over time — not just vibes.",
  },
  {
    title: "Spot your weaknesses",
    description:
      "IMPROV surfaces patterns you'd miss: low-scoring phases, missed training weeks, goal gaps.",
  },
  {
    title: "Stay consistent",
    description:
      "Streaks, weekly targets, and consistency scores keep you showing up when motivation dips.",
  },
  {
    title: "Improve faster",
    description:
      "Know exactly what's working. Cut the noise and focus on the sessions that move the needle.",
  },
  {
    title: "Set and hit goals",
    description:
      "Define targets for runs, wickets, or training volume — then track progress session by session.",
  },
] as const;

const painPoints = [
  {
    title: "Training without proof",
    description:
      "You put in the hours at nets, but can't tell if your cover drive is actually getting better.",
  },
  {
    title: "Match stats in your head",
    description:
      "Scores, dismissals, and form — scattered across memory, group chats, and old scorebooks.",
  },
  {
    title: "Coaches flying blind",
    description:
    "Notebooks, WhatsApp, spreadsheets. No single view of a player's development over a season.",
  },
  {
    title: "Goals that fade",
    description:
      "You set targets at the start of the season. By round three, you've forgotten what they were.",
  },
] as const;

const workflowSteps = [
  {
    step: "01",
    title: "Log session",
    description:
      "Record training or a match in under a minute. Runs, wickets, focus areas — done.",
  },
  {
    step: "02",
    title: "See progress",
    description:
      "Your dashboard updates instantly. Trends, streaks, and goal progress — all in one place.",
  },
  {
    step: "03",
    title: "Improve faster",
    description:
      "Spot what's slipping, double down on what works, and walk into your next innings prepared.",
  },
] as const;

const testimonials = [
  {
    quote:
      "I finally know if my net sessions are actually paying off. Game changer for my pre-season.",
    name: "Arjun M.",
    role: "Academy batsman, U19",
  },
  {
    quote:
      "My players log their own sessions now. I can see who's putting in the work before they even tell me.",
    name: "Coach Priya S.",
    role: "Junior cricket coach",
  },
  {
    quote:
      "Used to track everything in Notes. IMPROV gives me the trends I was never going to spot myself.",
    name: "Rohan K.",
    role: "Club cricketer",
  },
] as const;

const audiences = [
  "Academy players building a season",
  "Beginners who want structure from day one",
  "Club cricketers chasing selection",
  "Coaches tracking player development",
] as const;

const faqs = [
  {
    question: "Is IMPROV free to use?",
    answer:
      "Yes — the beta is free. Start tracking sessions, matches, and goals at no cost while we build the full platform.",
  },
  {
    question: "What can I track?",
    answer:
      "Training sessions, match performances, personal goals, and weekly progress. Everything a serious cricketer needs to measure improvement.",
  },
  {
    question: "Do I need a coach to use it?",
    answer:
      "Not at all. IMPROV is built for players first. Coaches can use it too, but you don't need one to get value from day one.",
  },
  {
    question: "How long does logging take?",
    answer:
      "Under a minute per session. Quick entry, instant dashboard update. Built for busy players, not data entry clerks.",
  },
] as const;

const weeklyChart = [
  { label: "Mon", value: 2 },
  { label: "Tue", value: 0 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 1 },
  { label: "Fri", value: 4 },
  { label: "Sat", value: 2 },
  { label: "Sun", value: 5 },
] as const;

const progressChart = [
  { label: "Wk 1", value: 28 },
  { label: "Wk 2", value: 34 },
  { label: "Wk 3", value: 31 },
  { label: "Wk 4", value: 42 },
  { label: "Wk 5", value: 48 },
  { label: "Wk 6", value: 55 },
] as const;

function DashboardPreview() {
  return (
    <div className="ds-surface overflow-hidden shadow-elevated">
      <div className="flex items-center justify-between border-b border-border-subtle bg-green-tint/40 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="font-horizon text-sm font-bold tracking-wide text-green-deep">
            IMPROV
          </span>
          <Badge variant="success" className="text-[10px]">
            Live
          </Badge>
        </div>
        <span className="text-xs font-medium text-muted">Week 6 · Season 2026</span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-3">
          <StatTile compact label="Batting avg" value="38.4" accent />
          <StatTile compact label="Training (30d)" value="18" />
          <StatTile compact label="Matches" value="12" />
          <StatTile compact label="Streak" value="9d" />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Weekly activity
          </p>
          <ChartBars data={[...weeklyChart]} className="h-36" />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Batting average trend
          </p>
          <ChartLine
            data={[...progressChart]}
            aria-label="Batting average trend over six weeks"
          />
        </div>

        <div className="rounded-xl border border-border-subtle bg-green-tint/30 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              Score 50+ in next 3 innings
            </p>
            <span className="text-xs font-bold text-green-brand">67%</span>
          </div>
          <ProgressBar value={67} showLabel={false} className="mt-3" />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  badge,
  title,
  description,
  light = false,
}: {
  badge: string;
  title: string;
  description: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Badge variant={light ? "muted" : "section"}>{badge}</Badge>
      <h2
        className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 text-base leading-relaxed sm:text-lg ${
          light ? "text-white/75" : "text-muted"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="relative min-h-full bg-background">
      <div className="ds-ambient" aria-hidden />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-raised/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <BrandHeader href="/" size="large" showLogo={false} />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Start tracking free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="landing-hero-glow absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
            <div className="animate-fade-in-up">
              <Badge variant="brand" className="text-xs">
                Cricket performance tracking
              </Badge>
              <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
                Know if you&apos;re actually{" "}
                <span className="text-green-deep">getting better</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                IMPROV tracks your training, match performance, and goals — so
                you stop guessing and start improving with data that matters.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" fullWidth className="sm:min-w-[220px]">
                    Start tracking free →
                  </Button>
                </Link>
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    fullWidth
                    className="sm:min-w-[200px]"
                  >
                    Log your first session
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-subtle">
                Free beta · No credit card · Built for serious cricketers
              </p>
            </div>

            <div className="animate-fade-in-up animate-delay-1">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-border-subtle bg-surface-raised">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-border-subtle sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-raised px-4 py-6 sm:px-6 sm:py-8"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                  {stat.label}
                </p>
                <p className="mt-1.5 text-3xl font-bold tracking-tight text-green-deep sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-subtle">{stat.hint}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Problem */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            badge="The problem"
            title="You train hard. But are you improving?"
            description="Most players grind through nets and matches without a clear picture of what's working. Sound familiar?"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {painPoints.map((point) => (
              <div
                key={point.title}
                className="ds-surface-subtle p-6 sm:p-7"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
                  ✕
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section className="landing-section-dark py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              badge="How it works"
              title="Three steps to better cricket"
              description="No complicated setup. Log, review, improve — that's the whole system."
              light
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  {index < workflowSteps.length - 1 ? (
                    <div
                      className="absolute left-1/2 top-8 hidden h-px w-full bg-white/15 sm:block"
                      aria-hidden
                    />
                  ) : null}
                  <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-7">
                    <span className="text-3xl font-bold text-green-soft">
                      {step.step}
                    </span>
                    <h3 className="mt-4 text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-green-deep hover:bg-green-tint"
                >
                  Join the beta →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            badge="Why IMPROV"
            title="Built for players who care about results"
            description="Every feature exists for one reason: help you train smarter and perform better."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} className="ds-surface p-6 sm:p-7">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-deep text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Product preview */}
        <section className="border-y border-border-subtle bg-surface py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Badge variant="section">Product preview</Badge>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Your performance dashboard, always up to date
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                  Batting stats, training volume, goal progress, and weekly
                  trends — everything you need before you walk out to bat.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Real-time stats after every session",
                    "Weekly and monthly progress views",
                    "Goal tracking with visual progress",
                    "Consistency scores and streaks",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm font-medium text-foreground-secondary"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-deep text-[10px] text-white">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/signup">
                    <Button size="lg">Start tracking free →</Button>
                  </Link>
                </div>
              </div>
              <div className="lg:pl-4">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            badge="Who it's for"
            title="Serious cricket. Smarter tracking."
            description="Whether you're chasing academy selection or just want to stop winging it — IMPROV is your performance edge."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {audiences.map((audience) => (
              <span
                key={audience}
                className="rounded-full border border-border bg-surface-raised px-4 py-2 text-sm font-medium text-foreground-secondary shadow-soft"
              >
                {audience}
              </span>
            ))}
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="ds-surface flex flex-col p-6 sm:p-7"
              >
                <p className="flex-1 text-sm leading-relaxed text-foreground-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-5 border-t border-border-subtle pt-4">
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border-subtle bg-surface py-20 sm:py-24">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <SectionHeading
              badge="FAQ"
              title="Quick answers"
              description="Everything you need to know before you log your first session."
            />
            <dl className="mt-12 space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="ds-surface-subtle p-5 sm:p-6"
                >
                  <dt className="text-base font-bold text-foreground">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Final CTA */}
        <section className="landing-section-dark py-20 sm:py-24">
          <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Stop guessing. Start improving.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              Join players who track their cricket properly. Your first session
              takes less than a minute.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full bg-white text-green-deep hover:bg-green-tint sm:min-w-[220px]"
                >
                  Start tracking free →
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 sm:min-w-[200px]"
                >
                  Join the beta
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-surface-raised">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <BrandHeader href="/" size="default" showLogo={false} />
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} IMPROV · Cricket performance tracking
          </p>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-xs font-medium text-muted hover:text-green-deep"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-xs font-medium text-green-deep hover:text-green-brand"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
