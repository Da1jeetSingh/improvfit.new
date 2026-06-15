import type { ComponentType } from "react";

import {
  DashboardNavIcon,
  GoalsNavIcon,
  MatchNavIcon,
  ProfileNavIcon,
  StatsNavIcon,
  TrainingNavIcon,
} from "@/components/layout/nav-icons";

export type AppNavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: ComponentType<{ className?: string }>;
};

export const primaryNavItems: AppNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    icon: DashboardNavIcon,
  },
  {
    href: "/matches",
    label: "Match",
    icon: MatchNavIcon,
  },
  {
    href: "/training",
    label: "Training",
    icon: TrainingNavIcon,
  },
  {
    href: "/goals",
    label: "Goals",
    icon: GoalsNavIcon,
  },
  {
    href: "/stats",
    label: "Stats",
    icon: StatsNavIcon,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: ProfileNavIcon,
  },
];

export const secondaryNavItems = [
  { href: "/weekly", label: "Weekly" },
  { href: "/recap", label: "Recap" },
  { href: "/milestones", label: "Awards" },
  { href: "/settings", label: "Settings" },
] as const;

export function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
