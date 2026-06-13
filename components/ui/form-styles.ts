import { cn } from "@/lib/utils";

export const labelClassName =
  "block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted";

export const inputClassName = cn(
  "mt-2 w-full rounded-2xl border border-border bg-surface-input px-4 py-3 text-base text-foreground",
  "placeholder:text-muted-subtle",
  "transition-all duration-200 ease-out",
  "hover:border-green-sage/30",
  "focus:border-green-deep focus:outline-none focus:ring-4 focus:ring-green-deep/8",
);

export const selectClassName = inputClassName;

export const textareaClassName = cn(inputClassName, "min-h-[108px] resize-y");

export const sectionLinkClassName = cn(
  "text-link inline-flex items-center gap-1 text-sm font-semibold transition-all duration-200",
  "hover:gap-1.5",
);

export const actionLinkClassName = cn(
  "inline-flex items-center rounded-2xl border border-border bg-surface-raised px-4 py-2 text-sm font-semibold text-foreground shadow-soft",
  "transition-all duration-200 hover:border-green-sage/30 hover:bg-green-tint/40 active:scale-[0.98]",
);

export const emptyCardClassName = "ds-empty";

export const sectionHeadingClassName =
  "text-xl font-bold tracking-tight text-foreground";

export const listRowClassName = "ds-surface-subtle rounded-2xl";

export const alertErrorClassName =
  "rounded-2xl border border-red-200/60 bg-red-50 px-4 py-3 text-sm text-red-700";

export const alertSuccessClassName =
  "rounded-2xl border border-green-muted bg-green-tint px-4 py-3 text-sm font-semibold text-green-deep";

export const formFooterClassName =
  "rounded-2xl bg-surface px-4 py-3 text-sm text-muted border border-border-subtle";

export const highlightValueClassName =
  "rounded-2xl border border-border-subtle bg-surface px-5 py-4 text-center";

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
