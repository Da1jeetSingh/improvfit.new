"use client";

import { useActionState, useState } from "react";

import { OptionCard } from "@/components/onboarding/option-card";
import { BrandHeader } from "@/components/brand/brand-header";
import { Button } from "@/components/ui/button";
import {
  alertErrorClassName,
  formatLabel,
  labelClassName,
} from "@/components/ui/form-styles";
import {
  completeOnboarding,
  type OnboardingActionState,
} from "@/lib/onboarding/actions";
import {
  battingHands,
  battingOrders,
  bowlingHands,
  bowlingStyleDetails,
  bowlingTypes,
  playerRoles,
  playingLevels,
  skillLevels,
  type BattingHand,
  type BattingOrder,
  type BowlingHand,
  type BowlingStyleDetail,
  type BowlingType,
  type PlayerRole,
  type PlayingLevel,
  type SkillLevel,
} from "@/types/profile";

const initialState: OnboardingActionState = {};

const roleDescriptions: Record<(typeof playerRoles)[number], string> = {
  batsman: "Track batting form, strike rates, and scoring patterns.",
  bowler: "Log spells, variations, and bowling workload.",
  "all-rounder": "Balance batting and bowling in one performance hub.",
};

const playingLevelDescriptions: Record<(typeof playingLevels)[number], string> = {
  grassroots: "Just getting started or playing socially.",
  school: "School or college cricket.",
  club: "Regular club or league cricket.",
  academy: "Structured academy development.",
  county: "County or state-level cricket.",
  "semi-professional": "Paid or semi-pro cricket.",
  professional: "Full-time or pro cricket.",
};

type OnboardingFlowProps = {
  email?: string | null;
};

