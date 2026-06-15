"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { AchievementUnlock } from "@/lib/achievements";

const FEEDBACK_DELAY_MS = 2800;

export function useCoachSaveFeedback({
  coachMessage,
  achievementUnlocks,
  fallbackMessage,
  variant,
  onSuccess,
}: {
  coachMessage?: string;
  achievementUnlocks?: AchievementUnlock[];
  fallbackMessage?: string;
  variant: "page" | "modal";
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const hasAchievementUnlocks = Boolean(achievementUnlocks?.length);
  const hasRichFeedback = Boolean(coachMessage || hasAchievementUnlocks);

  useEffect(() => {
    if (variant !== "modal" || !onSuccess) {
      return;
    }

    if (hasRichFeedback) {
      router.refresh();
      const timeout = setTimeout(() => {
        onSuccess();
      }, FEEDBACK_DELAY_MS);

      return () => clearTimeout(timeout);
    }

    if (fallbackMessage) {
      router.refresh();
      const timeout = setTimeout(() => {
        onSuccess();
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [
    achievementUnlocks,
    coachMessage,
    fallbackMessage,
    hasAchievementUnlocks,
    hasRichFeedback,
    onSuccess,
    router,
    variant,
  ]);
}
