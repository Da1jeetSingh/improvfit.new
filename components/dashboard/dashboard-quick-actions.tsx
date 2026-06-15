import Link from "next/link";

import { actionLinkClassName } from "@/components/ui/form-styles";

const actions = [
  { href: "/matches", label: "Log match" },
  { href: "/training", label: "Log training" },
  { href: "/goals", label: "Set goal" },
] as const;

export function DashboardQuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Link key={action.href} href={action.href} className={actionLinkClassName}>
          {action.label}
        </Link>
      ))}
    </div>
  );
}
