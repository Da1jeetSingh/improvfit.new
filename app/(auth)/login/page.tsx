import { AuthShell } from "@/components/layout/auth-shell";
import { AuthTabs } from "@/components/auth/auth-tabs";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
    tab?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      description="Track your cricket performance, one session at a time."
    >
      <AuthTabs
        next={params.next ?? "/dashboard"}
        defaultTab={params.tab === "signup" ? "signup" : "login"}
        callbackError={params.error === "auth_callback_failed"}
      />
    </AuthShell>
  );
}
