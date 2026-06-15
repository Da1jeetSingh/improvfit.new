import { formatLabel } from "@/components/ui/form-styles";
import { formatProfileValue, type PlayerProfile } from "@/types/profile";

export function getDashboardSubtitle(profile: PlayerProfile | null) {
  if (!profile?.role) {
    return "Your performance hub — log activity and track progress.";
  }

  const role = formatLabel(profile.role);

  if (profile.role === "batsman") {
    const hand = profile.batting_hand
      ? formatProfileValue(profile.batting_hand)
      : null;
    const order = profile.batting_order
      ? formatProfileValue(profile.batting_order)
      : null;

    if (hand && order) {
      return `${role} · ${hand}-hand · ${order}`;
    }
  }

  if (profile.role === "bowler") {
    const hand = profile.bowling_hand
      ? formatProfileValue(profile.bowling_hand)
      : null;
    const type = profile.bowling_type
      ? formatProfileValue(profile.bowling_type)
      : null;

    if (hand && type) {
      const spin =
        profile.bowling_type === "spinner" && profile.bowling_style_details
          ? ` · ${formatProfileValue(profile.bowling_style_details)}`
          : "";
      return `${role} · ${hand}-arm · ${type}${spin}`;
    }
  }

  if (profile.role === "all-rounder") {
    return `${role} · batting and bowling tracked`;
  }

  return `${role} · your performance at a glance`;
}
