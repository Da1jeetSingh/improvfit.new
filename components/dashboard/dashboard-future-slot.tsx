import { Card } from "@/components/ui/card";
import { emptyCardClassName } from "@/components/ui/form-styles";

type DashboardFutureSlotProps = {
  title: string;
  description: string;
};

/**
 * Reserved layout slot for upcoming dashboard modules (coach, milestones, etc.).
 */
export function DashboardFutureSlot({
  title,
  description,
}: DashboardFutureSlotProps) {
  return (
    <Card
      title={title}
      description={description}
      className={`hidden min-h-[12rem] border-dashed lg:block ${emptyCardClassName}`}
      aria-hidden
    >
      <span className="sr-only">Reserved for a future dashboard module.</span>
    </Card>
  );
}
