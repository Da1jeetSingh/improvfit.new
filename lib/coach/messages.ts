import type { ActivityStreak } from "@/lib/dashboard/streak";
import type { RoleProgressStats } from "@/lib/stats/progress";
import { showsBattingLogFields, showsBowlingLogFields } from "@/lib/logging/role-fields";
import type { Goal } from "@/types/goal";
import type { Match } from "@/types/match";
import type { PlayerRole } from "@/types/profile";
import type { TrainingSession } from "@/types/training";

import type {
  CoachEvent,
  CoachMessage,
  ScoredCoachMessage,
} from "@/lib/coach/types";

export type CoachContext = {
  role: PlayerRole | null;
  firstName: string | null;
  progress: RoleProgressStats;
  streak: ActivityStreak;
  goals: Goal[];
  latestTraining?: TrainingSession;
  latestMatch?: Match;
  latestGoal?: Goal;
};

function withName(firstName: string | null, text: string) {
  return firstName ? `${firstName}, ${text}` : text;
}

function daysSince(dateKey: string | null) {
  if (!dateKey) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const then = new Date(`${dateKey}T00:00:00`);
  const diff = Math.round((today.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));

  return diff;
}

function pickHighest(messages: ScoredCoachMessage[]): CoachMessage | null {
  if (messages.length === 0) {
    return null;
  }

  const best = [...messages].sort((a, b) => b.score - a.score)[0];
  return { text: best.text, label: best.label ?? "Coach" };
}

function trainingSavedMessages(context: CoachContext): ScoredCoachMessage[] {
  const session = context.latestTraining;
  if (!session) {
    return [];
  }

  const messages: ScoredCoachMessage[] = [];
  const role = context.role;

  if (session.focus === "batting" && showsBattingLogFields(role)) {
    messages.push({
      score: 90,
      tone: "encourage",
      label: "Coach",
      text: withName(
        context.firstName,
        session.balls_faced
          ? `${session.balls_faced} balls faced in the nets — good volume. Stay patient and build innings shape.`
          : "batting work logged. Time in the middle compounds — keep showing up.",
      ),
    });
  }

  if (session.focus === "bowling" && showsBowlingLogFields(role)) {
    const workload =
      session.overs_bowled ?? session.balls_bowled
        ? `${session.overs_bowled ?? 0} overs logged`
        : "spell work logged";
    messages.push({
      score: 90,
      tone: "encourage",
      label: "Coach",
      text: withName(
        context.firstName,
        `${workload}. Hit your lengths early and build rhythm through the session.`,
      ),
    });
  }

  if (session.self_rating && session.self_rating >= 4) {
    messages.push({
      score: 75,
      tone: "celebrate",
      label: "Coach",
      text: withName(
        context.firstName,
        "you rated that session strongly — carry that confidence into your next outing.",
      ),
    });
  }

  if (messages.length === 0) {
    messages.push({
      score: 70,
      tone: "encourage",
      label: "Coach",
      text: withName(
        context.firstName,
        "session logged. Consistency beats intensity — stack another one this week.",
      ),
    });
  }

  return messages;
}

function matchSavedMessages(context: CoachContext): ScoredCoachMessage[] {
  const match = context.latestMatch;
  if (!match) {
    return [];
  }

  const messages: ScoredCoachMessage[] = [];
  const role = context.role;
  const runs = match.runs ?? 0;
  const wickets = match.wickets ?? 0;

  if (showsBattingLogFields(role) && runs >= 50) {
    messages.push({
      score: 95,
      tone: "celebrate",
      label: "Coach",
      text: withName(
        context.firstName,
        `${runs} runs — strong innings. Note what worked and repeat it under pressure.`,
      ),
    });
  } else if (showsBattingLogFields(role) && runs > 0) {
    messages.push({
      score: 85,
      tone: "encourage",
      label: "Coach",
      text: withName(
        context.firstName,
        runs >= 30
          ? "solid contribution with the bat. Build on this base next match."
          : "every innings teaches something — review your plan against this opposition.",
      ),
    });
  }

  if (showsBowlingLogFields(role) && wickets >= 3) {
    messages.push({
      score: 95,
      tone: "celebrate",
      label: "Coach",
      text: withName(
        context.firstName,
        `${wickets} wickets — match-winning impact. Bank this spell and back your stock ball.`,
      ),
    });
  } else if (showsBowlingLogFields(role) && wickets > 0) {
    messages.push({
      score: 85,
      tone: "encourage",
      label: "Coach",
      text: withName(
        context.firstName,
        `${wickets} wicket${wickets === 1 ? "" : "s"} in the book. Tighten your plans to the batter and bowl in partnerships.`,
      ),
    });
  }

  if (messages.length === 0) {
    messages.push({
      score: 70,
      tone: "encourage",
      label: "Coach",
      text: withName(
        context.firstName,
        "match logged. Honest review tonight beats guessing next week.",
      ),
    });
  }

  return messages;
}

