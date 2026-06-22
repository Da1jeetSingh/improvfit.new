"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { AchievementUnlock } from "@/lib/achievements";
import type { SaveInsight } from "@/lib/stats/save-insights";

export function useCoachSaveFeedback({
  coachMessage,
  achievementUnlocks,
  saveInsight,
  fallbackMessage,
  variant,
  onSuccess,
}: {
  coachMessage?: string;
  achievementUnlocks?: AchievementUnlock[];
  saveInsight?: SaveInsight;
  fallbackMessage?: string;
  variant: "page" | "modal";
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const hasAchievementUnlocks = Boolean(achievementUnlocks?.length);
  const hasFeedback = Boolean(coachMessage || hasAchievementUnlocks || saveInsight);

  useEffect(() => {
    if (variant !== "modal" || !onSuccess) {
      return;
    }

    if (hasFeedback) {
      router.refresh();
      const timeout = setTimeout(() => {
        onSuccess();
      }, saveInsight ? 3600 : 2800);

      return () => clearTimeout(timeout);
    }

    if (fallbackMessage) {
      router.refresh();
      onSuccess();
    }
  }, [
    achievementUnlocks,
    coachMessage,
    fallbackMessage,
    hasFeedback,
    onSuccess,
    router,
    saveInsight,
    variant,
  ]);
}
