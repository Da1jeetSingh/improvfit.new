import Link from "next/link";

import { formatLabel } from "@/components/ui/form-styles";
import { formatProfileValue, type PlayerProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

import { ProfileAvatar } from "./profile-avatar";

type ProfileHeaderProps = {
  profile: PlayerProfile;
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const displayName = profile.full_name?.trim() || "Cricket athlete";
  const roleLabel = profile.role ? formatLabel(profile.role) : null;
  const tagline = profile.personal_goals?.trim();

  return (
    <header className="ds-surface-subtle overflow-hidden px-5 py-6 sm:px-7 sm:py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
          <ProfileAvatar name={profile.full_name} email={profile.email} />

          <div className="min-w-0 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-sage">
              Athlete profile
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {displayName}
            </h1>

            {roleLabel ? (
              <p className="text-sm font-semibold text-green-deep">{roleLabel}</p>
            ) : (
              <p className="text-sm text-muted">Role not set yet</p>
            )}

            {tagline ? (
              <p className="max-w-xl text-sm leading-relaxed text-muted">
                {tagline}
              </p>
            ) : null}

            {profile.skill_level ? (
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {formatProfileValue(profile.skill_level)} level
              </p>
            ) : null}
          </div>
        </div>

        <Link
          href="/profile/edit"
          className={cn(
            "inline-flex shrink-0 items-center justify-center self-start rounded-2xl border border-border bg-surface-raised px-5 py-2.5 text-sm font-semibold text-foreground shadow-soft transition-all duration-200",
            "hover:border-green-sage/30 hover:bg-green-tint/40 active:scale-[0.98]",
          )}
        >
          Edit profile
        </Link>
      </div>
    </header>
  );
}
