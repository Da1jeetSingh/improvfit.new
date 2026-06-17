import { redirect } from "next/navigation";

import { AuthShell } from "@/components/layout/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { dashboardRoute, getSession } from "@/lib/auth";

export default async function SignupPage() {
  const session = await getSession();

  if (session) {
    redirect(dashboardRoute);
  }

  return (
    <AuthShell
      title="Create your account"
      description="Tell us a little about yourself to get started."
    >
      <SignupForm />
    </AuthShell>
  );
}