function goalCreatedMessages(context: CoachContext): ScoredCoachMessage[] {
  const goal = context.latestGoal;
  if (!goal) {
    return [];
  }

  const roleHint =
    context.role === "bowler"
      ? "bowling"
      : context.role === "batsman"
        ? "batting"
        : "your game";

  return [
    {
      score: 90,
      tone: "encourage",
      label: "Coach",
      text: withName(
        context.firstName,
        `target set: "${goal.title}". Break it into weekly checkpoints and log ${roleHint} work that moves the number.`,
      ),
    },
  ];
}

function dashboardMessages(context: CoachContext): ScoredCoachMessage[] {
  const { progress, streak, goals } = context;
  const messages: ScoredCoachMessage[] = [];
  const inactiveDays = daysSince(progress.consistency.lastActiveDate);

  if (inactiveDays !== null && inactiveDays >= 7) {
    messages.push({
      score: 100,
      tone: "nudge",
      label: "Coach",
      text: withName(
        context.firstName,
        `it's been ${inactiveDays} days since your last log. One short session today restarts momentum.`,
      ),
    });
  }

  if (streak.currentStreak >= 7) {
    messages.push({
      score: 92,
      tone: "streak",
      label: "Coach",
      text: withName(
        context.firstName,
        `${streak.currentStreak}-day streak — that's elite discipline. Protect it with something small today.`,
      ),
    });
  } else if (streak.currentStreak >= 3) {
    messages.push({
      score: 80,
      tone: "streak",
      label: "Coach",
      text: withName(
        context.firstName,
        `${streak.currentStreak} days in a row. Habits are forming — don't break the chain.`,
      ),
    });
  }

  const trainingDelta =
    progress.training.weekSessions.thisWeek -
    progress.training.weekSessions.lastWeek;
  if (trainingDelta >= 2) {
    messages.push({
      score: 78,
      tone: "insight",
      label: "Coach",
      text: withName(
        context.firstName,
        `training volume is up ${trainingDelta} session${trainingDelta === 1 ? "" : "s"} on last week. Smart build — balance it with recovery.`,
      ),
    });
  }

  if (progress.batting) {
    const runsDelta =
      progress.batting.weekRuns.thisWeek - progress.batting.weekRuns.lastWeek;
    if (runsDelta >= 20) {
      messages.push({
        score: 76,
        tone: "insight",
        label: "Coach",
        text: withName(
          context.firstName,
          `scoring is up ${runsDelta} runs on last week. Convert this form while it's hot.`,
        ),
      });
    }
  }

  if (progress.bowling) {
    const wicketsDelta =
      progress.bowling.weekWickets.thisWeek -
      progress.bowling.weekWickets.lastWeek;
    if (wicketsDelta >= 2) {
      messages.push({
        score: 76,
        tone: "insight",
        label: "Coach",
        text: withName(
          context.firstName,
          `wickets are up on last week. Stay aggressive in your areas and bowl in partnerships.`,
        ),
      });
    }
  }

  const nearGoal = goals.find((goal) => {
    if (goal.status === "completed" || goal.target_value === null) {
      return false;
    }
    const pct = (goal.current_value / goal.target_value) * 100;
    return pct >= 75;
  });

  if (nearGoal) {
    messages.push({
      score: 74,
      tone: "insight",
      label: "Coach",
      text: withName(
        context.firstName,
        `"${nearGoal.title}" is within reach. One focused week could close it out.`,
      ),
    });
  }

  if (progress.goals.completed > 0 && progress.goals.active === 0) {
    messages.push({
      score: 72,
      tone: "celebrate",
      label: "Coach",
      text: withName(
        context.firstName,
        "all goals completed — set a fresh target while momentum is high.",
      ),
    });
  }

  if (!progress.hasAnyData) {
    messages.push({
      score: 60,
      tone: "encourage",
      label: "Coach",
      text: withName(
        context.firstName,
        "log your first session or match and I'll start tailoring feedback to your role.",
      ),
    });
  } else if (messages.length === 0) {
    const roleLine =
      context.role === "bowler"
        ? "Keep stacking bowling workload and review each spell."
        : context.role === "batsman"
          ? "Keep stacking time at the crease — volume creates clarity."
          : "Balance batting and bowling logs to see the full picture.";

    messages.push({
      score: 50,
      tone: "encourage",
      label: "Coach",
      text: withName(context.firstName, roleLine),
    });
  }

  return messages;
}

export function pickCoachMessage(
  event: CoachEvent,
  context: CoachContext,
): CoachMessage | null {
  let candidates: ScoredCoachMessage[] = [];

  switch (event) {
    case "training_saved":
      candidates = trainingSavedMessages(context);
      break;
    case "match_saved":
      candidates = matchSavedMessages(context);
      break;
    case "goal_created":
      candidates = goalCreatedMessages(context);
      break;
    case "dashboard":
      candidates = dashboardMessages(context);
      break;
  }

  return pickHighest(candidates);
}

export function coachMessageText(
  event: CoachEvent,
  context: CoachContext,
): string | undefined {
  return pickCoachMessage(event, context)?.text;
}
