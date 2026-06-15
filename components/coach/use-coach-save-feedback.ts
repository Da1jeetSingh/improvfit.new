"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useCoachSaveFeedback({
  coachMessage,
  fallbackMessage,
  variant,
  onSuccess,
}: {
  coachMessage?: string;
  fallbackMessage?: string;
  variant: "page" | "modal";
  onSuccess?: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (variant !== "modal" || !onSuccess) {
      return;
    }

    if (coachMessage) {
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
  }, [coachMessage, fallbackMessage, variant, onSuccess, router]);
}