export function OnboardingFlow({ email }: OnboardingFlowProps) {
  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    initialState,
  );
  const [step, setStep] = useState(0);
  const [isAcademyPlayer, setIsAcademyPlayer] = useState<boolean | null>(null);
  const [playedProfessionally, setPlayedProfessionally] = useState<
    boolean | null
  >(null);
  const [tracksPerformance, setTracksPerformance] = useState<boolean | null>(
    null,
  );
  const [playingLevel, setPlayingLevel] = useState<PlayingLevel | null>(null);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null);
  const [role, setRole] = useState<PlayerRole | null>(null);
  const [battingHand, setBattingHand] = useState<BattingHand | null>(null);
  const [battingOrder, setBattingOrder] = useState<BattingOrder | null>(null);
  const [bowlingHand, setBowlingHand] = useState<BowlingHand | null>(null);
  const [bowlingType, setBowlingType] = useState<BowlingType | null>(null);
  const [bowlingStyleDetail, setBowlingStyleDetail] =
    useState<BowlingStyleDetail | null>(null);

  const needsBatting = role === "batsman" || role === "all-rounder";
  const needsBowling = role === "bowler" || role === "all-rounder";
  const totalSteps =
    2 +
    (needsBatting ? 1 : 0) +
    (needsBowling ? 1 : 0) +
    (needsBowling && bowlingType === "spinner" ? 1 : 0);

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
    setBowlingStyleDetail(null);
    setStep(2);
  }

  function handleBowlingTypeSelect(nextType: BowlingType) {
    setBowlingType(nextType);
    if (nextType !== "spinner") {
      setBowlingStyleDetail(null);
    }
  }

  const showBackgroundStep = step === 0;
  const showRoleStep = step === 1;
  const battingStepIndex = 2;
  const showBattingStep = needsBatting && step === battingStepIndex;
  const bowlingStepIndex = needsBatting ? 3 : 2;
  const showBowlingStep = needsBowling && step === bowlingStepIndex;
  const spinnerStepIndex = bowlingStepIndex + 1;
  const showSpinnerStep =
    needsBowling && bowlingType === "spinner" && step === spinnerStepIndex;
  const showReviewStep = step === totalSteps;

  const canContinueBackground = Boolean(
    isAcademyPlayer !== null &&
      playedProfessionally !== null &&
      tracksPerformance !== null &&
      playingLevel &&
      skillLevel,
  );
  const canContinueBatting = Boolean(battingHand && battingOrder);
  const canContinueBowling = Boolean(bowlingHand && bowlingType);
  const canContinueSpinner = Boolean(bowlingStyleDetail);

  return (
    <div className="relative flex min-h-full flex-col bg-background">
      <div className="ds-ambient" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:py-16">
        <div className="mb-10 animate-fade-in-up">
          <BrandHeader href="/" size="large" showLogo={false} />
        </div>

        <div className="animate-fade-in-up animate-delay-1">
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

          {showBackgroundStep ? (
            <section className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-green-deep sm:text-3xl">
                  Tell us about your cricket
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {email
                    ? "A few quick questions so IMPROV can tailor your experience."
                    : "A few quick questions so IMPROV can tailor your experience."}
                </p>
              </div>

              <BooleanQuestion
                label="Are you an academy player?"
                value={isAcademyPlayer}
                onChange={setIsAcademyPlayer}
              />

              <BooleanQuestion
                label="Have you played professionally?"
                value={playedProfessionally}
                onChange={setPlayedProfessionally}
              />

              <BooleanQuestion
                label="Do you currently track performance?"
                value={tracksPerformance}
                onChange={setTracksPerformance}
              />

              <div>
                <p className={labelClassName}>What level do you play at?</p>
                <div className="mt-3 space-y-3">
                  {playingLevels.map((level) => (
                    <OptionCard
                      key={level}
                      label={formatLabel(level)}
                      description={playingLevelDescriptions[level]}
                      selected={playingLevel === level}
                      onClick={() => setPlayingLevel(level)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className={labelClassName}>How would you rate your skill?</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {skillLevels.map((level) => (
                    <OptionCard
                      key={level}
                      label={formatLabel(level)}
                      selected={skillLevel === level}
                      onClick={() => setSkillLevel(level)}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="button"
                className="w-full"
                size="lg"
                disabled={!canContinueBackground}
                onClick={goNext}
              >
                Continue
              </Button>
            </section>
          ) : null}

          {showRoleStep ? (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-green-deep">
                  Your primary role
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  We will shape your dashboard and insights around this.
                </p>
              </div>

              <div className="space-y-3">
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

              <Button type="button" variant="ghost" onClick={goBack}>
                Back
              </Button>
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
                <p className={labelClassName}>Batting role</p>
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
                  disabled={!canContinueBatting}
                  onClick={() => {
                    if (needsBowling) {
                      goNext();
                      return;
                    }
                    setStep(totalSteps);
                  }}
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
                      onClick={() => handleBowlingTypeSelect(type)}
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
                  disabled={!canContinueBowling}
                  onClick={() => {
                    if (bowlingType === "spinner") {
                      goNext();
                      return;
                    }
                    setStep(totalSteps);
                  }}
                >
                  Continue
                </Button>
              </div>
            </section>
          ) : null}

          {showSpinnerStep ? (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-green-deep">
                  Spin style
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  One last detail so we can personalize your spin analysis.
                </p>
              </div>

              <div>
                <p className={labelClassName}>Bowling style</p>
                <div className="mt-3 space-y-3">
                  {bowlingStyleDetails.map((style) => (
                    <OptionCard
                      key={style}
                      label={formatLabel(style)}
                      selected={bowlingStyleDetail === style}
                      onClick={() => setBowlingStyleDetail(style)}
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
                  disabled={!canContinueSpinner}
                  onClick={() => setStep(totalSteps)}
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
                  IMPROV will personalize your dashboard around your cricket
                  background and playing style.
                </p>
              </div>

              <dl className="space-y-3 rounded-2xl border border-border bg-surface-raised p-5 shadow-soft">
                <SummaryRow
                  label="Academy player"
                  value={formatYesNo(isAcademyPlayer)}
                />
                <SummaryRow
                  label="Played professionally"
                  value={formatYesNo(playedProfessionally)}
                />
                <SummaryRow
                  label="Tracks performance"
                  value={formatYesNo(tracksPerformance)}
                />
                <SummaryRow
                  label="Playing level"
                  value={playingLevel ? formatLabel(playingLevel) : "—"}
                />
                <SummaryRow
                  label="Skill level"
                  value={skillLevel ? formatLabel(skillLevel) : "—"}
                />
                <SummaryRow label="Role" value={role ? formatLabel(role) : "—"} />
                {needsBatting ? (
                  <>
                    <SummaryRow
                      label="Batting hand"
                      value={battingHand ? formatLabel(battingHand) : "—"}
                    />
                    <SummaryRow
                      label="Batting role"
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
                    {bowlingType === "spinner" ? (
                      <SummaryRow
                        label="Spin style"
                        value={
                          bowlingStyleDetail
                            ? formatLabel(bowlingStyleDetail)
                            : "—"
                        }
                      />
                    ) : null}
                  </>
                ) : null}
              </dl>

              <form action={formAction} className="space-y-4">
                <input
                  type="hidden"
                  name="is_academy_player"
                  value={formatYesNoValue(isAcademyPlayer)}
                />
                <input
                  type="hidden"
                  name="played_professionally"
                  value={formatYesNoValue(playedProfessionally)}
                />
                <input
                  type="hidden"
                  name="tracks_performance"
                  value={formatYesNoValue(tracksPerformance)}
                />
                <input
                  type="hidden"
                  name="playing_level"
                  value={playingLevel ?? ""}
                />
                <input type="hidden" name="skill_level" value={skillLevel ?? ""} />
                <input type="hidden" name="role" value={role ?? ""} />
                {battingHand ? (
                  <input type="hidden" name="batting_hand" value={battingHand} />
                ) : null}
                {battingOrder ? (
                  <input type="hidden" name="batting_order" value={battingOrder} />
                ) : null}
                {bowlingHand ? (
                  <input type="hidden" name="bowling_hand" value={bowlingHand} />
                ) : null}
                {bowlingType ? (
                  <input type="hidden" name="bowling_type" value={bowlingType} />
                ) : null}
                {bowlingStyleDetail ? (
                  <input
                    type="hidden"
                    name="bowling_style_details"
                    value={bowlingStyleDetail}
                  />
                ) : null}

                {state.error ? (
                  <p className={alertErrorClassName} role="alert">
                    {state.error}
                  </p>
                ) : null}

                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={goBack}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? "Saving..." : "Enter IMPROV"}
                  </Button>
                </div>
              </form>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BooleanQuestion({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (next: boolean) => void;
}) {
  return (
    <div>
      <p className={labelClassName}>{label}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <OptionCard
          label="Yes"
          selected={value === true}
          onClick={() => onChange(true)}
        />
        <OptionCard
          label="No"
          selected={value === false}
          onClick={() => onChange(false)}
        />
      </div>
    </div>
  );
}

function formatYesNo(value: boolean | null) {
  if (value === null) {
    return "—";
  }

  return value ? "Yes" : "No";
}

function formatYesNoValue(value: boolean | null) {
  if (value === null) {
    return "";
  }

  return value ? "yes" : "no";
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-subtle pb-3 last:border-b-0 last:pb-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="text-sm font-bold text-foreground">{value}</dd>
    </div>
  );
}
