import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import {
  SettingsAccountCard,
  SettingsLogoutCard,
} from "@/components/settings/settings-account-card";
import { SettingsActionsCard } from "@/components/settings/settings-actions";
import { pageSectionClassName } from "@/components/ui/form-styles";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/profile";

export default async function SettingsPage() {
  const [session, profile] = await Promise.all([getSession(), getProfile()]);

  if (!session || !profile) {
    redirect("/login");
  }

  return (
    <section className={pageSectionClassName}>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your account, profile, and session."
      />

      <SettingsAccountCard profile={profile} email={session.user.email} />
      <SettingsActionsCard />
      <SettingsLogoutCard />
    </section>
  );
}
