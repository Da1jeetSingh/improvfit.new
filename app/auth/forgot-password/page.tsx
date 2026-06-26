import { redirect } from "next/navigation";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthShell } from "@/components/layout/auth-shell";
import { dashboardRoute, getSession } from "@/lib/auth";

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect(dashboardRoute);
  }

  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
