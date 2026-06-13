import { cn } from "@/lib/utils";

export const inputClassName = cn(
  "mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-base",
  "focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20",
);

export const labelClassName = "block text-sm font-medium text-zinc-700";

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
