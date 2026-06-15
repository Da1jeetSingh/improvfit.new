/**
 * Founder-only access. Set FOUNDER_EMAIL in your environment to the account
 * that should access /admin. No general admin role system is used.
 */
export function getFounderEmail() {
  return process.env.FOUNDER_EMAIL?.trim().toLowerCase() ?? "";
}

export function isFounderEmail(email: string | null | undefined) {
  const founderEmail = getFounderEmail();

  if (!founderEmail || !email) {
    return false;
  }

  return email.trim().toLowerCase() === founderEmail;
}

export const adminRoute = "/admin" as const;

export function isAdminRoute(pathname: string) {
  return pathname === adminRoute || pathname.startsWith(`${adminRoute}/`);
}
