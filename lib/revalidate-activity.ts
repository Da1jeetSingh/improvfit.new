import { revalidatePath } from "next/cache";

const activityPaths = [
  "/dashboard",
  "/profile",
  "/stats",
  "/weekly",
  "/recap",
  "/milestones",
] as const;

export function revalidateActivityPaths(...extraPaths: string[]) {
  const paths = new Set<string>([...activityPaths, ...extraPaths]);

  for (const path of paths) {
    revalidatePath(path);
  }
}
