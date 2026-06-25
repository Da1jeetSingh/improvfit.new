"use client";

import { useState } from "react";

import { OptionCard } from "@/components/onboarding/option-card";
import { BrandHeader } from "@/components/brand/brand-header";
import { Button } from "@/components/ui/button";
import { formatLabel, labelClassName } from "@/components/ui/form-styles";
import {
  battingHands,
  battingOrders,
  bowlingHands,
  bowlingTypes,
  playerRoles,
  type BattingHand,
  type BattingOrder,
  type BowlingHand,
  type BowlingType,
  type PlayerRole,
} from "@/types/profile";

const roleDescriptions: Record<(typeof playerRoles)[number], string> = {
  batsman: "Track batting form, strike rates, and scoring patterns.",
  bowler: "Log spells, variations, and bowling workload.",
  "all-rounder": "Balance batting and bowling in one performance hub.",
};

export function DemoOnboardingFlow() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<PlayerRole | null>(null);
  const [battingHand, setBattingHand] = useState<BattingHand | null>(null);
  const [battingOrder, setBattingOrder] = useState<BattingOrder | null>(null);
  const [bowlingHand, setBowlingHand] = useState<BowlingHand | null>(null);
  const [bowlingType, setBowlingType] = useState<BowlingType | null>(null);
  const [goal, setGoal] = useState("");

  const needsBatting = role === "batsman" || role === "all-rounder";
  const needsBowling = role === "bowler" || role === "all-rounder";
  const totalSteps =
    1 + (needsBatting ? 1 : 0) + (needsBowling ? 1 : 0) + 1;

  const progress = Math.min(
    100,
    Math.round(((step + 1) / Math.max(totalSteps, 1)) * 100),
  );

  function goNext() {
    setStep((current) => current + 1);
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  function handleRoleSelect(nextRole: PlayerRole) {
    setRole(nextRole);
    setBattingHand(null);
    setBattingOrder(null);
    setBowlingHand(null);
    setBowlingType(null);
    setStep(1);
  }

  const battingStep = 1;
  const bowlingStep = needsBatting ? 2 : 1;
  const goalsStep = (needsBatting ? 1 : 0) + (needsBowling ? 1 : 0) + 1;
  const reviewStep = totalSteps;

  const showRoleStep = step === 0;
  const showBattingStep = needsBatting && step === battingStep;
  const showBowlingStep = needsBowling && step === bowlingStep;
  const showGoalsStep = step === goalsStep;
  const showReviewStep = step === reviewStep;

  return (
    <div
      className="relative flex min-h-full flex-col bg-background"
      data-video-demo="onboarding"
      data-step={step}
    >
      <div className="ds-ambient" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:py-16">
        <div className="mb-10">
          <BrandHeader href="/video-demo/landing" size="large" showLogo={false} />
        </div>

        <div>
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
              Setup · Step {Math.min(step + 1, totalSteps)} of {totalSteps}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border-subtle">
              <div
                className="h-full rounded-full bg-green-deep transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {showRoleStep ? (
            <section className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-green-deep sm:text-3xl">
                  Personalize IMPROV
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Tell us how you play so we can tailor your experience from day one.
                </p>
              </div>
              <div>
                <p className={labelClassName}>Your primary role</p>
                <div className="mt-3 space-y-3">
                  {playerRoles.map((option) => (
                    <OptionCard
                      key={option}
                      label={formatLabel(option)}
                      description={roleDescriptions[option]}
                      selected={role === option}
                      onClick={() => handleRoleSelect(option)}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {showBattingStep ? (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-green-deep">
                  Batting profile
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  We will prioritize batting insights and training prompts for you.
                </p>
              </div>
              <div>
                <p className={labelClassName}>Batting hand</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {battingHands.map((hand) => (
                    <OptionCard
                      key={hand}
                      label={formatLabel(hand)}
                      selected={battingHand === hand}
                      onClick={() => setBattingHand(hand)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className={labelClassName}>Batting order</p>
                <div className="mt-3 space-y-3">
                  {battingOrders.map((order) => (
                    <OptionCard
                      key={order}
                      label={formatLabel(order)}
                      selected={battingOrder === order}
                      onClick={() => setBattingOrder(order)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={!battingHand || !battingOrder}
                  onClick={goNext}
                  data-video-demo="batting-continue"
                >
                  Continue
                </Button>
              </div>
            </section>
          ) : null}

          {showBowlingStep ? (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-green-deep">
                  Bowling profile
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  We will shape your bowling workload and analysis around this.
                </p>
              </div>
              <div>
                <p className={labelClassName}>Bowling hand</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {bowlingHands.map((hand) => (
                    <OptionCard
                      key={hand}
                      label={formatLabel(hand)}
                      selected={bowlingHand === hand}
                      onClick={() => setBowlingHand(hand)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className={labelClassName}>Bowling type</p>
                <div className="mt-3 space-y-3">
                  {bowlingTypes.map((type) => (
                    <OptionCard
                      key={type}
                      label={formatLabel(type)}
                      selected={bowlingType === type}
                      onClick={() => setBowlingType(type)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={!bowlingHand || !bowlingType}
                  onClick={goNext}
                  data-video-demo="bowling-continue"
                >
                  Continue
                </Button>
              </div>
            </section>
          ) : null}

          {showGoalsStep ? (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-green-deep">
                  Your goals
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  What do you want to improve this season? IMPROV tracks progress toward
                  every goal you set.
                </p>
              </div>
              <div>
                <label htmlFor="demo-goal" className={labelClassName}>
                  Primary goal
                </label>
                <textarea
                  id="demo-goal"
                  rows={3}
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  placeholder="e.g. Raise my batting average to 40+"
                  data-video-demo="goal-input"
                  className="mt-2 w-full rounded-xl border border-border bg-surface-input px-4 py-3 text-sm text-foreground shadow-soft outline-none transition focus:border-green-sage focus:ring-2 focus:ring-green-muted"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={goNext}
                  data-video-demo="goals-continue"
                >
                  Continue
                </Button>
              </div>
            </section>
          ) : null}

          {showReviewStep ? (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-green-deep">
                  You are all set
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  IMPROV will personalize your dashboard around your role and playing
                  style.
                </p>
              </div>
              <dl className="space-y-3 rounded-2xl border border-border bg-surface-raised p-5 shadow-soft">
                <SummaryRow label="Role" value={role ? formatLabel(role) : "—"} />
                {needsBatting ? (
                  <>
                    <SummaryRow
                      label="Batting hand"
                      value={battingHand ? formatLabel(battingHand) : "—"}
                    />
                    <SummaryRow
                      label="Batting order"
                      value={battingOrder ? formatLabel(battingOrder) : "—"}
                    />
                  </>
                ) : null}
                {needsBowling ? (
                  <>
                    <SummaryRow
                      label="Bowling hand"
                      value={bowlingHand ? formatLabel(bowlingHand) : "—"}
                    />
                    <SummaryRow
                      label="Bowling type"
                      value={bowlingType ? formatLabel(bowlingType) : "—"}
                    />
                  </>
                ) : null}
                {goal ? <SummaryRow label="Goal" value={goal} /> : null}
              </dl>
              <Button
                type="button"
                className="w-full"
                size="lg"
                data-video-demo="enter-improv"
              >
                Enter IMPROV
              </Button>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-subtle pb-3 last:border-b-0 last:pb-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="text-right text-sm font-bold text-foreground">{value}</dd>
    </div>
  );
}
