import { logout } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={cn(
          "rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700",
          "hover:bg-zinc-50",
        )}
      >
        Log out
      </button>
    </form>
  );
}
