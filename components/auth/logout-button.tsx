import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action="/auth/logout" method="post">
      <Button type="submit" variant="ghost" className="border border-border-subtle">
        Log out
      </Button>
    </form>
  );
}
