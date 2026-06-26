import { redirect } from "next/navigation";

import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { AuthShell } from "@/components/layout/auth-shell";
import { getSession, loginRoute } from "@/lib/auth";

export default async function UpdatePasswordPage() {
  const session = await getSession();

  if (!session) {
    redirect(`${loginRoute}?error=auth_callback_failed`);
  }

  return (
    <AuthShell
      title="Choose a new password"
      description="Set a new password for your account."
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
