import { LogoutButton } from "@/components/auth/logout-button";
import { Card } from "@/components/ui/card";
import { listRowClassName } from "@/components/ui/form-styles";
import { formatProfileValue, type PlayerProfile } from "@/types/profile";

type SettingsAccountCardProps = {
  profile: PlayerProfile;
  email: string | null | undefined;
};

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={`flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between ${listRowClassName}`}
    >
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export function SettingsAccountCard({ profile, email }: SettingsAccountCardProps) {
  const memberSince = new Date(profile.created_at).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <Card title="Account" description="Your signed-in IMPROV account.">
      <dl className="space-y-1">
        <AccountRow label="Email" value={email?.trim() || "—"} />
        <AccountRow
          label="Name"
          value={formatProfileValue(profile.full_name)}
        />
        <AccountRow
          label="Role"
          value={formatProfileValue(profile.role)}
        />
        <AccountRow label="Member since" value={memberSince} />
      </dl>
    </Card>
  );
}

export function SettingsLogoutCard() {
  return (
    <Card title="Sign out" description="End your session on this device.">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          You can sign back in anytime with your email and password.
        </p>
        <LogoutButton />
      </div>
    </Card>
  );
}
