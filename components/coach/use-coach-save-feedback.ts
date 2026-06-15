"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { AchievementUnlock } from "@/lib/achievements";

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
  const hasFeedback = Boolean(coachMessage || hasAchievementUnlocks);

  useEffect(() => {
    if (variant !== "modal" || !onSuccess) {
      return;
    }

    if (hasFeedback) {
      router.refresh();
      const timeout = setTimeout(() => {
        onSuccess();
      }, 2800);

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
    variant,
  ]);
}
