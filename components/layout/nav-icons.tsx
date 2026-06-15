import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NavIconProps = {
  className?: string;
};

function NavIcon({
  className,
  children,
}: NavIconProps & { children: ReactNode }) {
  return (
    <svg
      className={cn("h-5 w-5 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function DashboardNavIcon({ className }: NavIconProps) {
  return (
    <NavIcon className={className}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </NavIcon>
  );
}

export function MatchNavIcon({ className }: NavIconProps) {
  return (
    <NavIcon className={className}>
      <path d="M12 3c4.2 2.4 6.5 5.8 6.5 9.5S16.2 19.6 12 21C7.8 19.6 5.5 16.2 5.5 12.5S7.8 5.4 12 3Z" />
      <path d="M12 3v18" />
    </NavIcon>
  );
}

export function TrainingNavIcon({ className }: NavIconProps) {
  return (
    <NavIcon className={className}>
      <path d="M6.5 7.5 12 4l5.5 3.5v9L12 20l-5.5-3.5v-9Z" />
      <path d="M12 4v16" />
    </NavIcon>
  );
}

export function GoalsNavIcon({ className }: NavIconProps) {
  return (
    <NavIcon className={className}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2.5" />
    </NavIcon>
  );
}

export function StatsNavIcon({ className }: NavIconProps) {
  return (
    <NavIcon className={className}>
      <path d="M5 19V11" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
    </NavIcon>
  );
}

export function ProfileNavIcon({ className }: NavIconProps) {
  return (
    <NavIcon className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19c1.2-3 3.3-4.5 6.5-4.5s5.3 1.5 6.5 4.5" />
    </NavIcon>
  );
}
