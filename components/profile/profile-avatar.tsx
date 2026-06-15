import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  name: string | null;
  email: string | null;
  className?: string;
  size?: "md" | "lg";
};

export function getProfileInitials(
  name: string | null,
  email: string | null,
): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  }

  if (email?.trim()) {
    return email.trim().charAt(0).toUpperCase();
  }

  return "IM";
}

export function ProfileAvatar({
  name,
  email,
  className,
  size = "lg",
}: ProfileAvatarProps) {
  const initials = getProfileInitials(name, email);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl border border-green-sage/30 bg-gradient-to-br from-green-tint via-white to-amber-50 font-bold tracking-tight text-green-deep shadow-soft",
        size === "lg" ? "h-20 w-20 text-2xl" : "h-14 w-14 text-lg",
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}
