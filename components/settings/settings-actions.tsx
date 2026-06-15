import Link from "next/link";

import { Card } from "@/components/ui/card";
import { listRowClassName } from "@/components/ui/form-styles";
import { cn } from "@/lib/utils";

type SettingsLinkRowProps = {
  href: string;
  label: string;
  description: string;
  external?: boolean;
};

function SettingsLinkRow({
  href,
  label,
  description,
  external = false,
}: SettingsLinkRowProps) {
  const className = cn(
    "block px-4 py-3.5 transition-colors hover:bg-green-tint/30",
    listRowClassName,
  );

  const content = (
    <>
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>
      <span className="text-sm font-semibold text-green-deep" aria-hidden>
        →
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className, "flex items-center justify-between gap-4")}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(className, "flex items-center justify-between gap-4")}>
      {content}
    </Link>
  );
}

export function SettingsActionsCard() {
  return (
    <Card title="Preferences" description="Manage your profile and app options.">
      <div className="divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-subtle">
        <SettingsLinkRow
          href="/profile/edit"
          label="Edit profile"
          description="Update your name, role, and cricket identity."
        />
        <SettingsLinkRow
          href="/profile"
          label="View athlete profile"
          description="See your stats, badges, and playing identity."
        />
        <SettingsLinkRow
          href="mailto:hello@improvfit.app"
          label="Help & support"
          description="Get in touch if you need assistance."
          external
        />
        <div className={cn("px-4 py-3.5", listRowClassName)}>
          <p className="font-semibold text-foreground">Privacy</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Your training logs, matches, and goals are private to your account.
          </p>
        </div>
      </div>
    </Card>
  );
}
