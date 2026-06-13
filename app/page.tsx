import { redirect } from "next/navigation";

import { LandingPage } from "@/components/landing/landing-page";
import { dashboardRoute, getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect(dashboardRoute);
  }

  return <LandingPage />;
}
