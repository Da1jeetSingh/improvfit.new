import { cn } from "@/lib/utils";

type OptionCardProps = {
  label: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  name?: string;
  value?: string;
  type?: "button" | "radio";
};

export function OptionCard({
  label,
  description,
  selected,
  onClick,
  name,
  value,
  type = "button",
}: OptionCardProps) {
  const className = cn(
    "group w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200",
    "hover:border-green-sage/40 hover:bg-green-tint/30",
    selected
      ? "border-green-deep bg-green-tint shadow-soft ring-4 ring-green-deep/8"
      : "border-border bg-surface-raised",
  );

  if (type === "radio" && name && value) {
    return (
      <label className={cn(className, "cursor-pointer")}>
        <input
          type="radio"
          name={name}
          value={value}
          defaultChecked={selected}
          className="sr-only"
          onChange={onClick}
        />
        <span className="block text-base font-bold text-foreground">{label}</span>
        {description ? (
          <span className="mt-1 block text-sm leading-relaxed text-muted">
            {description}
          </span>
        ) : null}
      </label>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <span className="block text-base font-bold text-foreground">{label}</span>
      {description ? (
        <span className="mt-1 block text-sm leading-relaxed text-muted">
          {description}
        </span>
      ) : null}
    </button>
  );
}
