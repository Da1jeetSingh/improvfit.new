export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl(next?: string) {
  const url = new URL("/auth/callback", getSiteUrl());

  if (next) {
    url.searchParams.set("next", next);
  }

  return url.toString();
}
