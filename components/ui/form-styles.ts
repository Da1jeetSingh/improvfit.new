import { cn } from "@/lib/utils";

export const labelClassName = "block text-sm font-semibold text-foreground";

export const inputClassName = cn(
  "mt-1.5 w-full rounded-xl border-2 border-border bg-white px-4 py-2.5 text-base text-foreground",
  "placeholder:text-muted/70",
  "focus:border-green-deep focus:outline-none focus:ring-2 focus:ring-green-deep/15",
);

export function formatLabel(value: string) {
  return value
    .split(/[\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
